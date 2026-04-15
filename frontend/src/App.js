import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import User from "./pages/User";
import "./App.css";

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    padding: "28px",
    borderRadius: "18px",
    backdropFilter: "blur(18px)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #818cf8, #22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
  },

  buttonPrimary: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1, #22d3ee)",
    color: "#fff",
    transition: "all 0.3s ease",
  },

  buttonSecondary: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#c7d2fe",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  featureCard: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
  },
};

/* ================= HOME ================= */
function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: "📂", title: "File Storage", desc: "Upload & manage files easily" },
    { icon: "📚", title: "Courses", desc: "Python, Java, C, C++ learning" },
    { icon: "🔐", title: "Secure", desc: "Encrypted & protected system" },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        
        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "60px" }}>🚀</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            Smart file sharing & course platform
          </p>
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <button
            onClick={() => navigate("/login")}
            style={styles.buttonPrimary}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            🔐 Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={styles.buttonSecondary}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "scale(1)";
            }}
          >
            ✍️ Register
          </button>
        </div>

        {/* FEATURES */}
        <div style={{ marginTop: "30px", display: "grid", gap: "14px" }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <div style={{ fontSize: "24px" }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ================= APP ================= */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;