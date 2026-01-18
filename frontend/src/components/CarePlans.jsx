import React from 'react'

const CarePlans = ({ carePlans }) => {
  if (!carePlans || !carePlans.entry) {
    return <div className="loading">Loading care plans...</div>
  }

  if (carePlans.entry.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Care Plans</h2>
        <p>No care plans found.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="card">
      <h2 className="card-title">Care Plans</h2>
      {carePlans.entry.map((entry, index) => {
        const carePlan = entry.resource
        const category = carePlan.category?.[0]?.coding?.[0]?.display || 'General Care'
        const createdDate = carePlan.created || carePlan.period?.start
        const activities = carePlan.activity || []

        return (
          <div key={carePlan.id || index} className="procedure-item">
            <div className="item-title">{category}</div>
            <div className="item-meta">
              {createdDate && (
                <span>
                  <strong>Created:</strong> {formatDate(createdDate)}
                </span>
              )}
              <span>
                <span className="badge badge-active">{carePlan.status || 'Active'}</span>
              </span>
            </div>
            {activities.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Activities:</strong>
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  {activities.map((activity, actIndex) => {
                    const detail = activity.detail
                    const activityName = detail?.code?.text || detail?.code?.coding?.[0]?.display || 'Activity'
                    const description = detail?.description
                    return (
                      <li key={actIndex} style={{ marginBottom: '0.5rem' }}>
                        <strong>{activityName}</strong>
                        {description && <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>{description}</div>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CarePlans
