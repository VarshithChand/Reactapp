import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", contact: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone.replace(/[^0-9]/g, ""));
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Username is required";
    else if (form.name.trim().length < 3) newErrors.name = "Username must be at least 3 characters";
    
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Please enter a valid email";
    
    if (!form.contact.trim()) newErrors.contact = "Phone number is required";
    else if (!validatePhone(form.contact)) newErrors.contact = "Please enter a valid 10-digit phone number";
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    return newErrors;
  };

  const register = async () => {
    setMessage({ type: "", text: "" });
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contact: form.contact,
          password: form.password
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Account created! Waiting for admin approval. Redirecting to login..." });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      register();
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

  return (
    <div className="page-wrapper fade-in">
      <div style={{ maxWidth: "520px", margin: "0 auto", animation: "slideUp 0.6s ease" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--sp-24)", textAlign: "center" }}>
            <div style={{ 
              fontSize: "60px", 
              marginBottom: "var(--sp-12)",
              animation: "bounce 2s infinite" 
            }}>✍️</div>
            <div className="badge" style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.2)", color: "#86efac" }}>New account</div>
            <h1 style={{ 
              marginTop: "var(--sp-14)", 
              marginBottom: "var(--sp-8)",
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #86efac, #d1fae5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Create Account</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Join our secure platform and start managing files</p>
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
            {/* Username */}
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)" }}>Username</label>
              <input
                placeholder="Choose a username"
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
                  border: `1px solid ${errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.name && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.name}</p>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)" }}>Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ 
                  fontSize: "14px",
                  padding: "var(--sp-10) var(--sp-12)",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.email && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.email}</p>}
            </div>

            {/* Contact */}
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)" }}>Phone Number</label>
              <input
                placeholder="10-digit phone number"
                value={form.contact}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, contact: digits.slice(0, 10) });
                  setErrors({ ...errors, contact: "" });
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength="10"
                style={{ 
                  fontSize: "14px",
                  padding: "var(--sp-10) var(--sp-12)",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${errors.contact ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = errors.contact ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.contact && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.contact}</p>}
            </div>

            {/* Password */}
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)", display: "block" }}>Password</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  style={{ 
                    fontSize: "14px",
                    padding: "var(--sp-11) 50px var(--sp-11) var(--sp-12)",
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${errors.password ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                    borderRadius: "8px",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                    textOverflow: "ellipsis"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                    e.target.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.borderColor = errors.password ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    opacity: loading ? 0.5 : 1,
                    padding: "0",
                    width: "32px",
                    height: "32px",
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
              {form.password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: strengthColors[passwordStrength] || "#999"
                  }}>
                    <div style={{
                      display: "flex",
                      gap: "2px",
                      flex: 1
                    }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                          height: "4px",
                          flex: 1,
                          borderRadius: "2px",
                          background: i < passwordStrength ? strengthColors[passwordStrength] : "rgba(255,255,255,0.1)",
                          transition: "all 0.3s ease"
                        }}></div>
                      ))}
                    </div>
                    <span>{strengthLabels[passwordStrength]}</span>
                  </div>
                </div>
              )}
              {errors.password && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-6)", display: "block" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                  setErrors({ ...errors, confirmPassword: "" });
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ 
                  fontSize: "14px",
                  padding: "var(--sp-10) var(--sp-12)",
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${errors.confirmPassword ? "rgba(239, 68, 68, 0.5)" : form.password && form.confirmPassword === form.password ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = errors.confirmPassword ? "rgba(239, 68, 68, 0.5)" : form.password && form.confirmPassword === form.password ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {form.password && form.confirmPassword === form.password && (
                <p style={{ color: "#86efac", fontSize: "12px", marginTop: "4px" }}>✓ Passwords match</p>
              )}
              {errors.confirmPassword && <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "4px" }}>⚠️ {errors.confirmPassword}</p>}
            </div>

            <button 
              onClick={register}
              disabled={loading}
              style={{
                padding: "var(--sp-12) var(--sp-16)",
                background: loading ? "rgba(16, 185, 129, 0.5)" : "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
                marginTop: "var(--sp-12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(16, 185, 129, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.3)";
                }
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
            <div style={{ flex: 1, height: "1px", background: "rgba(16, 185, 129, 0.2)" }}></div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>already have account?</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(16, 185, 129, 0.2)" }}></div>
          </div>
        </div>

        <div className="container" style={{ marginTop: "var(--sp-20)", textAlign: "center" }}>
          <button 
            onClick={() => navigate("/login")}
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
            Sign in instead
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

export default Register;
