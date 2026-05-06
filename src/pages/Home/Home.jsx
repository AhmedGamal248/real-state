import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";
import FaqSection from "../../components/FAQ/FaqSection";
import "./Home.css";
import videoBg from "../../assets/videoBg.mp4";
import FinanceMap from "../FinanceMap/FinanceMap";
import { useState, useEffect, useRef } from "react";
import RequestForm from "../RequestForm/RequestForm";
import { Link } from "react-router";
// import LeadsDemo from "../../components/LeadModal/LeadModal";

const services = [
  {
    icon: "🏦",
    title: "التمويل العقاري",
    desc: "احصل على أفضل عروض التمويل من كبرى البنوك المصرية بضغطة واحدة",
    color: "#0ea5e9",
    to:'dashboard'
  },
  // {
  //   icon: "⚖️",
  //   title: "المخالفات العقارية",
  //   desc: "تسوية المخالفات البنائية وإجراءات التقنين بشكل سريع وآمن",
  //   color: "#f59e0b",
  // },
  {
    icon: "📋",
    title: "التسجيل والاستشارات",
    desc: "تسجيل العقارات والحصول على استشارات قانونية من خبراء معتمدين",
    color: "#10b981",
  },
  {
    icon: "📊",
    title: "التقارير والتحليلات",
    desc: "تحليلات السوق العقاري وتقارير الأسعار لمساعدتك في اتخاذ القرار",
    color: "#8b5cf6",
  },
];

const stats = [
  { value: "50K+", label: "مستخدم نشط" },
  { value: "120+", label: "بنك وشركة تمويل" },
  { value: "98%", label: "نسبة رضا العملاء" },
  { value: "24/7", label: "دعم فني متواصل" },
];

const whyUs = [
  { icon: "🔒", title: "أمان تام", desc: "تشفير عالي المستوى لحماية بياناتك الشخصية والمالية" },
  { icon: "⚡", title: "سرعة الإنجاز", desc: "إنهاء إجراءاتك العقارية في وقت قياسي دون تعقيد" },
  { icon: "🤝", title: "موثوقية عالية", desc: "منصة معتمدة رسمياً ومرتبطة بالجهات الحكومية المختصة" },
  { icon: "🎯", title: "دقة المعلومات", desc: "بيانات محدثة لحظياً من مصادر رسمية موثوقة" },
  { icon: "📱", title: "سهولة الاستخدام", desc: "واجهة بسيطة تناسب جميع الأعمار والمستويات" },
  { icon: "🌍", title: "تغطية شاملة", desc: "تغطي جميع المحافظات والأحياء في جمهورية مصر العربية" },
];

