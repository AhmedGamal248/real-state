import { useEffect, useRef, useState } from "react";
import "./login.css";
import Home from "../Home/Home";
import Register from "../Register/Register";
import edge_prologo from "../../assets/edge_prologo.png";
import bank_markzylogo from "../../assets/bank_markzy.png";

export default function Login() {
  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (window.VANTA) {
      effectRef.current = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x2a40,
        shininess: 33.0,
        waveHeight: 21.0,
        waveSpeed: 0.4,
      });
    }

    return () => {
      if (effectRef.current) effectRef.current.destroy();
    };
  }, []);

  const handleLogin = () => {
    if (username && password) {
      setIsLogged(true);
    } else {
      alert("يرجى إدخال اسم المستخدم وكلمة المرور");
    }
  };

  if (isLogged) return <Home />;

  // ── عرض صفحة التسجيل ──
  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-page" ref={vantaRef}>
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
              <div className="logoImages">
                <div className="edge-logo">
                  <img src={edge_prologo} alt="Edge Pro Logo" />
                </div>
                <div className="bank-markzylogo">
                  <img
                    src={bank_markzylogo}
                    alt="Real Estate Platform Logo"
                  />
                </div>
              </div>
            <div className="logoTitle">
              <h1>Real Estate Platform</h1>
            </div>

            <p className="subtitle">
              المنصة الموحدة للخدمات العقارية في جمهورية مصر العربية
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="input-group">
              <label htmlFor="username">اسم المستخدم</label>
              <input
                type="text"
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">كلمة المرور</label>
              <input
                type="password"
                id="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <a href="#" className="forgot-password">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button type="submit" className="login-btn">
              تسجيل الدخول
            </button>
          </form>

          <div className="register-section">
            <p>
              ليس لديك حساب؟{" "}
              <button
                className="register-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
                onClick={() => setShowRegister(true)}
              >
                سجل مستخدم جديد
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
