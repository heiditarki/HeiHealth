import React, { useState, useEffect } from 'react'
import {
  getPatient,
  getConditions,
  getImmunizations,
  getProcedures,
  getCarePlans,
  getObservations,
  getAvailablePatients,
} from './services/api'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PatientInfo from './components/PatientInfo'
import Conditions from './components/Conditions'
import Immunizations from './components/Immunizations'
import Procedures from './components/Procedures'
import CarePlans from './components/CarePlans'
import Observations from './components/Observations'
import HealthMetricCard from './components/HealthMetricCard'

const App = () => {
  // SMART Launch context
  const [launchContext, setLaunchContext] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [patientId, setPatientId] = useState(null)
  const [availablePatients, setAvailablePatients] = useState([])
  const [patientsLoaded, setPatientsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Patient data
  const [patient, setPatient] = useState(null)
  const [conditions, setConditions] = useState(null)
  const [immunizations, setImmunizations] = useState(null)
  const [procedures, setProcedures] = useState(null)
  const [carePlans, setCarePlans] = useState(null)
  const [observations, setObservations] = useState(null)

  // Handle login with SMART launch context
  const handleLogin = (context) => {
    setLaunchContext(context)
    setPatientId(context.patientId)
    setIsLoggedIn(true)
  }

  // Handle logout
  const handleLogout = () => {
    // Clear all state immediately
    setIsLoggedIn(false)
    setLaunchContext(null)
    setPatientId(null)
    setPatient(null)
    setConditions(null)
    setImmunizations(null)
    setProcedures(null)
    setCarePlans(null)
    setObservations(null)
    setAvailablePatients([])
    setPatientsLoaded(false)
    setError(null)
    setLoading(false)
    setActiveTab('overview')
  }

  // Load available patients after login
  useEffect(() => {
    if (!isLoggedIn) return

    const loadAvailablePatients = async () => {
      try {
        const data = await getAvailablePatients()
        // Handle both old format (array of strings) and new format (array of objects)
        const patients = data.patients || []
        if (patients.length > 0 && typeof patients[0] === 'string') {
          // Old format: just IDs
          setAvailablePatients(patients)
        } else {
          // New format: objects with id, name, identifier
          setAvailablePatients(patients)
        }
        setPatientsLoaded(true)
      } catch (err) {
        console.error('Error loading available patients:', err)
        setAvailablePatients([])
        setPatientsLoaded(true)
      }
    }
    loadAvailablePatients()
  }, [isLoggedIn])

  useEffect(() => {
    const loadData = async () => {
      if (!patientId) return

      try {
        setLoading(true)
        setError(null)

        // Load all data in parallel
        const [
          patientData,
          conditionsData,
          immunizationsData,
          proceduresData,
          carePlansData,
          observationsData,
        ] = await Promise.all([
          getPatient(patientId),
          getConditions(patientId),
          getImmunizations(patientId),
          getProcedures(patientId),
          getCarePlans(patientId),
          getObservations(patientId),
        ])

        setPatient(patientData)
        setConditions(conditionsData)
        setImmunizations(immunizationsData)
        setProcedures(proceduresData)
        setCarePlans(carePlansData)
        setObservations(observationsData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load patient data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [patientId])

  // Extract key metrics from observations
  const getBloodPressure = () => {
    if (!observations?.entry) return null
    const bpObs = observations.entry.find(
      (e) => e.resource.code?.coding?.[0]?.code === '85354-9'
    )
    if (bpObs?.resource.component) {
      const systolic = bpObs.resource.component.find(
        (c) => c.code?.coding?.[0]?.code === '8480-6'
      )?.valueQuantity?.value
      const diastolic = bpObs.resource.component.find(
        (c) => c.code?.coding?.[0]?.code === '8462-4'
      )?.valueQuantity?.value
      return systolic && diastolic ? `${systolic}/${diastolic}` : null
    }
    return null
  }

  const getHeartRate = () => {
    if (!observations?.entry) return null
    const hrObs = observations.entry.find(
      (e) => e.resource.code?.coding?.[0]?.code === '8867-4'
    )
    return hrObs?.resource.valueQuantity?.value || null
  }

  const getBMI = () => {
    if (!observations?.entry) return null
    const bmiObs = observations.entry.find(
      (e) => e.resource.code?.coding?.[0]?.code === '39156-5'
    )
    return bmiObs?.resource.valueQuantity?.value || null
  }

  const getCholesterol = () => {
    if (!observations?.entry) return null
    const cholObs = observations.entry.find(
      (e) => e.resource.code?.coding?.[0]?.code === '2093-3'
    )
    return cholObs?.resource.valueQuantity?.value || null
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          <TopBar
            patient={patient}
            patientId={patientId}
            availablePatients={availablePatients}
            patientsLoaded={patientsLoaded}
            onPatientChange={setPatientId}
            launchContext={launchContext}
            onLogout={handleLogout}
          />
          <div className="content-area">
            <div className="loading">Loading patient data...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          <TopBar
            patient={patient}
            patientId={patientId}
            availablePatients={availablePatients}
            patientsLoaded={patientsLoaded}
            onPatientChange={setPatientId}
            launchContext={launchContext}
            onLogout={handleLogout}
          />
          <div className="content-area">
            <div className="error">
              <strong>Error:</strong> {error}
              <br />
              <br />
              Make sure the FastAPI backend is running on http://127.0.0.1:8000
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <TopBar
          patient={patient}
          patientId={patientId}
          availablePatients={availablePatients}
          patientsLoaded={patientsLoaded}
          onPatientChange={setPatientId}
          launchContext={launchContext}
          onLogout={handleLogout}
        />
        <div className="content-area">
          {activeTab === 'overview' && (
            <>
              <div className="page-header">
                <h1 className="page-title">Patient Summary</h1>
                {patient?.name?.[0] && (
                  <p className="page-subtitle">
                    {patient.name[0].given?.join(' ')} {patient.name[0].family}
                  </p>
                )}
              </div>

              {/* Patient Info Card */}
              <div className="dashboard-section">
                <PatientInfo patient={patient} />
              </div>

              {/* Key Metrics */}
              <div className="dashboard-section">
                <h2 className="section-title">Key Metrics</h2>
                <div className="metrics-grid">
                  {getBloodPressure() && (
                    <HealthMetricCard
                      title="Blood Pressure"
                      value={getBloodPressure()}
                      unit="mmHg"
                    />
                  )}
                  {getHeartRate() && (
                    <HealthMetricCard
                      title="Heart Rate"
                      value={getHeartRate()}
                      unit="bpm"
                    />
                  )}
                  {getBMI() && (
                    <HealthMetricCard
                      title="Body Mass Index"
                      value={getBMI()}
                      unit="kg/m²"
                    />
                  )}
                  {getCholesterol() && (
                    <HealthMetricCard
                      title="Cholesterol"
                      value={getCholesterol()}
                      unit="mmol/L"
                    />
                  )}
                </div>
              </div>

              {/* Active Conditions */}
              {conditions && conditions.entry && conditions.entry.length > 0 && (
                <div className="dashboard-section">
                  <h2 className="section-title">Active Conditions</h2>
                  {conditions.entry.filter((entry) => {
                    const status = entry.resource.clinicalStatus?.coding?.[0]?.code
                    return status === 'active'
                  }).length > 0 ? (
                    <div className="conditions-summary">
                      {conditions.entry
                        .filter((entry) => {
                          const status = entry.resource.clinicalStatus?.coding?.[0]?.code
                          return status === 'active'
                        })
                        .slice(0, 3)
                        .map((entry, index) => {
                          const condition = entry.resource
                          const conditionName =
                            condition.code?.text || condition.code?.coding?.[0]?.display || 'Unknown'
                          return (
                            <div key={condition.id || index} className="condition-summary-item">
                              <span className="condition-name">{conditionName}</span>
                              <span className="badge badge-active">Active</span>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="empty-state">No active conditions</div>
                  )}
                </div>
              )}

              {/* Recent Observations */}
              {observations && observations.entry && observations.entry.length > 0 && (
                <div className="dashboard-section">
                  <h2 className="section-title">Recent Vital Signs</h2>
                  <Observations observations={observations} />
                </div>
              )}
            </>
          )}

          {activeTab === 'details' && (
            <>
              <div className="page-header">
                <h1 className="page-title">Patient Details</h1>
              </div>

              <div className="dashboard-section conditions-section">
                <h2 className="section-title">Conditions</h2>
                <Conditions conditions={conditions} />
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">Immunizations</h2>
                <Immunizations immunizations={immunizations} />
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">Procedures</h2>
                <Procedures procedures={procedures} />
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">Care Plans</h2>
                <CarePlans carePlans={carePlans} />
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">All Observations</h2>
                <Observations observations={observations} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
