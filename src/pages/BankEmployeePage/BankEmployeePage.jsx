import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./BankEmployeePage.module.css";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

const STATUS_LABELS = {
  review: "قيد الدراسة والمراجعة",
  new: "طلب جديد",
  visit: "بانتظار المعاينة",
};

const MONTHS = [
  { value: "2026-10", label: "أكتوبر 2026 (الأحدث)" },
  { value: "2026-09", label: "سبتمبر 2026" },
];

const BRANCHES = [
  { value: "cairo", label: "فرع القاهرة الرئيسي" },
  { value: "giza", label: "فرع الجيزة" },
  { value: "alex", label: "فرع الإسكندرية" },
];

const DOC_LABELS = [
  "شهادة مفردات مرتب معتمدة",
  "كشف حساب بنكي (آخر 6 أشهر)",
  "صورة بطاقة الهوية / الرقم القومي",
];

const REQUESTS = [
  {
    id: 1,
    unitCode: "246",
    clientCode: "861",
    date: "2026-10-22",
    status: "review",
    branch: "cairo",
    applicant: {
      name: "عبدالرحمن خالد منصور",
      phone: "+20 100 123 4567",
      email: "abdelrahman.mansour@bank-mail.com",
      nationalId: "28905150101234",
    },
    docs: [true, true, true],
    unit: {
      district: "246 - حي الياسمين (التجمع الخامس)",
      spec: "شقة سكنية دوبلكس (195 م²) - 4 غرف + ريسيبشن",
      deed: "عقد مسجل برقم: 4521 لسنة 2022",
      value: "4,250,000 ج.م",
      lat: 30.0074,
      lng: 31.4913,
    },
  },
  {
    id: 2,
    unitCode: "362",
    clientCode: "618",
    date: "2026-10-22",
    status: "new",
    branch: "giza",
    applicant: {
      name: "سارة أحمد الشافعي",
      phone: "+20 111 842 1190",
      email: "sara.elshafey@bank-mail.com",
      nationalId: "29208222101526",
    },
    docs: [true, true, false],
    unit: {
      district: "362 - الحي الثاني (الشيخ زايد)",
      spec: "فيلا مستقلة (320 م²) - 5 غرف + ريسيبشن",
      deed: "عقد مسجل برقم: 1873 لسنة 2021",
      value: "9,800,000 ج.م",
      lat: 30.0444,
      lng: 30.976,
    },
  },
  {
    id: 3,
    unitCode: "452",
    clientCode: "186",
    date: "2026-10-21",
    status: "new",
    branch: "cairo",
    applicant: {
      name: "محمد سعيد الجمل",
      phone: "+20 122 331 7742",
      email: "mohamed.elgamal@bank-mail.com",
      nationalId: "29512300102173",
    },
    docs: [true, true, true],
    unit: {
      district: "452 - الحي السابع (مدينة نصر)",
      spec: "شقة سكنية (150 م²) - 3 غرف + ريسيبشن",
      deed: "عقد مسجل برقم: 6094 لسنة 2020",
      value: "3,100,000 ج.م",
      lat: 30.0561,
      lng: 31.33,
    },
  },
  {
    id: 4,
    unitCode: "674",
    clientCode: "234",
    date: "2026-10-20",
    status: "new",
    branch: "cairo",
    applicant: {
      name: "نورا عبدالعزيز الحسيني",
      phone: "+20 155 678 2203",
      email: "noura.elhosseiny@bank-mail.com",
      nationalId: "29907120100846",
    },
    docs: [true, false, false],
    unit: {
      district: "674 - حي دجلة (المعادي)",
      spec: "دوبلكس (230 م²) - 4 غرف + ريسيبشن",
      deed: "عقد مسجل برقم: 3350 لسنة 2023",
      value: "6,500,000 ج.م",
      lat: 29.9602,
      lng: 31.2569,
    },
  },
  {
    id: 5,
    unitCode: "321",
    clientCode: "432",
    date: "2026-10-19",
    status: "visit",
    branch: "alex",
    applicant: {
      name: "كريم ناصر عبدالله",
      phone: "+20 109 910 4457",
      email: "karim.abdallah@bank-mail.com",
      nationalId: "29103180201457",
    },
    docs: [true, true, true],
    unit: {
      district: "321 - الحي الخامس (6 أكتوبر)",
      spec: "شقة سكنية (120 م²) - 2 غرفة + ريسيبشن",
      deed: "عقد مسجل برقم: 2208 لسنة 2022",
      value: "2,400,000 ج.م",
      lat: 29.9285,
      lng: 30.9188,
    },
  },
];

