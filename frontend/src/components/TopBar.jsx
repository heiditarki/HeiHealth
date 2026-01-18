import React from 'react'
import OrganizationLogo from './OrganizationLogo'

const TopBar = ({ patient, patientId, availablePatients, patientsLoaded, onPatientChange, launchContext, onLogout }) => {
  const patientName = patient?.name?.[0]
    ? `${patient.name[0].given?.join(' ') || ''} ${patient.name[0].family || ''}`.trim()
    : 'Patient'


  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo">HeiHealth</div>
        {launchContext && (
          <div className="launch-info">
            <OrganizationLogo org={launchContext.organization} />
          </div>
        )}
      </div>
      <div className="topbar-right">
        {!patientsLoaded ? (
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Loading patients...</div>
        ) : availablePatients && Array.isArray(availablePatients) && availablePatients.length > 0 ? (
          <div className="patient-selector">
            <label htmlFor="patient-select" style={{ marginRight: '8px', fontSize: '14px', color: '#6b7280' }}>
              Patient:
            </label>
            <select
              id="patient-select"
              value={patientId || ''}
              onChange={(e) => onPatientChange(e.target.value)}
              className="patient-select"
            >
              {availablePatients.map((patient) => {
                // Handle both old format (string) and new format (object)
                const id = typeof patient === 'string' ? patient : patient.id
                const name = typeof patient === 'object' && patient.name ? patient.name : null
                const identifier = typeof patient === 'object' && patient.identifier ? patient.identifier : id
                
                // Display: "Name (henkilötunnus)" or just "henkilötunnus" if no name
                const displayText = name 
                  ? `${name} (${identifier})`
                  : identifier
                
                return (
                  <option key={id} value={id}>
                    {displayText}
                  </option>
                )
              })}
            </select>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>No patients available</div>
        )}
        <button 
          className="logout-button" 
          onClick={(e) => {
            e.preventDefault()
            onLogout()
          }} 
          title="Log out"
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default TopBar
