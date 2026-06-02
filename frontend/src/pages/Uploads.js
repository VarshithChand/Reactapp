import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function Uploads() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("username");

    if (!name) {
      navigate("/login");
      return;
    }

    setUsername(name || "User");

    const controller = new AbortController();
    
    const loadFiles = async () => {
      try {
        const res = await fetch(`${BASE}/api/files`, { signal: controller.signal });
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    loadFiles();
    
    return () => controller.abort();
  }, [navigate]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${BASE}/api/files`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Select a file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("username", localStorage.getItem("username"));

    try {
      setIsUploading(true);
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      alert("File uploaded!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchFiles();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteUserFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;

    try {
      await fetch(`${BASE}/api/files/${filename}`, {
        method: "DELETE"
      });
      alert("File deleted!");
      fetchFiles();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "DOC";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "IMG";
    if (["doc", "docx"].includes(ext)) return "TXT";
    return "FILE";
  };

  const userFiles = files.filter((f) => f.uploaded_by === username);

  return (
    <div className="page-wrapper uploads-page fade-in">
      <div className="header uploads-header">
        <button type="button" className="back-link-btn" onClick={() => navigate("/user")}>
          Back
        </button>
        <h2>My Uploads</h2>
        <span className="status-badge">
          {userFiles.length} {userFiles.length === 1 ? "File" : "Files"}
        </span>
      </div>

      <div className="uploads-layout">
        <div className="container upload-workspace-panel">
          <div className="section-header">
            <h3>Upload File</h3>
            <span className="status-badge">Private</span>
          </div>

          <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-dropzone-mark">+</div>
            <div>
              <div className="upload-dropzone-title">
                {selectedFile ? selectedFile.name : "Choose a file to upload"}
              </div>
              <div className="upload-dropzone-subtitle">
                Your file will appear in My Uploads after confirmation.
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0] || null)}
            />
          </div>

          <div className="upload-actions">
            <button type="button" onClick={uploadFile} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="container uploads-list-panel">
          <div className="section-header">
            <h3>Files</h3>
          </div>

          {userFiles.length === 0 ? (
            <div className="empty-state">No files uploaded yet</div>
          ) : (
            <div className="uploads-file-list">
              {userFiles.map((f) => {
                const filename = f.filename;

                return (
                  <div className="file-item upload-page-file-item" key={filename}>
                    <div className="file-item-icon">{getFileIcon(filename)}</div>
                    <div className="file-item-name" title={filename}>{filename}</div>
                    <div className="file-item-actions">
                      <a
                        href={`${BASE}/uploads/${encodeURIComponent(filename)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="file-item-btn file-item-btn-primary"
                      >
                        View
                      </a>
                      <a
                        href={`${BASE}/api/download/${encodeURIComponent(filename)}`}
                        className="file-item-btn file-item-btn-primary"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => deleteUserFile(filename)}
                        className="file-item-btn file-item-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploads;