const STATS = [
  { key: "new", label: "الطلبات الجديدة", value: 3, tone: "blue" },
  { key: "visit", label: "بانتظار المعاينة", value: 1, tone: "orange" },
  { key: "approved", label: "معتمدة هذا الشهر", value: 18, tone: "green" },
];

const DEFAULT_FILTERS = {
  query: "",
  status: "all",
  month: "all",
  branch: "all",
};
const INITIAL_FORM = {
  query: "246",
  status: "review",
  month: "2026-10",
  branch: "cairo",
};
const DEFAULT_DRAFT = {
  decision: "approve",
  note: "",
  visitDate: "2026-10-25",
};

const formatDate = (iso) => iso.split("-").reverse().join("-");

/* ------------------------------------------------------------------ */
/* Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const ICON_PATHS = {
  sliders: (
    <>
      <path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  filter: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v4h4M10 12h6M10 16h6" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h10v17M15 9h4v12M9 8h2M9 12h2M9 16h2M3 21h18" />
    </>
  ),
  bank: <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  pin: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  shrink: <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  save: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 3v6h7V3M8 21v-7h8v7" />
    </>
  ),
};

function Icon({ name, size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Leaflet map                                                        */
/* ------------------------------------------------------------------ */

const buildPinIcon = (code) =>
  L.divIcon({
    className: "",
    iconSize: [130, 64],
    iconAnchor: [65, 16],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;direction:rtl;font-family:inherit">
        <div style="width:32px;height:32px;border-radius:50%;background:#dc2626;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <span style="background:#1e293b;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;white-space:nowrap">موقع الوحدة #${code}</span>
      </div>`,
  });

function UnitMap({ lat, lng, code }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // create the map once
  useEffect(() => {
    const map = L.map(elRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // move the marker whenever the selected unit changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lng], map.getZoom());
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lng], {
      icon: buildPinIcon(code),
      interactive: false,
      keyboard: false,
    }).addTo(map);
  }, [lat, lng, code]);

  // resize the map after expand / collapse
  useEffect(() => {
    mapRef.current?.invalidateSize();
    mapRef.current?.setView([lat, lng], mapRef.current.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${lat}, ${lng}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={styles.mapWrap}>
      <div className={styles.mapHead}>
        <span className={styles.mapTitle}>📍 خريطة موقع الوحدة في الجهة</span>
        <button type="button" className={styles.gpsLink} onClick={copyCoords}>
          {copied ? "تم نسخ الإحداثيات" : "إحداثيات GPS متوفرة"}
        </button>
      </div>
      <div className={`${styles.map} ${expanded ? styles.mapExpanded : ""}`}>
        <div ref={elRef} className={styles.mapEl} />
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={() => setExpanded((v) => !v)}
        >
          <Icon name={expanded ? "shrink" : "expand"} size={12} />
          {expanded ? "تصغير الخريطة" : "تكبير الخريطة"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function BankEmployeePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const [activeId, setActiveId] = useState(1);
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(REQUESTS.map((r) => [r.id, [...r.docs]])),
  );
  const [drafts, setDrafts] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const statusCounts = useMemo(() => {
    const counts = {};
    REQUESTS.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(
    () =>
      REQUESTS.filter((r) => {
        const q = applied.query.trim();
        if (
          q &&
          ![String(r.id), r.unitCode, r.clientCode].some((v) => v.includes(q))
        )
          return false;
        if (applied.status !== "all" && r.status !== applied.status)
          return false;
        if (applied.month !== "all" && !r.date.startsWith(applied.month))
          return false;
        if (applied.branch !== "all" && r.branch !== applied.branch)
          return false;
        return true;
      }),
    [applied],
  );

  const active = filtered.find((r) => r.id === activeId) ?? filtered[0] ?? null;
  const draft = active
    ? { ...DEFAULT_DRAFT, ...drafts[active.id] }
    : DEFAULT_DRAFT;
  const docChecks = active ? checks[active.id] : [];
  const doneCount = docChecks.filter(Boolean).length;
  const allDone = active && doneCount === DOC_LABELS.length;

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const applyFilters = () => setApplied({ ...form });
  const resetFilters = () => {
    setForm({ ...DEFAULT_FILTERS });
    setApplied(DEFAULT_FILTERS);
  };

  const updateDraft = (patch) =>
    setDrafts((d) => ({
      ...d,
      [active.id]: { ...DEFAULT_DRAFT, ...d[active.id], ...patch },
    }));

  const toggleDoc = (index) =>
    setChecks((c) => ({
      ...c,
      [active.id]: c[active.id].map((v, i) => (i === index ? !v : v)),
    }));

  const confirmVisit = () => {
    if (!draft.visitDate)
      return showToast("اختر تاريخ المعاينة أولاً", "error");
    showToast(`تم تثبيت موعد المعاينة بتاريخ ${formatDate(draft.visitDate)}`);
  };

  const saveDecision = () => {
    if (draft.decision === "reject" && !draft.note.trim()) {
      return showToast("اكتب سبب الرفض قبل حفظ القرار", "error");
    }
    showToast(
      draft.decision === "approve"
        ? "تم حفظ قرار الموافقة وإرسال الإشعار للعميل"
        : "تم حفظ قرار الرفض وإرسال الإشعار للعميل",
    );
  };

  const onRowKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveId(id);
    }
  };

  return (
    <div className={styles.page} dir="rtl">
      <Navbar />
      {/* ---------------- Search & filter ---------------- */}
      <section
        className={`${styles.card} ${styles.filterBar}`}
        aria-label="البحث والتصفية"
      >
        <div className={styles.filterTitle}>
          <span className={styles.filterIcon}>
            <Icon name="sliders" size={16} />
          </span>
          <div></div>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            رقم الطلب / كود الوحدة / كود العميل
          </span>
          <span className={styles.searchWrap}>
            <input
              className={styles.control}
              value={form.query}
              onChange={setField("query")}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              inputMode="numeric"
            />
            <span className={styles.searchIcon}>
              <Icon name="search" size={13} />
            </span>
          </span>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>حالة الطلب</span>
          <select
            className={styles.control}
            value={form.status}
            onChange={setField("status")}
          >
            <option value="all">كل الحالات</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label} ({statusCounts[value] || 0})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>تاريخ الاستقبال</span>
          <select
            className={styles.control}
            value={form.month}
            onChange={setField("month")}
          >
            <option value="all">كل الشهور</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>الجهة / الفرع التابع</span>
          <select
            className={styles.control}
            value={form.branch}
            onChange={setField("branch")}
          >
            <option value="all">كل الفروع</option>
            {BRANCHES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.filterActions}>
          <button
            type="button"
            className={styles.btnDark}
            onClick={applyFilters}
          >
            <Icon name="filter" size={13} />
            تطبيق
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={resetFilters}
          >
            إعادة تعيين
          </button>
        </div>
      </section>

      <div className={styles.layout}>
        {/* ---------------- Right column: list + stats ---------------- */}
        <aside className={styles.sideCol}>
          <section
            className={`${styles.card} ${styles.listCard}`}
            aria-label="قائمة طلبات التمويل"
          >
            <div className={styles.listHead}>
              <h2 className={styles.listTitle}>قائمة طلبات التمويل </h2>
              <span className={styles.countBadge}>
                {filtered.length} طلبات مسجلة
              </span>
            </div>

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>كود الوحدة</th>
                    <th>كود مقدم الطلب</th>
                    <th>تاريخ الاستقبال</th>
                    <th>الإجراء والتفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const isActive = active && r.id === active.id;
                    return (
                      <tr
                        key={r.id}
                        className={`${styles.row} ${isActive ? styles.rowActive : ""}`}
                        onClick={() => setActiveId(r.id)}
                        onKeyDown={(e) => onRowKey(e, r.id)}
                        tabIndex={0}
                        aria-selected={isActive}
                      >
                        <td>
                          <span
                            className={`${styles.indexBadge} ${isActive ? styles.indexBadgeActive : ""}`}
                          >
                            {r.id}
                          </span>
                        </td>
                        <td>{r.unitCode}</td>
                        <td>{r.clientCode}</td>
                        <td className={styles.dateCell}>
                          {formatDate(r.date)}
                        </td>
                        <td>
                          {isActive ? (
                            <span className={styles.viewBtn}>
                              <Icon name="eye" size={12} />
                              عرض
                            </span>
                          ) : (
                            <span className={styles.openBtn}>
                              فتح
                              <Icon name="chevron" size={11} />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className={styles.empty}>
                  لا توجد طلبات مطابقة. غيّر معايير البحث أو اضغط «إعادة تعيين».
                </p>
              )}
            </div>

            <div className={styles.listFoot}>
              {active && (
                <span className={styles.activeBadge}>
                  الطلب النشط حالياً: #{active.id}
                </span>
              )}
            </div>
          </section>

          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.key} className={`${styles.card} ${styles.stat}`}>
                <div className={styles.statLabel}>{s.label}</div>
                <div
                  className={`${styles.statValue} ${styles[`tone_${s.tone}`]}`}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------------- Left column: details ---------------- */}
        <main className={`${styles.card} ${styles.details}`}>
          {!active ? (
            <p className={styles.empty}>اختر طلباً من القائمة لعرض تفاصيله.</p>
          ) : (
            <>
              <h2 className={styles.detailsTitle}>
                <span aria-hidden="true">📋</span> تفاصيل ملف التمويل: طلب رقم #
                {active.id}
              </h2>

              <div className={styles.twoCols}>
                {/* Applicant */}
                <section className={styles.panel}>
                  <header className={styles.panelHead}>
                    <div className={styles.panelTitle}>
                      <span
                        className={`${styles.panelIcon} ${styles.iconPurple}`}
                      >
                        <Icon name="user" size={15} />
                      </span>
                      بيانات مقدم الطلب
                    </div>
                    <span className={styles.codeBadge}>
                      كود : {active.clientCode}
                    </span>
                  </header>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>اسم مقدم الطلب:</span>
                    <span className={styles.infoValue}>
                      {active.applicant.name}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>رقم التليفون:</span>
                    <span className={`${styles.infoValue} ${styles.ltr}`}>
                      {active.applicant.phone}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>البريد الإلكتروني:</span>
                    <span
                      className={`${styles.infoValue} ${styles.ltr} ${styles.breakAll}`}
                    >
                      {active.applicant.email}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      الرقم القومي / الهوية:
                    </span>
                    <span className={`${styles.infoValue} ${styles.ltr}`}>
                      {active.applicant.nationalId}
                    </span>
                  </div>
                </section>

                {/* Checklist */}
                <section className={styles.panel}>
                  <header className={styles.panelHead}>
                    <div className={styles.panelTitle}>
                      <span
                        className={`${styles.panelIcon} ${styles.iconAmber}`}
                      >
                        <Icon name="doc" size={15} />
                      </span>
                      المستندات المطلوبة{" "}
                      <span className={styles.en}>(Checklist)</span>
                    </div>
                    <span
                      className={`${styles.pill} ${allDone ? styles.pillGreen : styles.pillOrange}`}
                    >
                      {allDone ? "مكتملة" : "غير مكتملة"} ({doneCount}/
                      {DOC_LABELS.length})
                    </span>
                  </header>

                  {DOC_LABELS.map((label, i) => (
                    <div key={label} className={styles.docItem}>
                      <span className={styles.docLabel}>
                        {i + 1}. {label}
                      </span>
                      <button
                        type="button"
                        className={styles.previewBtn}
                        onClick={() => showToast(`جارٍ فتح معاينة: ${label}`)}
                      >
                        معاينة
                        <Icon name="eye" size={11} />
                      </button>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={docChecks[i]}
                        onChange={() => toggleDoc(i)}
                        aria-label={`تم التحقق من: ${label}`}
                      />
                    </div>
                  ))}

                  <footer className={styles.panelFoot}>
                    <button
                      type="button"
                      className={styles.zipBtn}
                      onClick={() =>
                        showToast("جارٍ تجهيز ملف الضغط (ZIP) للمرفقات")
                      }
                    >
                      <Icon name="download" size={12} />
                      تحميل كافة المرفقات (ZIP)
                    </button>
                  </footer>
                </section>
              </div>

              {/* Unit */}
              <section className={`${styles.panel} ${styles.unitPanel}`}>
                <header className={styles.panelHead}>
                  <div className={styles.panelTitle}>
                    <span className={`${styles.panelIcon} ${styles.iconBlue}`}>
                      <Icon name="building" size={15} />
                    </span>
                    بيانات الوحدة المطلوبة للتمويل وموقعها الميداني
                  </div>
                  <span className={styles.codeBadge}>
                    كود الوحدة : {active.unitCode}
                  </span>
                </header>

                <div className={styles.twoCols}>
                  <div className={styles.unitFields}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        كود الوحدة والحي:
                      </span>
                      <span className={styles.infoValue}>
                        {active.unit.district}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        مواصفات وتقسيم الوحدة:
                      </span>
                      <span className={styles.infoValue}>
                        {active.unit.spec}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        سجل الشهر العقاري / العقد:
                      </span>
                      <span className={styles.infoValue}>
                        {active.unit.deed}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>
                        القيمة التقديرية للوحدة:
                      </span>
                      <span className={`${styles.infoValue} ${styles.price}`}>
                        {active.unit.value}
                      </span>
                    </div>
                  </div>

                  <UnitMap
                    lat={active.unit.lat}
                    lng={active.unit.lng}
                    code={active.unitCode}
                  />
                </div>
              </section>

              {/* Bank decision */}
              <section className={styles.decision}>
                <header className={styles.decisionHead}>
                  <div className={styles.panelTitle}>
                    <span className={`${styles.panelIcon} ${styles.iconNavy}`}>
                      <Icon name="bank" size={15} />
                    </span>
                    <div>
                      <div className={styles.decisionTitle}>
                        قرار ورد البنك{" "}
                      </div>
                    </div>
                  </div>
                  <span className={styles.officer}>
                    المسؤول: أحمد محمود السعيد
                  </span>
                </header>

                <div className={styles.options}>
                  <label
                    className={`${styles.option} ${draft.decision === "approve" ? styles.optionApprove : ""}`}
                  >
                    <span className={styles.optionText}>
                      <span className={styles.optionTitle}>
                        موافقة مبدئية معتمدة{" "}
                        <span className={styles.recommended}>موصى به</span>
                      </span>
                      <span className={styles.optionSub}>
                        الملف مستوفي لكافة الشروط والمستندات الائتمانية
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="decision"
                      className={styles.radio}
                      checked={draft.decision === "approve"}
                      onChange={() => updateDraft({ decision: "approve" })}
                    />
                  </label>

                  <label
                    className={`${styles.option} ${draft.decision === "reject" ? styles.optionReject : ""}`}
                  >
                    <span className={styles.optionText}>
                      <span className={styles.optionTitle}>
                        غير موافق (رفض الطلب)
                      </span>
                      <span className={styles.optionSub}>
                        عدم استيفاء الشروط الائتمانية أو نقص أوراق
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="decision"
                      className={styles.radio}
                      checked={draft.decision === "reject"}
                      onChange={() => updateDraft({ decision: "reject" })}
                    />
                  </label>
                </div>

                <div className={styles.twoCols}>
                  <label className={styles.formField}>
                    <span className={styles.formLabel}>
                      سبب الرفض أو ملاحظات الائتمان والشروط المسبقة:
                    </span>
                    <input
                      className={styles.control}
                      placeholder="اكتب سبب الرفض أو شروط التمويل الإضافية إن وجدت..."
                      value={draft.note}
                      onChange={(e) => updateDraft({ note: e.target.value })}
                    />
                  </label>

                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="visit-date">
                      تحديد موعد الزيارة والمعاينة الميدانية للعقار:
                    </label>
                    <div className={styles.visitRow}>
                      <input
                        id="visit-date"
                        type="date"
                        className={`${styles.control} ${styles.ltr}`}
                        value={draft.visitDate}
                        onChange={(e) =>
                          updateDraft({ visitDate: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className={styles.btnDark}
                        onClick={confirmVisit}
                      >
                        <Icon name="calendar" size={13} />
                        تثبيت الموعد
                      </button>
                    </div>
                  </div>
                </div>

                <p className={styles.notice}>
                  سيتم إرسال إشعار فوري للعميل عبر الرسائل النصية والبريد
                  الإلكتروني فور الاعتماد.
                </p>

                <div className={styles.decisionActions}>
                  <button
                    type="button"
                    className={styles.btnGreen}
                    onClick={saveDecision}
                  >
                    <Icon name="save" size={14} />
                    حفظ القرار وإرسال الإشعار للعميل
                  </button>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => showToast("تم حفظ القرار كمسودة")}
                  >
                    حفظ كمسودة
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className={`${styles.toast} ${toast.type === "error" ? styles.toastError : ""}`}
        >
          {toast.message}
        </div>
      )}
      <Footer />
    </div>
  );
}
