import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import FaqSection from "../../components/FAQ/FaqSection";
import videoBg from "../../assets/videoBg.mp4";
import FinanceMap from "../FinanceMap/FinanceMap";
import RequestForm from "../RequestForm/RequestForm";
import "./Home.css";

const services = [
  {
    icon: "🏦",
    title: "التمويل العقاري",
    desc: "احصل على أفضل عروض التمويل من كبرى البنوك المصرية بخطوة واحدة.",
    color: "#0ea5e9",
    to: "/dashboard",
  },
  {
    icon: "📋",
    title: "التسجيل والاستشارات",
    desc: "سجل العقارات واحصل على استشارات قانونية من خبراء معتمدين بسهولة.",
    color: "#10b981",
    to: "/register",
  },
  {
    icon: "📊",
    title: "التقارير والتحليلات",
    desc: "تابع مؤشرات السوق والأسعار لمساعدتك في اتخاذ قرار أسرع وأكثر دقة.",
    color: "#f59e0b",
    to: "/dashboard",
  },
];

const stats = [
  { value: "50K+", label: "مستخدم نشط" },
  { value: "120+", label: "بنك وشركة تمويل" },
  { value: "98%", label: "نسبة رضا العملاء" },
  { value: "24/7", label: "دعم فني متواصل" },
];

const whyUs = [
  {
    icon: "🔒",
    title: "أمان تام",
    desc: "تشفير عالي المستوى لحماية بياناتك الشخصية والمالية.",
  },
  {
    icon: "⚡",
    title: "سرعة الإنجاز",
    desc: "إنهاء إجراءاتك العقارية في وقت قياسي دون تعقيد.",
  },
  {
    icon: "🤝",
    title: "موثوقية عالية",
    desc: "منصة معتمدة ومرتبطة بالجهات الرسمية المختصة.",
  },
  {
    icon: "🎯",
    title: "دقة المعلومات",
    desc: "بيانات محدثة لحظيا من مصادر موثوقة لدعم قرارك.",
  },
  {
    icon: "📱",
    title: "سهولة الاستخدام",
    desc: "واجهة بسيطة وسريعة تناسب جميع الأجهزة والشاشات.",
  },
  {
    icon: "🌍",
    title: "تغطية شاملة",
    desc: "خدمات تمتد عبر المحافظات والمناطق الرئيسية داخل مصر.",
  },
];

