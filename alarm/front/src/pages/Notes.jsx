import React, { useState, useEffect } from "react";

const DEFAULT_STYLE = {
  theme: "classic",
  paperColor: "#ffffff",
  textColor: "#1e293b",
  fontSize: 16,
};

const THEME_PRESETS = {
  classic: { paperColor: "#ffffff", textColor: "#1e293b" },
  night: { paperColor: "#0f172a", textColor: "#e2e8f0" },
  sepia: { paperColor: "#f6efe0", textColor: "#4a3523" },
  mint: { paperColor: "#eafff3", textColor: "#164e3a" },
};

const THEME_LABELS = {
  classic: "Classic",
  night: "Night",
  sepia: "Sepia",
  mint: "Mint",
};

const normalizeNoteStyle = (style) => {
  const incoming = style || {};
  const theme = THEME_PRESETS[incoming.theme] ? incoming.theme : DEFAULT_STYLE.theme;
  const fontSize = Number.isFinite(Number(incoming.fontSize))
    ? Math.max(12, Math.min(30, Math.round(Number(incoming.fontSize))))
    : DEFAULT_STYLE.fontSize;

  return {
    theme,
    paperColor: incoming.paperColor || THEME_PRESETS[theme].paperColor,
    textColor: incoming.textColor || THEME_PRESETS[theme].textColor,
    fontSize,
  };
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL = API_BASE_URL + "/api/notes";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setNotes(
          data.map((note) => ({
            ...note,
            id: note.id || note._id,
            tags: Array.isArray(note.tags) ? note.tags : [],
            style: normalizeNoteStyle(note.style),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(t => t);
      const body = JSON.stringify({
        title,
        content,
        tags: tagArray,
        style: normalizeNoteStyle(style),
      });
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
    setTags((note.tags || []).join(", "));
    setStyle(normalizeNoteStyle(note.style));
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setTags("");
    setStyle(DEFAULT_STYLE);
  };

  const handleApplyTheme = (themeKey) => {
    const preset = THEME_PRESETS[themeKey] || THEME_PRESETS.classic;
    setStyle((prev) => ({
      ...prev,
      theme: themeKey,
      paperColor: preset.paperColor,
      textColor: preset.textColor,
    }));
  };

  const filteredNotes = notes.filter(n =>
    (n.title || "").toLowerCase().includes(filter.toLowerCase()) ||
    (n.content || "").toLowerCase().includes(filter.toLowerCase()) ||
    (n.tags || []).some(t => t.toLowerCase().includes(filter.toLowerCase()))
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
                style={{
                  backgroundColor: style.paperColor,
                  color: style.textColor,
                  fontSize: `${style.fontSize}px`,
                }}
              ></textarea>

              <div className="rounded-2xl p-4 bg-slate-50/70 border border-slate-200 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Theme</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(THEME_PRESETS).map((themeKey) => (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => handleApplyTheme(themeKey)}
                        className={`px-3 py-2 rounded-xl font-bold text-sm border transition-all ${style.theme === themeKey ? "border-primary text-primary bg-white" : "border-slate-200 text-slate-600 bg-white/70"}`}
                      >
                        {THEME_LABELS[themeKey]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between gap-2">
                    Paper
                    <input
                      type="color"
                      value={style.paperColor}
                      onChange={(e) => setStyle((prev) => ({ ...prev, paperColor: e.target.value }))}
                      className="h-8 w-12 border-none bg-transparent cursor-pointer"
                    />
                  </label>
                  <label className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between gap-2">
                    Text
                    <input
                      type="color"
                      value={style.textColor}
                      onChange={(e) => setStyle((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="h-8 w-12 border-none bg-transparent cursor-pointer"
                    />
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">Font Size</p>
                    <p className="text-sm font-bold text-slate-600">{style.fontSize}px</p>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="30"
                    value={style.fontSize}
                    onChange={(e) => setStyle((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

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
              <div
                key={note.id}
                className="glass-card p-8 rounded-xl group hover:translate-y-[-4px] transition-all duration-300"
                style={{
                  backgroundColor: note.style.paperColor,
                  color: note.style.textColor,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black group-hover:text-primary transition-colors" style={{ color: note.style.textColor }}>
                      {note.title}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: note.style.textColor, opacity: 0.7 }}>
                      {new Date(note.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditNote(note)} className="size-10 rounded-xl glass-pill flex items-center justify-center hover:text-primary" style={{ color: note.style.textColor }}>
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="size-10 rounded-xl glass-pill flex items-center justify-center hover:text-danger" style={{ color: note.style.textColor }}>
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
                <p className="font-medium leading-relaxed mb-6" style={{ color: note.style.textColor, fontSize: `${note.style.fontSize}px` }}>
                  {note.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter"
                      style={{
                        backgroundColor: "rgba(148, 163, 184, 0.2)",
                        color: note.style.textColor,
                      }}
                    >
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
