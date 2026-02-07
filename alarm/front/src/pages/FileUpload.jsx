import React, { useState, useEffect } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const API_URL = "http://localhost:5000/api/files";

  useEffect(() => {
    fetchFiles();
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
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
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
        const result = await response.json();
        setSelectedFile(null);
        setPreview(null);
        fetchFiles();
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed. Please check if file format is supported.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`${API_URL}/${filename}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchFiles();
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <h2>📁 File Upload</h2>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            disabled={uploading}
            accept="image/*,.pdf,.txt,.doc,.docx"
          />
          <label htmlFor="file-input" className="file-label">
            📷 Choose File (Images, PDF, Documents)
          </label>
        </div>

        {preview && (
          <div className="preview-section">
            <p>Preview:</p>
            <img src={preview} alt="Preview" className="file-preview" />
          </div>
        )}

        {selectedFile && (
          <div className="selected-file-info">
            <p>
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p>
              <strong>Size:</strong>{" "}
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          className={`btn-upload ${uploading ? "disabled" : ""}`}
          disabled={uploading}
        >
          {uploading ? "🔄 Uploading..." : "⬆️ Upload File"}
        </button>
      </div>

      {/* Files List */}
      <div className="files-section">
        <h3>Uploaded Files ({files.length})</h3>
        {files.length === 0 ? (
          <p className="no-files">No files uploaded yet</p>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file.filename} className="file-item">
                {file.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="file-thumbnail"
                  />
                ) : (
                  <div className="file-icon">
                    {file.filename.toLowerCase().endsWith(".pdf") && "📄"}
                    {file.filename.toLowerCase().endsWith(".txt") && "📝"}
                    {file.filename.toLowerCase().endsWith(".doc") ||
                      (file.filename.toLowerCase().endsWith(".docx") && "📘")}
                  </div>
                )}
                <p className="file-name">{file.filename}</p>
                <p className="file-size">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <div className="file-actions">
                  <a
                    href={file.url}
                    download
                    className="btn-download"
                    title="Download"
                  >
                    ⬇️ Download
                  </a>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="btn-remove"
                    title="Delete"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
