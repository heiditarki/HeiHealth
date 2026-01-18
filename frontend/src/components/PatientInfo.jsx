import React from 'react'

const PatientInfo = ({ patient }) => {
  if (!patient) {
    return <div className="loading">Loading patient information...</div>
  }

  const name = patient.name?.[0]
  const fullName = name
    ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim()
    : 'Unknown'

  const birthDate = patient.birthDate
    ? new Date(patient.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  const gender = patient.gender || 'Unknown'
  const address = patient.address?.[0]
  const phone = patient.telecom?.find((t) => t.system === 'phone')?.value

  // Extract nationality from extension
  const nationalityExtension = patient.extension?.find(
    (ext) => ext.url === 'http://hl7.org/fhir/StructureDefinition/patient-nationality'
  )
  const nationalityCode = nationalityExtension?.valueCodeableConcept?.coding?.[0]?.code

  // Country code to name mapping
  const countryNames = {
    FI: 'Finland',
    NL: 'Netherlands',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    DE: 'Germany',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
    PL: 'Poland',
    GB: 'United Kingdom',
    US: 'United States',
    LT: 'Lithuania',
  }
  const nationality = nationalityCode ? (countryNames[nationalityCode] || nationalityCode) : null

  return (
    <div className="card patient-info-card">
      <h2 className="card-title">Patient Information</h2>
      <div className="patient-info">
        <div className="info-item">
          <span className="info-label">Date of Birth</span>
          <span className="info-value">{birthDate}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Gender</span>
          <span className="info-value">{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
        </div>
        {patient.identifier?.[0] && (
          <div className="info-item">
            <span className="info-label">Henkilötunnus</span>
            <span className="info-value">{patient.identifier[0].value}</span>
          </div>
        )}
        {nationality && (
          <div className="info-item">
            <span className="info-label">Nationality</span>
            <span className="info-value">{nationality}</span>
          </div>
        )}
        {address && (
          <div className="info-item">
            <span className="info-label">Address</span>
            <span className="info-value">
              {address.line?.join(', ')}
              {address.city && `, ${address.city}`}
              {address.postalCode && ` ${address.postalCode}`}
            </span>
          </div>
        )}
        {phone && (
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientInfo
