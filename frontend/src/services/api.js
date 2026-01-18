/**
 * API service for connecting to the FastAPI backend
 */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * SMART Launch - Get launch context
 */
export const smartLaunch = async (patientId, org) => {
  const response = await api.get('/smart/launch', {
    params: { patient: patientId, org },
  })
  return response.data
}

/**
 * FHIR API - Get Patient resource
 */
export const getPatient = async (patientId) => {
  const response = await api.get(`/fhir/Patient/${patientId}`)
  return response.data
}

/**
 * FHIR API - Get Conditions
 */
export const getConditions = async (patientId) => {
  const response = await api.get('/fhir/Condition', {
    params: { patient: patientId },
  })
  return response.data
}

/**
 * FHIR API - Get Immunizations
 */
export const getImmunizations = async (patientId) => {
  const response = await api.get('/fhir/Immunization', {
    params: { patient: patientId },
  })
  return response.data
}

/**
 * FHIR API - Get Procedures
 */
export const getProcedures = async (patientId) => {
  const response = await api.get('/fhir/Procedure', {
    params: { patient: patientId },
  })
  return response.data
}

/**
 * FHIR API - Get CarePlans
 */
export const getCarePlans = async (patientId) => {
  const response = await api.get('/fhir/CarePlan', {
    params: { patient: patientId },
  })
  return response.data
}

/**
 * FHIR API - Get Observations
 */
export const getObservations = async (patientId) => {
  const response = await api.get('/fhir/Observation', {
    params: { patient: patientId },
  })
  return response.data
}

/**
 * Get list of available patients
 */
export const getAvailablePatients = async () => {
  const response = await api.get('/patients')
  return response.data
}

export default api
