import React, { useState, useEffect } from "react";
import { classifyImageFile, doesPredictionMatchTarget } from "../utils/imageClassifier";
import {
  getActiveProofChallenge,
  saveProofVerificationResult,
  clearProofVerificationResult,
} from "../utils/proofChallenge";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL + "/api/files";

  useEffect(() => {
    fetchFiles();
    setActiveChallenge(getActiveProofChallenge());

    const onChallengeUpdate = () => setActiveChallenge(getActiveProofChallenge());
    window.addEventListener("proof-challenge-updated", onChallengeUpdate);
    return () => window.removeEventListener("proof-challenge-updated", onChallengeUpdate);
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValidationMessage("");
    setValidationError("");

    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setValidationMessage("");
    setValidationError("");

    if (activeChallenge) {
      if (!selectedFile.type.startsWith("image/")) {
        setValidationError("This challenge requires an image file.");
        return;
      }

      try {
        const predictions = await classifyImageFile(selectedFile);
        const matched = doesPredictionMatchTarget(predictions, activeChallenge.target);

        if (!matched) {
          clearProofVerificationResult();
          setValidationError(
            `Proof rejected. Required object is '${activeChallenge.target}', but it was not detected.`
          );
          return;
        }

        saveProofVerificationResult({
          passed: true,
          alarmId: activeChallenge.alarmId,
          target: activeChallenge.target,
          verifiedAt: Date.now(),
          fileName: selectedFile.name,
          topPrediction: predictions[0]?.className || "unknown",
        });

        setValidationMessage(
          `Proof accepted. Detected '${activeChallenge.target}'. You can dismiss the alarm now.`
        );
      } catch (error) {
        clearProofVerificationResult();
        setValidationError(`Could not validate image proof: ${error.message}`);
        return;
      }
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setSelectedFile(null);
        setPreview(null);
        fetchFiles();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Destroy this evidence?")) return;
    try {
      const response = await fetch(`${API_URL}/${filename}`, { method: "DELETE" });
      if (response.ok) fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-500 max-w-6xl pb-20">
      {activeChallenge && (
        <div className="glass-card p-6 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Alarm Proof Challenge</p>
          <p className="text-lg font-black text-slate-900">
            Upload an image that contains: <span className="text-primary uppercase">{activeChallenge.target}</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            If the required object is not detected, alarm dismissal stays locked.
          </p>
        </div>
      )}

      {!activeChallenge && (
        <div className="glass-card p-6 rounded-xl border border-slate-200 bg-slate-50/70">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Proof Status</p>
          <p className="text-sm font-bold text-slate-700">
            No active alarm challenge right now. When an alarm rings, this page will show the exact photo target you must upload.
          </p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Upload Zone */}
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-card p-8 rounded-xl sticky top-8 text-center">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary">upload_file</span>
              Evidence Locker
            </h3>

            <div className="relative group mb-8">
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label
                htmlFor="file-input"
                className="block p-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary transition-all cursor-pointer group-hover:shadow-inner"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full aspect-video rounded-xl object-cover shadow-lg mb-4" />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block group-hover:scale-110 transition-transform">add_a_photo</span>
                )}
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary">
                  {selectedFile ? selectedFile.name : "Select Payload"}
                </span>
              </label>
            </div>

            {selectedFile && (
              <div className="mb-8 p-4 rounded-xl bg-white/40 border border-slate-100 text-left">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payload Size</p>
                <p className="text-sm font-bold text-slate-700">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {validationMessage && (
              <div className="mb-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold text-left">
                {validationMessage}
              </div>
            )}

            {validationError && (
              <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold text-left">
                {validationError}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {uploading ? "Deploying..." : "Upload Evidence →"}
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Stored Payloads ({files.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {files.length === 0 ? (
              <div className="col-span-full glass-card p-20 rounded-xl text-center">
                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inventory_2</span>
                <p className="font-bold text-slate-400">No secret files found in the grid.</p>
              </div>
            ) : (
              files.map((file) => (
                <div key={file.filename} className="glass-card group overflow-hidden rounded-xl animate-in slide-in-from-right duration-300">
                  <div className="aspect-video relative bg-slate-100 overflow-hidden">
                    {file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={file.url} alt={file.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-6xl">description</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
                      <a
                        href={file.url}
                        download
                        className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-black text-xs text-center shadow-lg hover:bg-primary hover:text-white transition-all"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(file.filename)}
                        className="size-10 rounded-xl bg-danger text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-slate-900 truncate mb-1" title={file.filename}>{file.filename}</h4>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                      {(file.size / 1024).toFixed(2)} KB • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
