import React from 'react';
import { initialMortgageRequests } from './mockData.js';

const STATUS_CLASS = {
  متاح: 'badge--available',
  مباع: 'badge--sold',
  معلق: 'badge--pending',
  محجوز: 'badge--reserved',
  'موافق عليه': 'badge--approved',
  مرفوض: 'badge--rejected',
  'قيد المراجعة': 'badge--reviewing',
  'عميل نشط': 'badge--active',
  مكتمل: 'badge--completed',
  'في المفاوضات': 'badge--negotiating',
};

const MONTHS = ['نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل'];
const BARS = [45, 60, 38, 72, 55, 80];
const VALUES = ['4.5M', '6.1M', '3.8M', '7.2M', '5.5M', '8.1M'];

const MAP_DOTS = [
  { top: '30%', left: '15%', color: '#185FA5' },
  { top: '55%', left: '25%', color: '#639922' },
  { top: '20%', left: '65%', color: '#BA7517' },
  { top: '70%', left: '60%', color: '#185FA5' },
  { top: '45%', left: '75%', color: '#639922' },
];

const Badge = ({ label }) => {
  const mod = STATUS_CLASS[label] ?? 'badge--default';
  return <span className={`badge ${mod}`}>{label}</span>;
};

const StatCard = ({ label, value, badge, badgeType }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <span className={`stat-badge stat-badge--${badgeType}`}>{badge}</span>
  </div>
);


// export to CSV
function exportToCSV(data) {
  if (!data || !data.length) return;

  // headers
  const headers = Object.keys(data[0]);

  // convert rows
  const rows = data.map(row =>
    headers.map(field => {
      let value = row[field];

      // لو تاريخ نحوله string مفهوم
      if (value instanceof Date) {
        value = value.toLocaleDateString("ar-EG");
      }

      // نحول لأي string
      value = String(value ?? "");

      // نحط quotes عشان نحمي الكوما والعربي
      value = `"${value.replace(/"/g, '""')}"`;

      return value;
    }).join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  // BOM مهم عشان العربي يطلع صح في Excel
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mortgage_requests.csv";
  link.click();
}

export default function DashboardHome({
  units,
  mortgageRequests,
  clients,
  onAddUnit,
}) {
  const soldUnits = units.filter((unit) => unit.status === 'مباع');
  const activeRequests = mortgageRequests.filter(
    (request) => request.status === 'قيد المراجعة'
  ).length;
  const revenue = soldUnits.reduce((sum, unit) => sum + unit.price, 0);
  const revenueLabel =
    revenue >= 1_000_000
      ? `${(revenue / 1_000_000).toFixed(1)}M`
      : revenue.toLocaleString();

  return (
    <div className="dashboard">
      {/* <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="dashboard-eyebrow">نظرة عامة</p>
          <h1 className="dashboard-title">لوحة التحكم العقارية</h1>
          <p className="dashboard-subtitle">
            تابع الوحدات والمبيعات وطلبات التمويل من شاشة واحدة على أي جهاز.
          </p>
        </div>

        {onAddUnit && (
          <button
            type="button"
            className="primary-btn dashboard-hero-action"
            onClick={onAddUnit}
          >
            + إضافة وحدة
          </button>
        )}
      </section> */}

      <div className="stats-grid">
        <StatCard
          label="إجمالي الوحدات"
          value={units.length}
          badge="↑ 12 هذا الشهر"
          badgeType="up"
        />
        <StatCard
          label="وحدات مباعة"
          value={soldUnits.length}
          badge="↑ 8% من الشهر الماضي"
          badgeType="up"
        />
        <StatCard
          label="طلبات تمويل نشطة"
          value={activeRequests}
          badge="↓ 3 معلقة"
          badgeType="down"
        />
        <StatCard
          label="إجمالي المبيعات"
          value={`${revenueLabel} ج.م`}
          badge="↑ 18% هذا الربع"
          badgeType="up"
        />
      </div>

      <div className="dashboard-two-col">
        <div className="card">
          <div className="map-header">
            <span className="card-title">مواقع الوحدات</span>
            <span className="map-link">عرض الخريطة الكاملة ←</span>
          </div>

          <div className="map-placeholder">
            {MAP_DOTS.map((dot, index) => (
              <div
                key={index}
                className="map-dot"
                style={{ top: dot.top, left: dot.left, background: dot.color }}
              />
            ))}

            <div className="map-legend">
              {[
                { color: '#185FA5', label: 'متاح' },
                { color: '#639922', label: 'مباع' },
                { color: '#BA7517', label: 'معلق' },
              ].map(({ color, label }) => (
                <div key={label} className="map-legend-item">
                  <div
                    className="map-legend-dot"
                    style={{ background: color }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">مبيعات الأشهر الستة</div>
          <div className="sales-bars-list">
            {MONTHS.map((month, index) => (
              <div key={month} className="sales-bar-row">
                <div className="sales-bar-label">{month}</div>
                <div className="sales-bar-track">
                  <div
                    className="sales-bar-fill"
                    style={{ width: `${BARS[index]}%` }}
                  />
                </div>
                <div className="sales-bar-value">{VALUES[index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-two-col">
        
        <div className="card">
          
          
          <div className="card-title">أحدث الوحدات</div>
          
          <div className="list-rows">
            {[...units].reverse().slice(0, 4).map((unit) => (
              <div key={unit.id} className="unit-row">
                <div className="unit-row-main">
                  <div className="unit-row-name">{unit.name}</div>
                  <div className="unit-row-sub">
                    {unit.area} · {unit.size} م²
                  </div>
                </div>

                <div className="unit-row-right">
                  <div className="unit-row-price">
                    {(unit.price / 1_000_000).toFixed(2)}M ج.م
                  </div>
                  <Badge label={unit.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">طلبات التمويل الأخيرة</div>
          <div className="list-rows">
            {mortgageRequests.map((request) => (
              <div key={request.id} className="mortgage-row">
                <div className="mortgage-row-main">
                  <div className="mortgage-row-ref">#{request.refNumber}</div>
                  <div className="mortgage-row-name">{request.clientName}</div>
                </div>

                <div className="mortgage-row-right">
                  <div className="mortgage-row-amount">
                    {(request.amount / 1000).toFixed(0)}K ج.م
                  </div>
                  <Badge label={request.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="clients-card">
        <div className="card-title">أحدث العملاء</div>
        <div>
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`client-row${
                index < clients.length - 1 ? ' client-row--bordered' : ''
              }`}
            >
              <div className="client-avatar">{client.name.slice(0, 2)}</div>
              <div className="client-info">
                <div className="client-name">{client.name}</div>
                <div className="client-interest">{client.interest}</div>
              </div>
              <div className="client-status">
                <Badge label={client.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='export-data'>
          <button onClick={() => exportToCSV(initialMortgageRequests)} className='export-data-btn' >Export CSV</button>
      </div>
    </div>
  );
}
