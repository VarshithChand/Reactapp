import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const login = async () => {
    setMessage({ type: "", text: "" });
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isAdmin", data.is_admin ? "true" : "false");
        localStorage.setItem("isUser", data.is_admin ? "false" : "true");
        localStorage.setItem("username", form.name);
        setMessage({ type: "success", text: "Login successful! Redirecting..." });
        
        setTimeout(() => {
          navigate(data.is_admin ? "/admin" : "/user");
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.error || "Login failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      login();
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div style={{ maxWidth: "480px", margin: "0 auto", animation: "slideUp 0.6s ease" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--sp-24)", textAlign: "center" }}>
            <div style={{ 
              fontSize: "60px", 
              marginBottom: "var(--sp-12)",
              animation: "bounce 2s infinite"
            }}>🔐</div>
            <div className="badge" style={{ display: "inline-block", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc" }}>Welcome back</div>
            <h1 style={{ 
              marginTop: "var(--sp-14)", 
              marginBottom: "var(--sp-8)",
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #a5b4fc, #c7d2fe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Sign In</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Access your account to manage files securely</p>
          </div>

          {message.text && (
            <div style={{
              padding: "var(--sp-12) var(--sp-14)",
              borderRadius: "8px",
              marginBottom: "var(--sp-16)",
              fontSize: "13px",
              fontWeight: "500",
              background: message.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
              color: message.type === "error" ? "#fca5a5" : "#86efac",
              border: `1px solid ${message.type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
              animation: "slideDown 0.3s ease"
            }}>
              {message.text}
            </div>
          )}

          <div className="flex-col gap-14">
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)" }}>Username</label>
              <input
                placeholder="Enter your username"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ 
                  fontSize: "14px",
                  padding: "var(--sp-10) var(--sp-12)",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(129, 140, 248, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(129, 140, 248, 0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(129, 140, 248, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(129, 140, 248, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.name && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.name}</p>}
            </div>

            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)", display: "block" }}>Password</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  style={{ 
                    fontSize: "14px",
                    padding: "var(--sp-10) 48px var(--sp-10) var(--sp-12)",
                    width: "100%",
                    height: "44px",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${errors.password ? "rgba(239, 68, 68, 0.5)" : "rgba(129, 140, 248, 0.3)"}`,
                    borderRadius: "8px",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                    textOverflow: "ellipsis",
                    lineHeight: "1.5"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(129, 140, 248, 0.5)";
                    e.target.style.boxShadow = "0 0 12px rgba(129, 140, 248, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.borderColor = errors.password ? "rgba(239, 68, 68, 0.5)" : "rgba(129, 140, 248, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    opacity: loading ? 0.5 : 1,
                    padding: "0",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    zIndex: 10,
                    pointerEvents: loading ? "none" : "auto"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.color = "rgba(255,255,255,0.9)";
                      e.target.style.transform = "scale(1.15) translateY(-50%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.color = "rgba(255,255,255,0.6)";
                      e.target.style.transform = "translateY(-50%)";
                    }
                  }}
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>
              {errors.password && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.password}</p>}
            </div>

            <button 
              onClick={login}
              disabled={loading}
              style={{
                padding: "var(--sp-12) var(--sp-16)",
                background: loading ? "rgba(129, 140, 248, 0.5)" : "linear-gradient(135deg, #818cf8, #6366f1)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 16px rgba(129, 140, 248, 0.3)",
                marginTop: "var(--sp-8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(129, 140, 248, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(129, 140, 248, 0.3)";
                }
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "var(--sp-20)" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sp-12)",
            opacity: 0.5
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(129, 140, 248, 0.2)" }}></div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(129, 140, 248, 0.2)" }}></div>
          </div>
        </div>

        <div className="container" style={{ textAlign: "center", marginTop: "var(--sp-20)" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "var(--sp-12)" }}>Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "var(--sp-12) var(--sp-16)",
              background: "rgba(129, 140, 248, 0.1)",
              color: "#a5b4fc",
              border: "1.5px solid rgba(129, 140, 248, 0.3)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "rgba(129, 140, 248, 0.15)";
                e.target.style.borderColor = "rgba(129, 140, 248, 0.5)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = "rgba(129, 140, 248, 0.1)";
                e.target.style.borderColor = "rgba(129, 140, 248, 0.3)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            Create an account
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;