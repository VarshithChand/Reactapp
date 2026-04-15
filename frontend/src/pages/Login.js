import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.is_admin) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("username", form.name); // ✅ ADD THIS
      navigate("/admin");
    } else if (data.message) {
      localStorage.setItem("isUser", "true");
      localStorage.setItem("username", form.name); // ✅ ADD THIS
      localStorage.removeItem("isAdmin");
      navigate("/user");
    } else {
      alert(data.error || "Invalid credentials");
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--sp-20)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "var(--sp-8)" }}>🔐</div>
            <div className="badge" style={{ display: "inline-block" }}>Welcome back</div>
            <h2 style={{ marginTop: "var(--sp-12)", marginBottom: "var(--sp-6)" }}>Sign in</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Access your account to manage files</p>
          </div>

          <div className="flex-col gap-12">
            <div className="input-group">
              <label>Username</label>
              <input
                placeholder="Enter your name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ fontSize: "14px" }}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ fontSize: "14px" }}
              />
            </div>

            <button 
              onClick={login}
              style={{
                padding: "var(--sp-12) var(--sp-16)",
                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 16px rgba(129, 140, 248, 0.25)",
                marginTop: "var(--sp-8)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 24px rgba(129, 140, 248, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 16px rgba(129, 140, 248, 0.25)";
              }}
            >
              Sign in
            </button>
          </div>
        </div>

        <div style={{ marginTop: "var(--sp-18)" }}>
          <div className="divider"><span>or</span></div>
        </div>

        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "var(--sp-12)" }}>Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            style={{
              width: "100%",
              padding: "var(--sp-12) var(--sp-16)",
              background: "rgba(129, 140, 248, 0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(129, 140, 248, 0.35)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(129, 140, 248, 0.25)";
              e.target.style.borderColor = "rgba(129, 140, 248, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(129, 140, 248, 0.15)";
              e.target.style.borderColor = "rgba(129, 140, 248, 0.35)";
            }}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;