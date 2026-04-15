import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function User() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileData, setProfileData] = useState({
    contact: "",
    email: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    contact: "",
    email: ""
  });

  useEffect(() => {
    const user = localStorage.getItem("isUser");
    const name = localStorage.getItem("username");

    if (!user) {
      navigate("/login");
    } else {
      setUsername(name || "User");
      fetchProfileData();
      fetchFiles();
    }
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

  const fetchProfileData = async () => {
    try {
      const username = localStorage.getItem("username");
      const res = await fetch(`${BASE}/api/users/name/${username}`);
      const data = await res.json();
      if (data) {
        setProfileData({
          fullname: data.name || "User",
          contact: data.contact || "N/A",
          email: data.email || "N/A"
        });
        setEditForm({
          fullname: data.name || "User",
          contact: data.contact || "N/A",
          email: data.email || "N/A"
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("username", localStorage.getItem("username"));

    try {
      await fetch(`${BASE}/api/upload`, {
        method: "POST",
        body: fd,
      });
      alert("File uploaded!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      alert("Upload failed");
    }
  };

  const deleteUserFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;

    try {
      await fetch(`${BASE}/api/files/${filename}`, {
        method: "DELETE",
      });
      alert("File deleted!");
      fetchFiles();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveProfile = async () => {
    try {
      const username = localStorage.getItem("username");
      await fetch(`${BASE}/api/users/name/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.fullname,
          contact: editForm.contact,
          email: editForm.email
        })
      });
      setProfileData(editForm);
      setIsEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditForm({
      fullname: profileData.fullname,
      contact: profileData.contact,
      email: profileData.email
    });
    setIsEditMode(false);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "📄";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼";
    if (["doc", "docx"].includes(ext)) return "📝";
    return "📁";
  };

  return (
    <div className="page-wrapper fade-in">

      {/* HEADER */}
      <div className="header flex-between">
        <h2>Welcome, <span style={{ color: "#818cf8", fontWeight: 700 }}>{username}</span></h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{
            cursor: "pointer",
            padding: "10px 16px",
            background: "#10b981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            transition: "all 0.2s ease",
            display: "inline-block"
          }}>
            📤 Upload File
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
          <button 
            onClick={uploadFile}
            style={{
              padding: "10px 16px",
              background: "#10b981",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            ✓ Confirm
          </button>
          <button className="danger-btn w-auto p-12" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-row" style={{ gap: "40px" }}>

        {/* LEFT COLUMN - Profile & My Uploads (Stacked) */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "var(--sp-18)" }}>

          {/* PROFILE SECTION */}
          <div className="container">
          <div className="section-header">
            <h3>👤 Profile</h3>
            <span className="status-badge">Personal</span>
          </div>

          {!isEditMode ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "var(--sp-18)" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto var(--sp-12)",
                  background: profilePhoto ? `url(${profilePhoto})` : "linear-gradient(135deg, #818cf8, #6366f1)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#fff",
                  border: "3px solid rgba(129, 140, 248, 0.3)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {!profilePhoto && "👤"}
                </div>
                <label style={{
                  display: "inline-block",
                  marginTop: "12px",
                  padding: "8px 16px",
                  background: "#818cf8",
                  color: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#6366f1"}
                onMouseLeave={(e) => e.target.style.background = "#818cf8"}
                >
                  📷 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfilePhoto(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div className="flex-col gap-14">
                <div className="info-block">
                  <div className="info-block-label">Full Name</div>
                  <div className="info-block-value">{profileData.fullname}</div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">Username</div>
                  <div className="info-block-value">{username}</div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">Email</div>
                  <div className="info-block-value">{profileData.email}</div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">Contact</div>
                  <div className="info-block-value">{profileData.contact}</div>
                </div>
              </div>

              <button
                onClick={() => setIsEditMode(true)}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "10px 16px",
                  background: "#818cf8",
                  color: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#6366f1"}
                onMouseLeave={(e) => e.target.style.background = "#818cf8"}
              >
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="flex-col gap-14" style={{ marginBottom: "16px" }}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleEditChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Enter email"
                  />
                </div>
                <div className="input-group">
                  <label>Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="btn-row">
                <button
                  onClick={saveProfile}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#059669"}
                  onMouseLeave={(e) => e.target.style.background = "#10b981"}
                >
                  ✓ Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="secondary-btn"
                  style={{ flex: 1 }}
                >
                  ✕ Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* MY UPLOADS SECTION - Below Profile */}
        <div className="container" style={{ marginTop: "var(--sp-18)" }}>
          <div className="section-header">
            <h3>📤 My Uploads</h3>
            {(() => {
              const userFiles = files.filter(f => f.uploaded_by === username);
              return userFiles.length > 0 && (
                <span className="status-badge">
                  {userFiles.length} {userFiles.length === 1 ? 'File' : 'Files'}
                </span>
              );
            })()}
          </div>

          {(() => {
            const userFiles = files.filter(f => f.uploaded_by === username);
            return userFiles.length === 0 ? (
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "var(--sp-20)" }}>
                No files uploaded yet
              </div>
            ) : (
              <div className="flex-col gap-8">
                {userFiles.map((f, i) => (
                  <div className="file-item" key={i}>
                    <div className="file-item-icon">{getFileIcon(f.filename)}</div>
                    <div className="file-item-name">{f.filename}</div>
                    <div className="file-item-actions">
                      <a
                        href={`${BASE}/uploads/${encodeURIComponent(f.filename)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="file-item-btn file-item-btn-primary"
                      >
                        👁 View
                      </a>
                      <a
                        href={`${BASE}/api/download/${encodeURIComponent(f.filename)}`}
                        className="file-item-btn file-item-btn-primary"
                      >
                        📥 Download
                      </a>
                      <button
                        onClick={() => deleteUserFile(f.filename)}
                        className="file-item-btn file-item-btn-danger"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        </div> {/* End of Left Column */}

        {/* COURSES SECTION */}
        <div className="container">
          <div className="section-header">
            <h3>📚 Courses</h3>
            <span className="status-badge">4 Available</span>
          </div>

          {selectedCourse ? (
            <div>
              <div style={{
                padding: "20px",
                background: "rgba(129, 140, 248, 0.1)",
                borderRadius: "8px",
                marginBottom: "16px"
              }}>
                <h4 style={{ marginBottom: "12px", fontSize: "18px" }}>
                  {selectedCourse.emoji} {selectedCourse.name}
                </h4>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "12px" }}>
                  Explore comprehensive learning materials for {selectedCourse.name} programming.
                </p>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px" }}>
                  <strong>Instructor:</strong> Expert Trainer
                </p>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px" }}>
                  <strong>Duration:</strong> 40 hours
                </p>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="secondary-btn"
                  style={{ width: "100%" }}
                >
                  Back to Courses
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-col gap-10" style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "8px" }}>
              {[
                { name: "Python", emoji: "🐍", progress: 85 },
                { name: "Java", emoji: "☕", progress: 70 },
                { name: "C", emoji: "💻", progress: 60 },
                { name: "C++", emoji: "⚡", progress: 65 }
              ].map((course, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    padding: "16px",
                    background: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: "1px solid rgba(99, 102, 241, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ fontSize: "24px" }}>{course.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{course.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Click to view details</div>
                  </div>
                  <div style={{ fontSize: "18px" }}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FILES SECTION */}
        <div className="container">
          <div className="section-header">
            <h3>📁 Updates </h3>
            <span style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              background: "#ef4444",
              borderRadius: "50%",
              opacity: files.length > 0 ? 1 : 0.3
            }} />
          </div>

          {(() => {
            const sharedFiles = files.filter(f => f.uploaded_by === "admin");
            return sharedFiles.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "32px 16px",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "14px"
              }}>
                📭 No shared files from admin.
              </div>
            ) : (
              <div className="flex-col gap-8">
                {sharedFiles.map((f, i) => (
                <div className="file-item" key={i} style={{ minWidth: 0, overflow: "hidden" }}>
                  <div className="file-item-icon">{getFileIcon(f.filename || f)}</div>
                  <div className="file-item-name">
                    {(f.filename || f).length > 10 ? (f.filename || f).substring(0, 10) + "...." : (f.filename || f)}
                  </div>
                  <div className="file-item-actions">
                    <a
                      href={`${BASE}/uploads/${encodeURIComponent(f.filename || f)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="file-item-btn file-item-btn-primary"
                    >
                      👁 View
                    </a>
                    <a
                      href={`${BASE}/api/download/${encodeURIComponent(f.filename || f)}`}
                      className="file-item-btn file-item-btn-primary"
                    >
                      📥 Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}

export default User;