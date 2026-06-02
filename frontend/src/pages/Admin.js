import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(true);
  const [userView, setUserView] = useState("approved");
  const [userSearch, setUserSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE}/api/users`);
      const data = await res.json();
      setUsers(data);
      setUsersLoaded(true);
      setShowCreateUser(false);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async () => {
    if (!form.name || !form.email || !form.contact || !form.password) {
      alert("Fill all fields");
      return;
    }

    await fetch(`${BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, is_approved: true }),
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

  const approveUser = async (id) => {
    await fetch(`${BASE}/api/users/${id}/approve`, {
      method: "PUT",
    });

    fetchUsers();
  };

  const rejectUser = async (id) => {
    if (!window.confirm("Reject this registration request?")) return;

    await fetch(`${BASE}/api/users/${id}/reject`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const approvedUsers = users.filter((u) => u.is_admin || u.is_approved);
  const pendingUsers = users.filter((u) => !u.is_admin && !u.is_approved);
  const visibleUsers = (userView === "approved" ? approvedUsers : pendingUsers).filter((u) => {
    const value = `${u.name} ${u.email} ${u.contact}`.toLowerCase();
    return value.includes(userSearch.toLowerCase().trim());
  });

  return (
    <div className="page-wrapper admin-page fade-in">
      <div className="header flex-between admin-header">
        <h2>Admin Panel</h2>
        <div className="admin-nav">
          <button className="secondary-btn active" onClick={() => navigate("/admin")}>Users</button>
          <button className="secondary-btn" onClick={() => navigate("/admin/courses")}>Course Access</button>
          <button className="secondary-btn" onClick={() => navigate("/admin/files")}>Files</button>
          <button className="danger-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {showCreateUser && (
        <div className="container admin-panel">
          <h3 className="mb-18">Create User</h3>

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
              <button className="secondary-btn" onClick={() => fetchUsers(true)}>
                Load Users
              </button>
            </div>
          </div>
        </div>
      )}

      {usersLoaded && !showCreateUser && users.length > 0 && (
        <div className="container admin-panel users-panel">
          <div className="users-toolbar">
            <div>
              <h3>Users</h3>
              <p>{approvedUsers.length} approved, {pendingUsers.length} pending</p>
            </div>

            <div className="users-tabs">
              <button
                className={userView === "approved" ? "active" : ""}
                onClick={() => setUserView("approved")}
              >
                Approved Users
              </button>
              <button
                className={userView === "pending" ? "active" : ""}
                onClick={() => setUserView("pending")}
              >
                Pending Users
              </button>
            </div>
          </div>

          <div className="users-search-row">
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name, email, or contact"
            />
            <button className="secondary-btn" onClick={() => setUserSearch("")}>
              Clear
            </button>
          </div>

          <div className="admin-users-list">
            {visibleUsers.length === 0 ? (
              <div className="empty-state">
                No {userView === "approved" ? "approved" : "pending"} users found
              </div>
            ) : visibleUsers.map((u) => (
              <div className={`card admin-user-card ${!u.is_admin && !u.is_approved ? "pending-user" : ""}`} key={u.id}>
                <div className="user-card-main">
                  <div>
                    <div className="card-name">{u.name}</div>
                    <div className="card-meta">{u.email}</div>
                    <div className="card-meta">{u.contact}</div>
                  </div>
                  <span className={`status-pill ${u.is_admin ? "status-admin" : u.is_approved ? "status-approved" : "status-pending"}`}>
                    {u.is_admin ? "Admin" : u.is_approved ? "Approved" : "Pending"}
                  </span>
                </div>

                <div className="card-actions">
                  {!u.is_admin && !u.is_approved && (
                    <>
                      <button className="approve-btn" onClick={() => approveUser(u.id)}>Approve</button>
                      <button className="reject-btn" onClick={() => rejectUser(u.id)}>Reject</button>
                    </>
                  )}
                  {(u.is_admin || u.is_approved) && (
                    <button className="secondary-action-btn" onClick={() => changePassword(u.id)}>Change Password</button>
                  )}
                  <button className="delete-action-btn" onClick={() => deleteUser(u.id)}>Delete</button>
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
    </div>
  );
}

export default Admin;