const tabs = [
  { id: "finance", label: "🏦 التمويل العقاري" },
  { id: "consult", label: "📋  التسجيل والاستشارات القانونية" },
  // { id: "violations", label: "⚖️ المخالفات العقارية" },
  // 👇 الجديد
  // { id: "leads", label: "📊 إدارة العملاء" },
  { id: "leads", label: "📊 التقارير والتحليلات " },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("finance");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  // ─── 2. Add this state inside Home() ──────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState(null); // "financing" | "consultation"
  const [chatOpen, setChatOpen] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page" dir="rtl">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="hero home-hero" dir="rtl">
        <video autoPlay muted loop playsInline className="bg-video">
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="heroShadow" />
        <div className="hero-overlay" />
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => <span key={i} className={`particle p${i + 1}`} />)}
        </div>
        <div className="home-hero-content">
          <div className="hero-badge">🏛️ الجهة الرسمية للخدمات العقارية</div>
          <h1 className="hero-title">
            المنصة التفاعلية
            <span className="hero-title-highlight"> للخدمات العقارية</span>
            <br />في جمهورية مصر العربية
          </h1>
          <p className="hero-sub">
            منصة متكاملة تربط بين المواطن والبنوك وشركات العقارات لتسهيل كل
            عمليات البحث والتسجيل والتمويل العقاري بأقصى سرعة وأمان
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" })}>
              ابدأ الآن
            </button>
            <button className="btn-outline" onClick={() => document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" })}>
              استكشف الخدمات
            </button>
          </div>
          <div className="hero-trust">
            <span>✅ معتمد من وزارة الإسكان</span>
            <span>✅ مرتبط بالسجل العقاري الرسمي</span>
            <span>✅ أمان بنكي 256-bit</span>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>↓</span>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="services-section" id="services-section">
        <div className="section-header">
          <span className="section-tag">خدماتنا</span>
          <h2 className="section-tag">كل ما تحتاجه في مكان واحد</h2>
          <p className="section-desc">
            نقدم لك مجموعة متكاملة من الخدمات العقارية الرقمية لتوفير وقتك وجهدك
          </p>
        </div>
        <div className="services-grid">
          
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-icon-wrap" style={{ background: `${s.color}18`, border: `1.5px solid ${s.color}40` }}>
                <span className="service-icon">{s.icon}</span>
              </div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <Link to='/dashboard'>
              <button className="service-btn" style={{ color: s.color }}>
                استعرض التفاصيل ←
              </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TABS ═══ */}
      <section className="tabs-section" id="tabs-section">
        <div className="section-header">
          <span className="section-tag">الخدمات التفاعلية</span>
          <h2 className="section-tag">ابدأ الآن مع خدماتنا</h2>
        </div>
        <div className="tabs-container">
          <div className="tabs-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-panel">

            {/* ── Finance Tab ── */}
            {activeTab === "finance" && (
              <div className="tab-finance-wrap">
                <FinanceMap />
                {/* <div className="tab-cta-bar">
                  <p className="tab-cta-text">
                    وجدت العقار المناسب؟ قدّم طلب التمويل الآن مباشرةً
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => { setFormDefaultType("financing"); setShowForm(true); }}
                  >
                    🏦 قدّم طلب تمويل عقاري
                  </button>
                </div> */}
              </div>
            )}

            {/* ── Violations Tab ── */}
            {activeTab === "violations" && (
              <div className="coming-soon-box">
                <span className="coming-icon">🔨</span>
                <h3>قيد التطوير</h3>
                <p>خدمة تسوية المخالفات العقارية ستكون متاحة قريباً</p>
              </div>
            )}

            {/* ── Consult Tab ── */}
            {activeTab === "consult" && (
              <div className="tab-consult-wrap">
                {/* Info cards */}
                <div className="tab-consult-cards">
                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">⚖️</span>
                    <div>
                      <h4 className="tab-consult-card-title">استشارة قانونية عقارية</h4>
                      <p className="tab-consult-card-desc">
                        تواصل مع محامين معتمدين من نقابة المحامين لحل نزاعاتك العقارية
                      </p>
                    </div>
                  </div>
                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">📋</span>
                    <div>
                      <h4 className="tab-consult-card-title">تسجيل عقاري رسمي</h4>
                      <p className="tab-consult-card-desc">
                        إجراءات تسجيل العقارات في الشهر العقاري بمساعدة خبراء معتمدين
                      </p>
                    </div>
                  </div>
                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">🕐</span>
                    <div>
                      <h4 className="tab-consult-card-title">رد خلال 24 ساعة</h4>
                      <p className="tab-consult-card-desc">
                        يلتزم خبراؤنا بالرد على استشارتك خلال يوم عمل واحد
                      </p>
                    </div>
                  </div>
                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">🎁</span>
                    <div>
                      <h4 className="tab-consult-card-title">استشارة أولية مجانية</h4>
                      <p className="tab-consult-card-desc">
                        أول استشارة مجانية تماماً بدون أي رسوم أو التزامات
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="tab-consult-cta">
                  <button
                    className="btn-primary btn-large"
                    onClick={() => { setFormDefaultType("consultation"); setShowForm(true); }}
                  >
                    ⚖️ اطلب استشارتك الآن
                  </button>
                  <p className="tab-consult-note">
                    ✅ معتمد رسمياً &nbsp;•&nbsp; 🔒 بياناتك محمية &nbsp;•&nbsp; 💬 استشارة أولية مجانية
                  </p>
                </div>
              </div>
            )}
            {/* ── Leads Tab ── */}
            {activeTab === "leads" && (
              <div className="tab-leads-wrap">
                <LeadsDemo/>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FORM MODAL ═══ */}
      {showForm && (
        <RequestForm
          defaultType={formDefaultType}
          onClose={() => { setShowForm(false); setFormDefaultType(null); }}
        />
      )}
      {/* ═══ WHY US ═══ */}
      <section className="why-section">
        <div className="why-inner">
          <div className="section-header">
            <span className="section-tag">لماذا نحن</span>
            <h2 className="section-title">ثق بنا لأننا نستحق ثقتك</h2>
            <p className="section-desc">بنينا هذه المنصة بمعايير عالمية لخدمة المواطن المصري بأفضل صورة</p>
          </div>
          <div className="why-grid">
            {whyUs.map((w) => (
              <div className="why-card" key={w.title}>
                <span className="why-icon">{w.icon}</span>
                <h4 className="why-title">{w.title}</h4>
                <p className="why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">جاهز للبدء؟</h2>
          <p className="cta-sub">انضم إلى أكثر من 50,000 مواطن يستخدمون منصتنا يومياً</p>
          <button className="btn-primary btn-large">
            سجّل الآن مجاناً
          </button>
        </div>
      </section>
      {/* ═══ CHATBOT WIDGET ═══ */}
      <>
        {/* زرار الشات */}
        <button
          className={`chat-toggle-btn ${chatOpen ? "open" : ""}`}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? "✖" : "💬"}
        </button>

        {/* نافذة الشات */}
        <div className={`chat-widget ${chatOpen ? "show" : ""}`}>

          {/* Header */}
          <div className="chat-header">
            <span>المساعد الذكي</span>
            <button onClick={() => setChatOpen(false)}>✖</button>
          </div>

          {/* Iframe */}
          <iframe
            src="https://chat-put-2che.vercel.app/"
            title="chatbot"
            className="chat-iframe"
          />
        </div>
      </>
      <Footer />
    </div>


  );
}