import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Register.css";
import Login from "../Login/Login";

// ─── Field config per account type ───────────────────────────────────────────

const AFRAD_FIELDS = {
  personal: {
    title: "البيانات الشخصية",
    rows: [
      [
        {
          id: "firstName",
          label: "الاسم الأول",
          type: "text",
          placeholder: "محمد",
        },
        {
          id: "lastName",
          label: "الاسم الأخير",
          type: "text",
          placeholder: "أحمد",
        },
      ],
      [
        {
          id: "nationalId",
          label: "الرقم القومي",
          type: "text",
          placeholder: "2XXXXXXXXXXXXXXX",
          full: true,
        },
      ],
      [
        {
          id: "phone",
          label: "رقم الهاتف",
          type: "text",
          placeholder: "01XXXXXXXXX",
        },
        {
          id: "email",
          label: "البريد الإلكتروني",
          type: "email",
          placeholder: "example@email.com",
        },
      ],
    ],
  },
  account: {
    title: "بيانات الحساب",
    rows: [
      [
        {
          id: "username",
          label: "اسم المستخدم",
          type: "text",
          placeholder: "username",
          full: true,
        },
      ],
      [
        {
          id: "password",
          label: "كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
        {
          id: "confirmPassword",
          label: "تأكيد كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
      ],
    ],
  },
};

const SHARIKAT_FIELDS = {
  company: {
    title: "بيانات الشركة",
    rows: [
      [
        {
          id: "companyName",
          label: "اسم الشركة",
          type: "text",
          placeholder: "اسم الشركة الرسمي",
          full: true,
        },
      ],
      [
        {
          id: "commercialReg",
          label: "رقم السجل التجاري",
          type: "text",
          placeholder: "XXXXXXXXXX",
        },
        {
          id: "taxNumber",
          label: "الرقم الضريبي",
          type: "text",
          placeholder: "XXXXXXXXX",
        },
      ],
      [
        {
          id: "activity",
          label: "نشاط الشركة",
          type: "select",
          full: true,
          options: [
            "تطوير عقاري",
            "وساطة عقارية",
            "إدارة أملاك",
            "مقاولات",
            "استشارات عقارية",
          ],
        },
      ],
      [
        {
          id: "companyPhone",
          label: "هاتف الشركة",
          type: "text",
          placeholder: "0XXXXXXXXXXX",
        },
        {
          id: "companyEmail",
          label: "البريد الرسمي",
          type: "email",
          placeholder: "info@company.com",
        },
      ],
    ],
  },
  manager: {
    title: "بيانات المسؤول",
    rows: [
      [
        {
          id: "managerName",
          label: "اسم المسؤول",
          type: "text",
          placeholder: "الاسم الكامل",
        },
        {
          id: "jobTitle",
          label: "المسمى الوظيفي",
          type: "text",
          placeholder: "مدير",
        },
      ],
      [
        {
          id: "password",
          label: "كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
        {
          id: "confirmPassword",
          label: "تأكيد كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
      ],
    ],
  },
};

const BUNUK_FIELDS = {
  bank: {
    title: "بيانات البنك",
    rows: [
      [
        {
          id: "bankName",
          label: "اسم البنك",
          type: "text",
          placeholder: "اسم البنك الرسمي",
          full: true,
        },
      ],
      [
        {
          id: "bankCode",
          label: "كود البنك",
          type: "text",
          placeholder: "XXX",
        },
        {
          id: "bankType",
          label: "نوع البنك",
          type: "select",
          options: ["بنك حكومي", "بنك خاص", "بنك إسلامي", "بنك أجنبي"],
        },
      ],
      [
        {
          id: "cbeNumber",
          label: "رقم ترخيص البنك المركزي",
          type: "text",
          placeholder: "CBE-XXXXXXXXX",
          full: true,
        },
      ],
      [
        {
          id: "bankPhone",
          label: "هاتف البنك",
          type: "text",
          placeholder: "0XXXXXXXXXXX",
        },
        {
          id: "bankEmail",
          label: "البريد الرسمي",
          type: "email",
          placeholder: "info@bank.com",
        },
      ],
    ],
  },
  manager: {
    title: "بيانات المسؤول",
    rows: [
      [
        {
          id: "managerName",
          label: "اسم المسؤول",
          type: "text",
          placeholder: "الاسم الكامل",
          full: true,
        },
      ],
      [
        {
          id: "role",
          label: "الصلاحية",
          type: "select",
          full: true,
          options: ["مدير النظام", "مشرف", "مستخدم عادي"],
        },
      ],
      [
        {
          id: "password",
          label: "كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
        {
          id: "confirmPassword",
          label: "تأكيد كلمة المرور",
          type: "password",
          placeholder: "••••••••",
        },
      ],
    ],
  },
};

const TYPE_CONFIG = {
  افراد: {
    icon: "👤",
    title: "بيانات الأفراد",
    sub: "أدخل بياناتك الشخصية",
    fields: AFRAD_FIELDS,
  },
  شركات: {
    icon: "🏢",
    title: "بيانات الشركة",
    sub: "أدخل بيانات شركتك الرسمية",
    fields: SHARIKAT_FIELDS,
  },
  بنوك: {
    icon: "🏦",
    title: "بيانات البنك",
    sub: "أدخل بيانات البنك الرسمية",
    fields: BUNUK_FIELDS,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDots({ step }) {
  return (
    <div className="step-dots">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`step-dot ${step >= n ? "active" : ""}`} />
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <div className="input-group">
        <label htmlFor={field.id}>{field.label}</label>
        <select
          id={field.id}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
        >
          <option value="">اختر...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="input-group">
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    </div>
  );
}

function FieldsSection({ sections, formData, onChange }) {
  return (
    <>
      {Object.entries(sections).map(([key, section], si) => (
        <div key={key}>
          {si > 0 && <hr className="form-divider" />}
          <p className="section-title">{section.title}</p>
          {section.rows.map((row, ri) => {
            if (row.length === 1 || row[0].full) {
              return (
                <FieldInput
                  key={ri}
                  field={row[0]}
                  value={formData[row[0].id]}
                  onChange={onChange}
                />
              );
            }
            return (
              <div key={ri} className="fields-row">
                {row.map((field) => (
                  <FieldInput
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={onChange}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const vantaRef = useRef(null);
  const effectRef = useRef(null);
  const navigate = useNavigate();
  const [backToLogin, setBackToLogin] = useState(false);

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
  // const handleBackToLogin = () => {
  //   navigate("/");
  // };
  const handleFieldChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({});
  };

  const handleNext = () => {
    if (!selectedType) {
      alert("يرجى اختيار نوع الحساب");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your validation logic here
    setStep(3);
  };

  const handleBackToType = () => {
    setStep(1);
  };

  const config = selectedType ? TYPE_CONFIG[selectedType] : null;
  if (backToLogin) {
    return <Login onBackToLogin={() => setBackToLogin(false)} />;
  }
  return (
    <div className="register-page" ref={vantaRef}>
      <div className="register-container">
        <div className="register-card">
          <StepDots step={step} />

          {/* ── Step 1: Choose type ── */}
          {step === 1 && (
            <>
              <div className="step-header">
                <h2>إنشاء حساب جديد</h2>
                <p>اختر نوع الحساب للمتابعة</p>
              </div>

              <span className="type-label">نوع المستخدم</span>
              <div className="type-grid">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                  <button
                    key={type}
                    className={`type-btn ${selectedType === type ? "active" : ""}`}
                    onClick={() => handleTypeSelect(type)}
                  >
                    <span className="type-icon">{cfg.icon}</span>
                    {type}
                  </button>
                ))}
              </div>

              <button className="register-btn" onClick={handleNext}>
                التالي ←
              </button>

              <div className="login-redirect">
                <p>
                  لديك حساب بالفعل؟{" "}
                  <button
                    type="button"
                    className="back-link"
                    onClick={() => setBackToLogin(true)}
                  >
                    تسجيل الدخول
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ── Step 2: Fill form ── */}
          {step === 2 && config && (
            <>
              <div className="step-header">
                <h2>{config.title}</h2>
                <p>{config.sub}</p>
              </div>

              <form className="reg-form" onSubmit={handleSubmit}>
                <div className="fields-scroll">
                  <FieldsSection
                    sections={config.fields}
                    formData={formData}
                    onChange={handleFieldChange}
                  />
                </div>

                <button type="submit" className="register-btn">
                  تسجيل الحساب ←
                </button>
              </form>

              <div className="back-section">
                <button className="back-link" onClick={handleBackToType}>
                  → العودة لاختيار نوع الحساب
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>تم التسجيل بنجاح!</h2>
              <p>
                تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.
                <br />
                سيتم مراجعة بياناتك خلال 24 ساعة.
              </p>

              <button
                type="button"
                className="register-btn"
                onClick={() => setBackToLogin(true)}
              >
                الذهاب لتسجيل الدخول
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
