import React from 'react'

const HealthMetricCard = ({ title, value, unit }) => {
  return (
    <div className="health-metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
    </div>
  )
}

export default HealthMetricCard
