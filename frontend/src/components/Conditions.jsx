import React from 'react'

const Conditions = ({ conditions }) => {
  if (!conditions || !conditions.entry) {
    return <div className="loading">Loading conditions...</div>
  }

  if (conditions.entry.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Conditions</h2>
        <p>No conditions found.</p>
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

  const getStatus = (condition) => {
    const clinicalStatus = condition.clinicalStatus?.coding?.[0]?.code
    return clinicalStatus === 'active' ? 'active' : 'inactive'
  }

  return (
    <div className="conditions-grid">
      {conditions.entry.map((entry, index) => {
        const condition = entry.resource
        const status = getStatus(condition)
        const conditionName =
          condition.code?.text || condition.code?.coding?.[0]?.display || 'Unknown condition'
        const onsetDate = condition.onsetDateTime || condition.onsetPeriod?.start

        return (
          <div
            key={condition.id || index}
            className={`condition-item ${status}`}
          >
            <div className="item-title">{conditionName}</div>
            <div className="item-meta">
              <span>
                <span className={`badge badge-${status}`}>{status}</span>
              </span>
              {onsetDate && (
                <span>
                  <strong>Onset:</strong> {formatDate(onsetDate)}
                </span>
              )}
              {condition.recordedDate && (
                <span>
                  <strong>Recorded:</strong> {formatDate(condition.recordedDate)}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Conditions
