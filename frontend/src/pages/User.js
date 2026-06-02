import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function User() {
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [courseAccess, setCourseAccess] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileData, setProfileData] = useState({
    fullname: "",
    contact: "",
    email: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: "",
    contact: "",
    email: ""
  });

  useEffect(() => {
    const name = localStorage.getItem("username");

    if (!name) {
      navigate("/login");
      return;
    }

    setUsername(name || "User");

    // Create a single abort controller for all fetches
    const controller = new AbortController();

    const fetchProfileData = async () => {
      try {
        const savedUsername = localStorage.getItem("username");
        const res = await fetch(`${BASE}/api/users/name/${savedUsername}`, { signal: controller.signal });
        const data = await res.json();

        if (data && !data.error) {
          const nextProfile = {
            fullname: data.name || "User",
            contact: data.contact || "N/A",
            email: data.email || "N/A"
          };

          setProfileData(nextProfile);
          setEditForm(nextProfile);
          setProfilePhoto(data.profile_photo ? `${BASE}/uploads/${encodeURIComponent(data.profile_photo)}` : "");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching profile:", err);
        }
      }
    };

    const fetchFiles = async () => {
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

    const fetchCourseAccess = async () => {
      try {
        const savedUsername = localStorage.getItem("username");
        const res = await fetch(`${BASE}/api/course-access/name/${savedUsername}`, { signal: controller.signal });
        const data = await res.json();
        setCourseAccess(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching course access:", err);
        }
      }
    };

    fetchProfileData();
    fetchFiles();
    fetchCourseAccess();

    // Cleanup: abort all fetches when component unmounts
    return () => controller.abort();
  }, [navigate]);

  const uploadProfilePhoto = async (selectedPhoto) => {
    if (!selectedPhoto) return;

    const fd = new FormData();
    fd.append("photo", selectedPhoto);

    try {
      const savedUsername = localStorage.getItem("username");
      const res = await fetch(`${BASE}/api/users/name/${savedUsername}/photo`, {
        method: "POST",
        body: fd
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Photo upload failed");
        return;
      }

      setProfilePhoto(`${BASE}/uploads/${encodeURIComponent(data.profile_photo)}?t=${Date.now()}`);
    } catch (err) {
      alert("Photo upload failed");
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToUploads = () => {
    setIsMenuOpen(false);
    navigate("/uploads");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveProfile = async () => {
    try {
      const savedUsername = localStorage.getItem("username");
      await fetch(`${BASE}/api/users/name/${savedUsername}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.fullname,
          contact: editForm.contact,
          email: editForm.email
        })
      });

      setProfileData(editForm);
      localStorage.setItem("username", editForm.fullname);
      setUsername(editForm.fullname);
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
    if (["pdf"].includes(ext)) return "DOC";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "IMG";
    if (["doc", "docx"].includes(ext)) return "TXT";
    return "FILE";
  };

  const renderFileItem = (f) => {
    const filename = f.filename || f;

    return (
      <div className="file-item" key={filename}>
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
        </div>
      </div>
    );
  };

  const sharedFiles = files.filter((f) => f.uploaded_by === "admin");
  const courses = [
    { name: "Python", short: "PY" },
    { name: "Javascript", short: "JS" },
    { name: "React", short: "RX" },
    { name: "Nodejs", short: "ND" }
  ];
  const getAccessLevel = (courseName) => {
    const item = courseAccess.find((access) => access.course_name.toLowerCase() === courseName.toLowerCase());
    return item?.access_level || "locked";
  };
  const openCourse = (courseName, accessLevel) => {
    if (accessLevel === "locked") {
      alert("No access yet. Please contact admin.");
      return;
    }

    navigate(`/course/${courseName.toLowerCase()}?access=${accessLevel}`);
  };

  return (
    <div className="page-wrapper user-page fade-in">
      <div className="header flex-between user-header">
        <h2>Welcome, <span>{username}</span></h2>
        <div className="header-menu-wrap">
          <button
            className="menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          {isMenuOpen && (
            <div className="header-menu">
              <button type="button" onClick={goToUploads}>Upload File</button>
              <button type="button" className="menu-danger" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-row user-dashboard-grid">
        <div className="container user-panel profile-panel">
            <div className="section-header">
              <h3>Profile</h3>
              <span className="status-badge">Personal</span>
            </div>

            {!isEditMode ? (
              <>
                <div className="profile-photo-section">
                  <div className="profile-avatar">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt={`${username} profile`} />
                    ) : (
                      <span>{username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="photo-upload-btn"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    Upload Photo
                  </button>
                  <input
                    ref={photoInputRef}
                    className="hidden-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadProfilePhoto(e.target.files[0])}
                  />
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

                <button className="edit-profile-btn" onClick={() => setIsEditMode(true)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="profile-edit-form">
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
                  <button className="save-profile-btn" onClick={saveProfile}>
                    Save
                  </button>
                  <button onClick={cancelEdit} className="secondary-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}
        </div>

        <div className="container user-panel courses-panel">
          <div className="section-header">
            <h3>Courses</h3>
            <span className="status-badge">
              {courseAccess.length} Assigned
            </span>
          </div>

          <div className="course-list">
            {courses.map((course) => {
              const accessLevel = getAccessLevel(course.name);
              return (
                <div
                  key={course.name}
                  onClick={() => openCourse(course.name, accessLevel)}
                  className={`course-card ${accessLevel === "locked" ? "course-card-locked" : ""}`}
                >
                  <div className="course-mark">{course.short}</div>
                  <div className="course-copy">
                    <div className="course-name">{course.name}</div>
                    <div className="course-description-small">
                      {accessLevel === "full"
                        ? "Full module access enabled"
                        : accessLevel === "demo"
                          ? "Demo access enabled"
                          : "Locked by admin"}
                    </div>
                  </div>
                  <span className={`course-access-badge course-access-${accessLevel}`}>
                    {accessLevel === "full" ? "Full" : accessLevel === "demo" ? "Demo" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container user-panel updates-panel">
          <div className="section-header">
            <h3>Updates</h3>
            <span className={`updates-dot ${sharedFiles.length > 0 ? "is-active" : ""}`} />
          </div>

          {sharedFiles.length === 0 ? (
            <div className="empty-state">No shared files from admin.</div>
          ) : (
            <div className="flex-col gap-8">
              {sharedFiles.map((f) => renderFileItem(f))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
