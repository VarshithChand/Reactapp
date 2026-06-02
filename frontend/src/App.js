import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminCourseAccess from "./pages/AdminCourseAccess";
import AdminFiles from "./pages/AdminFiles";
import User from "./pages/User";
import CourseDetail from "./pages/CourseDetail";
import Uploads from "./pages/Uploads";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  const features = [
    { label: "Files", title: "File Storage", desc: "Upload, view, download, and manage shared materials." },
    { label: "Access", title: "Course Control", desc: "Admins can assign demo or full access per course." },
    { label: "Safe", title: "Secure Accounts", desc: "Approved users, protected sessions, and role-based pages." },
  ];

  return (
    <div className="home-shell">
      <div className="home-card">
        <div className="home-brand-row">
          <div className="home-logo">EV</div>
          <span>EduVault</span>
        </div>

        <div className="home-hero">
          <div className="home-kicker">Learning access portal</div>
          <h1>Welcome Back</h1>
          <p>
            Sign in to manage course access, upload learning files, and keep every module organized in one place.
          </p>
        </div>

        <div className="home-actions">
          <button className="home-primary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="home-secondary-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => (
            <div className="home-feature-card" key={feature.title}>
              <div className="home-feature-mark">{feature.label}</div>
              <div>
                <div className="home-feature-title">{feature.title}</div>
                <div className="home-feature-desc">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/courses" element={<AdminCourseAccess />} />
        <Route path="/admin/files" element={<AdminFiles />} />
        <Route path="/user" element={<User />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/course/:courseName" element={<CourseDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
