import React from 'react';
import { initialMortgageRequests } from './mockData.js';

const STATUS_CLASS = {
  "موافق عليه": "badge--approved",
  مرفوض: "badge--rejected",
  "قيد المراجعة": "badge--reviewing",
  معلق: "badge--pending",
};

const Badge = ({ label }) => {
  const mod = STATUS_CLASS[label] ?? "badge--default";
  return <span className={`badge ${mod}`}>{label}</span>;
};

export default function Mortgage({ mortgageRequests = initialMortgageRequests }) {
  const approved = mortgageRequests.filter(r => r.status === "موافق عليه").length;
  const reviewing = mortgageRequests.filter(r => r.status === "قيد المراجعة").length;
  const rejected = mortgageRequests.filter(r => r.status === "مرفوض").length;
  const totalAmount = mortgageRequests.reduce((sum, r) => sum + r.amount, 0);
  const totalLabel =
    totalAmount >= 1_000_000
      ? `${(totalAmount / 1_000_000).toFixed(1)}M`
      : totalAmount.toLocaleString('ar-EG');

  return (
    <div className="dashboard">
      {/* Summary cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">إجمالي الطلبات</div>
          <div className="stat-value">{mortgageRequests.length}</div>
          <span className="stat-badge stat-badge--up">كل الطلبات</span>
        </div>
        <div className="stat-card">
          <div className="stat-label">موافق عليها</div>
          <div className="stat-value">{approved}</div>
          <span className="stat-badge stat-badge--up">✓ مكتملة</span>
        </div>
        <div className="stat-card">
          <div className="stat-label">قيد المراجعة</div>
          <div className="stat-value">{reviewing}</div>
          <span className="stat-badge stat-badge--down">⏳ انتظار</span>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي التمويل</div>
          <div className="stat-value">{totalLabel} ج.م</div>
          <span className="stat-badge stat-badge--up">↑ هذا الشهر</span>
        </div>
      </div>

      {/* Requests table */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">جميع طلبات التمويل</div>
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
  );
}