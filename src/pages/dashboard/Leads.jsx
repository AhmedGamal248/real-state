import React from 'react'
import FinanceMap from "../FinanceMap/FinanceMap.jsx";


const Badge = ({ label }) => {
  const mod = STATUS_CLASS[label] ?? "badge--default";
  return <span className={`badge ${mod}`}>{label}</span>;
};


export default function Leads() {
  return ( 
  <div className="clients-card">
        <div className="card-title">أحدث العملاء</div>
        <div>
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`client-row${
                index < clients.length - 1 ? " client-row--bordered" : ""
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
  )
}
