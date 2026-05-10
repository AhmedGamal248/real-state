import React from 'react'
import FinanceMap from '../FinanceMap/FinanceMap.jsx'

export default function Map() {
  return (
    <div className="card dashboard-map-card">
              <div className="map-header">
                <div>
                  <span className="section-chip">خريطة تفاعلية</span>
                  <div className="card-title">مواقع الوحدات</div>
                  <p className="map-subtitle">
                    فلترة أسرع مع عرض مباشر للنتائج داخل اللوحة.
                  </p>
                </div>
                <span className="map-link">تحديث مباشر</span>
              </div>
    
              <div className="map-shell">
                <FinanceMap />
              </div>
            </div>
  )
}