const tabs = [
  { id: "finance", label: "🏦 التمويل العقاري" },
  { id: "consult", label: "📋 التسجيل والاستشارات القانونية" },
  { id: "reports", label: "📊 التقارير والتحليلات" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("finance");
  const [showForm, setShowForm] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="home-page" dir="rtl">
      <Navbar />

      <section className="hero home-hero" dir="rtl">
        <video autoPlay muted loop playsInline className="bg-video">
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="heroShadow" />
        <div className="hero-overlay" />
        <div className="hero-particles">
          {[...Array(6)].map((_, index) => (
            <span key={index} className={`particle p${index + 1}`} />
          ))}
        </div>

        <div className="home-hero-content">
          <div className="hero-badge">🏛️ الجهة الرسمية للخدمات العقارية</div>
          <h1 className="hero-title">
            المنصة التفاعلية
            <span className="hero-title-highlight"> للخدمات العقارية</span>
            <br />
            في جمهورية مصر العربية
          </h1>
          <p className="hero-sub">
            منصة متكاملة تربط بين المواطن والبنوك وشركات العقارات لتسهيل
            البحث والتسجيل والتمويل العقاري بأقصى سرعة وأمان.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById("services-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ابدأ الآن
            </button>
            <button
              className="btn-outline"
              onClick={() =>
                document
                  .getElementById("tabs-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
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

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((item) => (
            <div className="stat-card" key={item.label}>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="services-section" id="services-section">
        <div className="section-header">
          <span className="section-tag">خدماتنا</span>
          <h2 className="section-title">كل ما تحتاجه في مكان واحد</h2>
          <p className="section-desc">
            نقدم مجموعة متكاملة من الخدمات العقارية الرقمية لتوفير وقتك وجهدك.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div
                className="service-icon-wrap"
                style={{
                  background: `${service.color}18`,
                  border: `1.5px solid ${service.color}40`,
                }}
              >
                <span className="service-icon">{service.icon}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
              <Link className="service-btn-link" to={service.to}>
                <span className="service-btn" style={{ color: service.color }}>
                  استعرض التفاصيل ←
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="tabs-section" id="tabs-section">
        <div className="section-header">
          <span className="section-tag">الخدمات التفاعلية</span>
          <h2 className="section-title">ابدأ الآن مع خدماتنا</h2>
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
            {activeTab === "finance" && (
              <div className="tab-finance-wrap">
                <FinanceMap />
              </div>
            )}

            {activeTab === "consult" && (
              <div className="tab-consult-wrap">
                <div className="tab-consult-cards">
                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">⚖️</span>
                    <div>
                      <h4 className="tab-consult-card-title">
                        استشارة قانونية عقارية
                      </h4>
                      <p className="tab-consult-card-desc">
                        تواصل مع محامين معتمدين لحل النزاعات العقارية ومراجعة
                        المستندات.
                      </p>
                    </div>
                  </div>

                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">📋</span>
                    <div>
                      <h4 className="tab-consult-card-title">
                        تسجيل عقاري رسمي
                      </h4>
                      <p className="tab-consult-card-desc">
                        إجراءات التسجيل في الشهر العقاري بمساندة خبراء معتمدين.
                      </p>
                    </div>
                  </div>

                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">🕐</span>
                    <div>
                      <h4 className="tab-consult-card-title">رد خلال 24 ساعة</h4>
                      <p className="tab-consult-card-desc">
                        فريقنا يراجع طلبك بسرعة ويعود لك في يوم عمل واحد.
                      </p>
                    </div>
                  </div>

                  <div className="tab-consult-card">
                    <span className="tab-consult-card-icon">🎁</span>
                    <div>
                      <h4 className="tab-consult-card-title">
                        استشارة أولية مجانية
                      </h4>
                      <p className="tab-consult-card-desc">
                        ابدأ بدون رسوم مبدئية واحصل على توجيه واضح قبل الإجراء.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tab-consult-cta">
                  <button
                    className="btn-primary btn-large"
                    onClick={() => {
                      setFormDefaultType("consultation");
                      setShowForm(true);
                    }}
                  >
                    ⚖️ اطلب استشارتك الآن
                  </button>
                  <p className="tab-consult-note">
                    ✅ معتمد رسميا • 🔒 بياناتك محمية • 💬 استشارة أولية مجانية
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="coming-soon-box">
                <span className="coming-icon">📊</span>
                <h3>لوحة التقارير</h3>
                <p>
                  نجهز واجهة تحليلات أوضح لعرض المؤشرات والمقارنات في الإصدار
                  القادم.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showForm && (
        <RequestForm
          defaultType={formDefaultType}
          onClose={() => {
            setShowForm(false);
            setFormDefaultType(null);
          }}
        />
      )}

      <section className="why-section">
        <div className="why-inner">
          <div className="section-header">
            <span className="section-tag">لماذا نحن</span>
            <h2 className="section-title">ثق بنا لأننا نستحق ثقتك</h2>
            <p className="section-desc">
              بنينا هذه المنصة بمعايير عملية واضحة لتخدم المستخدم بسرعة ووضوح
              على كل جهاز.
            </p>
          </div>

          <div className="why-grid">
            {whyUs.map((item) => (
              <div className="why-card" key={item.title}>
                <span className="why-icon">{item.icon}</span>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">جاهز للبدء؟</h2>
          <p className="cta-sub">
            انضم إلى أكثر من 50,000 مستخدم يستفيدون من المنصة يوميا.
          </p>
          <Link className="btn-primary btn-large cta-link-btn" to="/register">
            سجّل الآن مجانا
          </Link>
        </div>
      </section>

      <>
        <button
          className={`chat-toggle-btn ${chatOpen ? "open" : ""}`}
          onClick={() => setChatOpen((open) => !open)}
        >
          {chatOpen ? "✕" : "💬"}
        </button>

        <div className={`chat-widget ${chatOpen ? "show" : ""}`}>
          <div className="chat-header">
            <span>المساعد الذكي</span>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>

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
