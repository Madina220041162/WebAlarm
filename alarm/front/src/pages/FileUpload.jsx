import React, { useState, useEffect } from "react";
import { filesAPI, getAuthToken } from "../services/api";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const ALLOWED_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      if (!getAuthToken()) {
        setError("Please login to view files");
        return;
      }

      const data = await filesAPI.getAll();
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error.message || "Error loading files");
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    if (file.size > ALLOWED_SIZE) {
      setError(`File size exceeds 50MB limit`);
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`File type not allowed. Supported: Images, PDF, Text, Word`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("");
      if (validateFile(file)) {
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
      } else {
        setSelectedFile(null);
        setPreview(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setError("");
      if (validateFile(file)) {
        setSelectedFile(file);

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
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError("");

      if (!getAuthToken()) {
        setError("Authentication required. Please login first");
        return;
      }

      await filesAPI.upload(selectedFile);
      setSelectedFile(null);
      setPreview(null);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message || "Error uploading file. Please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await filesAPI.delete(fileId);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.message || "Error deleting file");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/")) return "🖼️";
    if (mimetype === "application/pdf") return "📄";
    if (mimetype === "text/plain") return "📝";
    if (
      mimetype === "application/msword" ||
      mimetype.includes("wordprocessingml")
    )
      return "📘";
    return "📎";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <h2>📁 File Upload</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Upload Section */}
      <div className="upload-section">
        <div
          className={`file-input-wrapper ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            disabled={uploading || loading}
            accept={ALLOWED_TYPES.join(",")}
          />
          <label htmlFor="file-input" className="file-label">
            {dragActive ? (
              <span>📥 Drop your file here</span>
            ) : (
              <span>📤 Click to browse or drag & drop</span>
            )}
            <br />
            <small>Images, PDF, Text, Word (max 50MB)</small>
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
              <strong>Size:</strong> {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          className={`btn-upload ${uploading ? "disabled" : ""}`}
          disabled={uploading || loading}
        >
          {uploading ? "🔄 Uploading..." : "⬆️ Upload File"}
        </button>
      </div>

      {/* Files List */}
      <div className="files-section">
        <h3>
          Uploaded Files {loading && <span className="loading-spinner">⏳</span>}
        </h3>
        {loading && !files.length && <p className="loading">Loading files...</p>}
        {files.length === 0 && !loading ? (
          <p className="no-files">No files uploaded yet</p>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file._id} className="file-item">
                {file.mimetype.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="file-thumbnail"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="file-icon"
                  style={{
                    display: file.mimetype.startsWith("image/") ? "none" : "flex",
                  }}
                >
                  {getFileIcon(file.mimetype)}
                </div>
                <p className="file-name" title={file.filename}>
                  {file.filename}
                </p>
                <p className="file-size">{formatFileSize(file.size)}</p>
                <p className="file-date">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
                <div className="file-actions">
                  <a
                    href={file.url}
                    download={file.filename}
                    className="btn-download"
                    title="Download"
                  >
                    ⬇️ Download
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="btn-remove"
                    disabled={loading}
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
