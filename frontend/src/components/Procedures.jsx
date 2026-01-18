import React from 'react'

const Procedures = ({ procedures }) => {
  if (!procedures || !procedures.entry) {
    return <div className="loading">Loading procedures...</div>
  }

  if (procedures.entry.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Procedures</h2>
        <p>No procedures found.</p>
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
      <h2 className="card-title">Procedures</h2>
      {procedures.entry.map((entry, index) => {
        const procedure = entry.resource
        const procedureName =
          procedure.code?.text || procedure.code?.coding?.[0]?.display || 'Unknown procedure'
        const date = procedure.performedDateTime
        const reason = procedure.reasonCode?.[0]?.text || procedure.reasonCode?.[0]?.coding?.[0]?.display

        return (
          <div key={procedure.id || index} className="procedure-item">
            <div className="item-title">{procedureName}</div>
            <div className="item-meta">
              {date && (
                <span>
                  <strong>Date:</strong> {formatDate(date)}
                </span>
              )}
              {reason && (
                <span>
                  <strong>Reason:</strong> {reason}
                </span>
              )}
              <span>
                <span className="badge badge-active">Completed</span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Procedures
