import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "DOC";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "IMG";
  if (["doc", "docx"].includes(ext)) return "TXT";
  return "FILE";
}

function AdminFiles() {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("username");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    
    const loadFiles = async () => {
      try {
        const res = await fetch(`${BASE}/api/files`, { signal: controller.signal });
        setFiles(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching files:", err);
        }
      }
    };
    
    loadFiles();
    return () => controller.abort();
  }, [navigate]);

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("username", localStorage.getItem("username"));

    await fetch(`${BASE}/api/upload`, {
      method: "POST",
      body: fd,
    });

    alert("File uploaded!");
    setFile(null);
    fetchFiles();
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${BASE}/api/files`);
      setFiles(await res.json());
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    await fetch(`${BASE}/api/files/${filename}`, {
      method: "DELETE",
    });

    fetchFiles();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const adminFiles = files.filter((f) => f.uploaded_by === adminUsername);

  return (
    <div className="page-wrapper admin-page fade-in">
      <div className="header flex-between admin-header">
        <h2>Admin Files</h2>
        <div className="admin-nav">
          <button className="secondary-btn" onClick={() => navigate("/admin")}>Users</button>
          <button className="secondary-btn" onClick={() => navigate("/admin/courses")}>Course Access</button>
          <button className="secondary-btn active" onClick={() => navigate("/admin/files")}>Files</button>
          <button className="danger-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container admin-panel">
        <h3 className="mb-18">Upload File</h3>

        <div className="flex-col gap-8">
          <div className="input-group">
            <label>Select File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full"
            />
          </div>

          <div className="btn-row">
            <button onClick={uploadFile}>Upload</button>
            <button className="secondary-btn" onClick={fetchFiles}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="container admin-panel">
        <div className="section-header">
          <h3>Files</h3>
          <span className="status-badge">{adminFiles.length} Files</span>
        </div>

        {adminFiles.length === 0 ? (
          <div className="empty-state">No files uploaded yet</div>
        ) : (
          <div className="flex-col gap-8">
            {adminFiles.map((f) => (
              <div className="file-card" key={f.filename}>
                <div className="file-icon">{fileIcon(f.filename)}</div>

                <div className="file-info">
                  <div className="fname">{f.filename}</div>
                  <div className="fmeta">Uploaded by {f.uploaded_by || "Unknown"}</div>
                </div>

                <div className="file-links">
                  <a href={`${BASE}/uploads/${encodeURIComponent(f.filename)}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                  <a href={`${BASE}/api/download/${encodeURIComponent(f.filename)}`}>
                    Download
                  </a>
                </div>

                <button className="btn-danger p-12" onClick={() => deleteFile(f.filename)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFiles;
