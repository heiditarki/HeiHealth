import React from 'react'

const Immunizations = ({ immunizations }) => {
  if (!immunizations || !immunizations.entry) {
    return <div className="loading">Loading immunizations...</div>
  }

  if (immunizations.entry.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Immunizations</h2>
        <p>No immunizations found.</p>
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
      <h2 className="card-title">Immunizations</h2>
      {immunizations.entry.map((entry, index) => {
        const immunization = entry.resource
        const vaccineName =
          immunization.vaccineCode?.text ||
          immunization.vaccineCode?.coding?.[0]?.display ||
          'Unknown vaccine'
        const date = immunization.occurrenceDateTime
        const doseNumber = immunization.protocolApplied?.[0]?.doseNumber

        return (
          <div key={immunization.id || index} className="immunization-item">
            <div className="item-title">{vaccineName}</div>
            <div className="item-meta">
              <span>
                <strong>Date:</strong> {formatDate(date)}
              </span>
              {doseNumber && (
                <span>
                  <strong>Dose:</strong> {doseNumber}
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

export default Immunizations
