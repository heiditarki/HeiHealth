import React from 'react'

const Observations = ({ observations }) => {
  if (!observations || !observations.entry) {
    return <div className="loading">Loading observations...</div>
  }

  if (observations.entry.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Vital Signs & Lab Results</h2>
        <p>No observations found.</p>
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

  const formatValue = (observation) => {
    if (observation.valueQuantity) {
      const value = observation.valueQuantity.value
      const unit = observation.valueQuantity.unit
      return { value, unit }
    }
    if (observation.component) {
      // Handle blood pressure with components
      const systolic = observation.component.find(
        (c) => c.code?.coding?.[0]?.code === '8480-6'
      )
      const diastolic = observation.component.find(
        (c) => c.code?.coding?.[0]?.code === '8462-4'
      )
      if (systolic && diastolic) {
        return {
          value: `${systolic.valueQuantity?.value}/${diastolic.valueQuantity?.value}`,
          unit: systolic.valueQuantity?.unit || 'mmHg',
        }
      }
    }
    return { value: 'N/A', unit: '' }
  }

  const getObservationName = (observation) => {
    return (
      observation.code?.text ||
      observation.code?.coding?.[0]?.display ||
      'Unknown observation'
    )
  }

  // Group observations by category
  const vitalSigns = observations.entry.filter(
    (entry) => entry.resource.category?.[0]?.coding?.[0]?.code === 'vital-signs'
  )
  const labResults = observations.entry.filter(
    (entry) => entry.resource.category?.[0]?.coding?.[0]?.code === 'laboratory'
  )

  return (
    <div>
      {vitalSigns.length > 0 && (
        <div className="card">
          <h2 className="card-title">Vital Signs</h2>
          <div className="observations-grid">
            {vitalSigns.map((entry, index) => {
              const observation = entry.resource
              const name = getObservationName(observation)
              const { value, unit } = formatValue(observation)
              const date = observation.effectiveDateTime

              return (
                <div key={observation.id || index} className="observation-card">
                  <div className="observation-label">{name}</div>
                  <div>
                    <span className="observation-value">{value}</span>
                    {unit && <span className="observation-unit">{unit}</span>}
                  </div>
                  {date && (
                    <div className="observation-date">{formatDate(date)}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {labResults.length > 0 && (
        <div className="card">
          <h2 className="card-title">Laboratory Results</h2>
          <div className="observations-grid">
            {labResults.map((entry, index) => {
              const observation = entry.resource
              const name = getObservationName(observation)
              const { value, unit } = formatValue(observation)
              const date = observation.effectiveDateTime
              const interpretation = observation.interpretation?.[0]?.coding?.[0]?.display

              return (
                <div key={observation.id || index} className="observation-card">
                  <div className="observation-label">{name}</div>
                  <div>
                    <span className="observation-value">{value}</span>
                    {unit && <span className="observation-unit">{unit}</span>}
                  </div>
                  {interpretation && (
                    <div className="observation-date">
                      <span className={`badge ${interpretation === 'High' ? 'badge-active' : ''}`}>
                        {interpretation}
                      </span>
                    </div>
                  )}
                  {date && (
                    <div className="observation-date">{formatDate(date)}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Observations
