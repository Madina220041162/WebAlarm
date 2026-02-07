import React, { useState, useEffect } from "react";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");

  const API_URL = "http://localhost:5000/api/notes";

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (editingId) {
        // Update existing note
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags: tagArray }),
        });
        if (response.ok) {
          fetchNotes();
          setEditingId(null);
        }
      } else {
        // Create new note
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags: tagArray }),
        });
        if (response.ok) {
          fetchNotes();
        }
      }

      setTitle("");
      setContent("");
      setTags("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchNotes();
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(", "));
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(filter.toLowerCase()) ||
      note.content.toLowerCase().includes(filter.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="notes-container">
      <h2>📝 Notes</h2>

      {/* Note Editor */}
      <div className="notes-editor">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="notes-input"
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="notes-textarea"
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="notes-input"
        />
        <div className="notes-actions">
          <button onClick={handleSaveNote} className="btn-save">
            {editingId ? "Update Note" : "Save Note"}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="btn-cancel">
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
      />

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <p className="no-notes">No notes found</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-badges">
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="note-content">{note.content.substring(0, 100)}...</p>
              <p className="note-date">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              <div className="note-actions">
                <button
                  onClick={() => handleEditNote(note)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
