import { useState } from "react";
import "./Contactus.css";
import Navbar from "../../components/Layout/Navbar.jsx";


export default function Contactus() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return ( <>
  <Navbar/>
    <section className="contact-page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="contact-container">
        {/* Left panel */}
        <div className="contact-info">
          <h1 className="contact-label-contactus">تواصل معنا</h1>

          <ul className="info-list">
            <li>
              <span className="info-icon">✉</span>
              <span>ep@edgepro.com</span>
            </li>
            <li>
              <span className="info-icon">📞</span>
              <span>01129215324</span>
            </li>
            <li>
              <span className="info-icon">📍</span>
              <span>nth 90, Cairo</span>
            </li>
          </ul>

        </div>

        {/* Right panel — form */}
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>تم الارسال</h2>
              <p>شكراً لتواصلكم. سنعاود الاتصال بكم قريباً.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h3 className="form-title">أرسل رسالتك</h3>

              {/* Name */}
              <div className={`field-group ${focused === "name" ? "active" : ""} ${formData.name ? "filled" : ""}`}>
                <label htmlFor="name">الاسم الكامل</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="أحمد جمال"
                  required
                />
                <span className="field-line" />
              </div>

              {/* Email + Phone side by side */}
              <div className="field-row">
                <div className={`field-group ${focused === "email" ? "active" : ""} ${formData.email ? "filled" : ""}`}>
                  <label htmlFor="email@gmail.com">البريد الالكتروني</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="ex@example.com"
                    required
                  />
                  <span className="field-line" />
                </div>

                <div className={`field-group ${focused === "phone" ? "active" : ""} ${formData.phone ? "filled" : ""}`}>
                  <label htmlFor="phone">رقم  الهاتف</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    placeholder="01* **** ****"
                  />
                  <span className="field-line" />
                </div>
              </div>

              {/* Message */}
              <div className={`field-group textarea-group ${focused === "message" ? "active" : ""} ${formData.message ? "filled" : ""}`}>
                <label htmlFor="message">اكتب رسالتك</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  placeholder="أخبرنا عن رسالتك ..."
                  required
                />
                <span className="field-line" />
              </div>

              <button type="submit" className="submit-btn">
                <span className="btn-text">Send Message</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
