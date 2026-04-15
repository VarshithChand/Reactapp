import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", contact: "", password: "" });
  const navigate = useNavigate();

  const register = async () => {
    if (!form.name || !form.email || !form.contact || !form.password) {
      alert("Please fill all fields");
      return;
    }
    await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="page-wrapper fade-in">
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--sp-20)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "var(--sp-8)" }}>✍️</div>
            <div className="badge" style={{ display: "inline-block" }}>New account</div>
            <h2 style={{ marginTop: "var(--sp-12)", marginBottom: "var(--sp-6)" }}>Create account</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Join our secure platform today</p>
          </div>

          <div className="flex-col gap-12">
            {["Name", "Email", "Contact"].map((field) => (
              <div className="input-group" key={field}>
                <label>{field}</label>
                <input
                  placeholder={`Enter your ${field.toLowerCase()}`}
                  onChange={(e) =>
                    setForm({ ...form, [field.toLowerCase()]: e.target.value })
                  }
                  style={{ fontSize: "14px" }}
                />
              </div>
            ))}

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Choose a strong password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ fontSize: "14px" }}
              />
            </div>

            <button 
              onClick={register}
              style={{
                padding: "var(--sp-12) var(--sp-16)",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 16px rgba(16, 185, 129, 0.25)",
                marginTop: "var(--sp-8)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 24px rgba(16, 185, 129, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.25)";
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        <div style={{ marginTop: "var(--sp-18)" }}>
          <div className="divider"><span>already have account?</span></div>
        </div>

        <div className="container" style={{ textAlign: "center" }}>
          <button 
            onClick={() => navigate("/login")}
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
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;