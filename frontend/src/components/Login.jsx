import React, { useState, useEffect } from 'react'
import { smartLaunch, getAvailablePatients } from '../services/api'
import './Login.css'

const Login = ({ onLogin }) => {
  const [patientId, setPatientId] = useState('eps-001')
  const [org, setOrg] = useState('OYS')
  const [availablePatients, setAvailablePatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingPatients, setLoadingPatients] = useState(true)

  // Load available patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAvailablePatients()
        const patients = data.patients || []
        setAvailablePatients(patients)
        if (patients.length > 0) {
          // Handle both old format (string) and new format (object)
          const firstPatient = typeof patients[0] === 'string' ? patients[0] : patients[0].id
          setPatientId(firstPatient)
        }
      } catch (err) {
        console.error('Error loading patients:', err)
      } finally {
        setLoadingPatients(false)
      }
    }
    loadPatients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Perform SMART launch
      const launchContext = await smartLaunch(patientId, org)
      
      // Call onLogin with the launch context
      onLogin(launchContext)
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to launch application')
    } finally {
      setLoading(false)
    }
  }

  const organizations = [
    { value: 'OYS', label: 'Oulun yliopistollinen sairaala (OYS)' },
    { value: 'HUS', label: 'Helsinki University Hospital (HUS)' },
    { value: 'TAYS', label: 'Tampere University Hospital (TAYS)' },
  ]

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">HeiHealth</h1>
          <p className="login-subtitle">SMART App Launch</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="patient">Patient ID</label>
            {loadingPatients ? (
              <div className="loading-text">Loading patients...</div>
            ) : (
              <select
                id="patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="form-input"
                required
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
            )}
          </div>

          <div className="form-group">
            <label htmlFor="org">Organization</label>
            <select
              id="org"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="form-input"
              required
            >
              {organizations.map((orgOption) => (
                <option key={orgOption.value} value={orgOption.value}>
                  {orgOption.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading || loadingPatients}
          >
            {loading ? 'Launching...' : 'Launch Application'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-info">
            This simulates a SMART App Launch from an EHR system.
            Select a patient and organization to access their health data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
