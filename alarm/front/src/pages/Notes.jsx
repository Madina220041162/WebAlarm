import React, { useState, useEffect } from "react";
import { notesAPI, getAuthToken } from "../services/api";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [isPinned, setIsPinned] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const COLORS = ["yellow", "blue", "green", "pink", "purple"];

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      if (!getAuthToken()) {
        setError("Please login to view notes");
        return;
      }

      const data = await notesAPI.getAll();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.message || "Error loading notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!getAuthToken()) {
        setError("Authentication required. Please login first.");
        return;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        color,
        isPinned,
      };

      if (editingId) {
        await notesAPI.update(editingId, payload);
        setEditingId(null);
      } else {
        await notesAPI.create(payload);
      }

      fetchNotes();
      setTitle("");
      setContent("");
      setColor("yellow");
      setIsPinned(false);
    } catch (error) {
      console.error("Error saving note:", error);
      setError(error.message || "Error saving note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await notesAPI.delete(id);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      setError(error.message || "Error deleting note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinToggle = async (id, currentPinnedState) => {
    try {
      const note = notes.find((n) => n._id === id);
      if (!note) return;

      await notesAPI.update(id, {
        ...note,
        isPinned: !currentPinnedState,
      });

      fetchNotes();
    } catch (error) {
      console.error("Error toggling pin:", error);
      setError(error.message || "Error updating note");
    }
  };

  const handleEditNote = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || "yellow");
    setIsPinned(note.isPinned || false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setColor("yellow");
    setIsPinned(false);
    setError("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(filter.toLowerCase()) ||
      note.content.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort: pinned notes first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="notes-container">
      <h2>📝 Notes</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Note Editor */}
      <div className="notes-editor">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="notes-input"
          disabled={loading}
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="notes-textarea"
          disabled={loading}
        ></textarea>

        <div className="notes-options">
          <div className="color-picker">
            <label>Color:</label>
            <div className="color-buttons">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`color-btn color-${c} ${
                    color === c ? "selected" : ""
                  }`}
                  onClick={() => setColor(c)}
                  disabled={loading}
                  title={c}
                />
              ))}
            </div>
          </div>

          <label className="pin-checkbox">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              disabled={loading}
            />
            📌 Pin this note
          </label>
        </div>

        <div className="notes-actions">
          <button
            onClick={handleSaveNote}
            className="btn-save"
            disabled={loading}
          >
            {editingId ? "Update Note" : "Save Note"}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search / Filter */}
      <input
        type="text"
        placeholder="Search notes..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="notes-search"
        disabled={loading}
      />

      {/* Notes List */}
      {loading && <p className="loading">Loading notes...</p>}

      <div className="notes-list">
        {sortedNotes.length === 0 ? (
          <p className="no-notes">
            {filter ? "No notes match your search" : "No notes yet. Create one!"}
          </p>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note._id}
              className={`note-card color-${note.color || "yellow"}`}
            >
              <div className="note-header">
                <div className="note-title-section">
                  {note.isPinned && <span className="pin-icon">📌</span>}
                  <h3>{note.title}</h3>
                </div>
                <div className="note-actions-icons">
                  <button
                    onClick={() => handlePinToggle(note._id, note.isPinned)}
                    className="btn-pin"
                    title={note.isPinned ? "Unpin" : "Pin"}
                  >
                    {note.isPinned ? "📌" : "📍"}
                  </button>
                  <button
                    onClick={() => handleEditNote(note)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
              <p className="note-date">
                {new Date(note.updatedAt).toLocaleDateString()} at{" "}
                {new Date(note.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
