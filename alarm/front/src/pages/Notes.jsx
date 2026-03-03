import React, { useState, useEffect } from "react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");

  const API_URL = import.meta.env.VITE_API_URL + "/api/notes";

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
    if (!title.trim() || !content.trim()) return;

    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(t => t);
      const body = JSON.stringify({ title, content, tags: tagArray });
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (response.ok) {
        fetchNotes();
        handleCancel();
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this roast forever?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
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

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    n.content.toLowerCase().includes(filter.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 max-w-6xl">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search the vault..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl glass-pill bg-white/20 border-white/40 focus:bg-white/60 focus:ring-4 focus:ring-primary/10 transition-all font-semibold outline-none text-slate-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="col-span-12 lg:col-span-5">
          <div className="glass-card p-8 rounded-xl sticky top-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              {editingId ? "Refine the Roast" : "Record a Failure"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Roast Title"
                className="w-full px-6 py-4 rounded-2xl bg-white/40 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none text-slate-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Describe the disappointment..."
                rows="6"
                className="w-full px-6 py-4 rounded-2xl bg-white/40 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none text-slate-700 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <input
                type="text"
                placeholder="Tags (burn, failure, late...)"
                className="w-full px-6 py-4 rounded-2xl bg-white/40 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none text-slate-800"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all"
                >
                  {editingId ? "Update Roast" : "Seal in Vault"}
                </button>
                {editingId && (
                  <button
                    onClick={handleCancel}
                    className="px-6 py-4 glass-pill rounded-2xl font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {filteredNotes.length === 0 ? (
            <div className="glass-card p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">folder_off</span>
              <p className="font-bold text-slate-400">Vault is empty. No roasts found.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="glass-card p-8 rounded-xl group hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{note.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {new Date(note.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditNote(note)} className="size-10 rounded-xl glass-pill flex items-center justify-center text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="size-10 rounded-xl glass-pill flex items-center justify-center text-slate-400 hover:text-danger">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">{note.content}</p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
