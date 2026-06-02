import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";
const COURSES = ["Python", "Javascript", "React", "Nodejs"];

function AdminCourseAccess() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    course_name: "Python",
    access_level: "demo",
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    
    const loadData = async () => {
      try {
        const usersRes = await fetch(`${BASE}/api/users`, { signal: controller.signal });
        setUsers(await usersRes.json());
        
        const assignRes = await fetch(`${BASE}/api/course-access`, { signal: controller.signal });
        setAssignments(await assignRes.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching data:", err);
        }
      }
    };
    
    loadData();
    return () => controller.abort();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE}/api/users`);
      setUsers(await res.json());
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${BASE}/api/course-access`);
      setAssignments(await res.json());
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const saveAccess = async () => {
    if (!form.user_id) {
      alert("Select a user");
      return;
    }

    const res = await fetch(`${BASE}/api/course-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: Number(form.user_id) }),
    });

    if (!res.ok) {
      alert("Failed to save course access");
      return;
    }

    alert("Course access saved!");
    fetchAssignments();
  };

  const removeAccess = async (id) => {
    if (!window.confirm("Remove this course access?")) return;

    await fetch(`${BASE}/api/course-access/${id}`, {
      method: "DELETE",
    });

    fetchAssignments();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="page-wrapper admin-page fade-in">
      <div className="header flex-between admin-header">
        <h2>Course Access</h2>
        <div className="admin-nav">
          <button className="secondary-btn" onClick={() => navigate("/admin")}>Users</button>
          <button className="secondary-btn active" onClick={() => navigate("/admin/courses")}>Course Access</button>
          <button className="secondary-btn" onClick={() => navigate("/admin/files")}>Files</button>
          <button className="danger-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container admin-panel course-access-panel">
        <div className="section-header">
          <h3>Assign Course</h3>
          <span className="status-badge">Demo / Full</span>
        </div>

        <div className="course-access-grid">
          <div className="course-access-form">
            <div className="input-group">
              <label>User</label>
              <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}>
                <option value="">Select user</option>
                {users.filter((u) => !u.is_admin).map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Course</label>
              <select value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })}>
                {COURSES.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="input-group access-group">
              <label>Access</label>
              <div className="access-toggle">
                <button
                  type="button"
                  className={form.access_level === "demo" ? "active" : ""}
                  onClick={() => setForm({ ...form, access_level: "demo" })}
                >
                  Demo
                </button>
                <button
                  type="button"
                  className={form.access_level === "full" ? "active" : ""}
                  onClick={() => setForm({ ...form, access_level: "full" })}
                >
                  Full Access
                </button>
              </div>
            </div>

            <button onClick={saveAccess}>Save Access</button>
          </div>

          <div className="course-access-list">
            {assignments.length === 0 ? (
              <div className="empty-state">No course access assigned yet</div>
            ) : (
              assignments.map((item) => (
                <div className="course-access-item" key={item.id}>
                  <div>
                    <div className="course-access-title">{item.username}</div>
                    <div className="course-access-meta">{item.course_name}</div>
                  </div>
                  <span className={`access-pill access-${item.access_level}`}>
                    {item.access_level === "full" ? "Full" : "Demo"}
                  </span>
                  <button className="course-access-remove" onClick={() => removeAccess(item.id)}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseAccess;
