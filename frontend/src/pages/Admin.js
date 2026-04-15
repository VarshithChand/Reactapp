import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "📄";
  if (["png","jpg","jpeg","gif","webp"].includes(ext)) return "🖼";
  if (["doc","docx"].includes(ext)) return "📝";
  return "📁";
}

function Admin() {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("username");

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) navigate("/login");
    else fetchFiles();
  }, [navigate]);

  // ================= USER =================

  const fetchUsers = async () => {
    const res = await fetch(`${BASE}/api/users`);
    setUsers(await res.json());
    setUsersLoaded(true);
    setShowCreateUser(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const createUser = async () => {
    if (!form.name || !form.email || !form.contact || !form.password) {
      alert("Fill all fields");
      return;
    }

    await fetch(`${BASE}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("User created!");
    setForm({ name: "", email: "", contact: "", password: "" });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`${BASE}/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  const changePassword = async (id) => {
    const password = prompt("Enter new password");
    if (!password) return;

    await fetch(`${BASE}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    alert("Password updated!");
  };

  // ================= FILE =================

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    // 🔥 IMPORTANT (send username)
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
    const res = await fetch(`${BASE}/api/files`);
    const data = await res.json();
    setFiles(data);
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    await fetch(`${BASE}/api/files/${filename}`, {
      method: "DELETE",
    });

    fetchFiles();
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="page-wrapper fade-in">

      {/* HEADER */}
      <div className="header flex-between">
        <h2>👑 Admin Panel</h2>
        <button className="danger-btn w-auto p-12" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CREATE USER SECTION */}
      {showCreateUser && (
        <div className="container">
          <h3 className="mb-18">✏️ Create User</h3>

          <div className="flex-col gap-8">
            {["name", "email", "contact"].map((field) => (
              <div key={field} className="input-group">
                <label>{field}</label>
                <input
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={form[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="btn-row">
              <button onClick={createUser}>Add User</button>
              <button className="secondary-btn" onClick={fetchUsers}>
                Load Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USERS SECTION */}
      {usersLoaded && !showCreateUser && users.length > 0 && (
        <div className="container">
          <h3 className="mb-18">👥 Users ({users.length})</h3>

          <div className="flex-col gap-8" style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "8px" }}>
            {users.map((u) => (
              <div className="card" key={u.id}>
                <div className="card-name">{u.name}</div>
                <div className="card-meta">📧 {u.email}</div>
                <div className="card-meta">📱 {u.contact}</div>

                <div className="card-actions">
                  <button className="w-full p-12" onClick={() => changePassword(u.id)}>
                    Change Password
                  </button>
                  <button className="btn-danger w-full p-12" onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: "16px" }}>
            <button className="secondary-btn" onClick={() => setShowCreateUser(true)}>
              Back to Create User
            </button>
          </div>
        </div>
      )}

      {/* FILE UPLOAD SECTION */}
      <div className="container">
        <h3 className="mb-18">📤 Upload File</h3>

        <div className="flex-col gap-8">
          <div className="input-group">
            <label>Select File</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="btn-row">
            <button onClick={uploadFile}>Upload</button>
            <button className="secondary-btn" onClick={fetchFiles}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* FILES SECTION */}
      {(() => {
        const adminFiles = files.filter(f => f.uploaded_by === adminUsername);
        return adminFiles.length > 0 && (
          <div>
            <h3 className="section-label mb-12">📁 Files ({adminFiles.length})</h3>

            <div className="flex-col gap-8">
              {adminFiles.map((f, i) => (
              <div className="file-card" key={i}>
                <div className="file-icon">{fileIcon(f.filename)}</div>

                <div className="file-info">
                  <div className="fname">{f.filename}</div>
                  <div className="fmeta">Uploaded by {f.uploaded_by || "Unknown"}</div>
                </div>

                <div className="file-links">
                  <a
                    href={`${BASE}/uploads/${encodeURIComponent(f.filename)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                  <a
                    href={`${BASE}/api/download/${encodeURIComponent(f.filename)}`}
                  >
                    Download
                  </a>
                </div>

                <button
                  className="btn-danger p-12"
                  onClick={() => deleteFile(f.filename)}
                >
                  Delete
                </button>
              </div>
            ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default Admin;