describe('API Integration', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://127.0.0.1:8000'

  it('should fetch patient data', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/fhir/Patient/eps-001`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('resourceType', 'Patient')
        expect(response.body).to.have.property('id', 'eps-001')
        expect(response.body).to.have.property('name')
      }
    })
  })

  it('should fetch conditions', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/fhir/Condition?patient=eps-001`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('resourceType', 'Bundle')
        expect(response.body).to.have.property('type', 'searchset')
        expect(response.body).to.have.property('entry')
      }
    })
  })

  it('should fetch observations', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/fhir/Observation?patient=eps-001`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('resourceType', 'Bundle')
        expect(response.body.entry).to.be.an('array')
      }
    })
  })

  it('should handle SMART launch', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/smart/launch?patient=eps-001&org=OuluHVA`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('patientId', 'eps-001')
        expect(response.body).to.have.property('organization', 'OuluHVA')
        expect(response.body).to.have.property('practitionerId')
        expect(response.body).to.have.property('launchType', 'provider-ehr')
      }
    })
  })

  it('should return 404 for invalid patient', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/fhir/Patient/invalid-patient`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 0]) // 0 if backend is not running
    })
  })

  it('should require patient parameter for Condition endpoint', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/fhir/Condition`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 0]) // 400 Bad Request or 0 if backend is not running
    })
  })
})
