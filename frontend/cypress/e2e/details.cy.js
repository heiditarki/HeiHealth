describe('Details Page', () => {
  beforeEach(() => {
    const patientId = 'eps-001'
    
    // Set up intercepts BEFORE login (so they catch the API calls triggered by login)
    // Use function matchers to check both path and query parameter
    cy.intercept('GET', `**/fhir/Patient/${patientId}`, { fixture: 'patient.json' }).as('getPatient')
    
    cy.intercept({
      method: 'GET',
      url: (url) => url.includes('/fhir/Condition') && url.includes(`patient=${patientId}`)
    }, { fixture: 'conditions.json' }).as('getConditions')
    
    cy.intercept({
      method: 'GET',
      url: (url) => url.includes('/fhir/Observation') && url.includes(`patient=${patientId}`)
    }, { fixture: 'observations.json' }).as('getObservations')
    
    cy.intercept({
      method: 'GET',
      url: (url) => url.includes('/fhir/Immunization') && url.includes(`patient=${patientId}`)
    }, { fixture: 'immunizations.json' }).as('getImmunizations')
    
    cy.intercept({
      method: 'GET',
      url: (url) => url.includes('/fhir/Procedure') && url.includes(`patient=${patientId}`)
    }, { fixture: 'procedures.json' }).as('getProcedures')
    
    cy.intercept({
      method: 'GET',
      url: (url) => url.includes('/fhir/CarePlan') && url.includes(`patient=${patientId}`)
    }, { fixture: 'careplans.json' }).as('getCarePlans')
    
    // Login - this will trigger the API calls
    cy.login(patientId, 'OYS')
    
    // Wait for all API calls to complete (they happen after login when patientId is set)
    cy.wait(['@getPatient', '@getConditions', '@getObservations', '@getImmunizations', '@getProcedures', '@getCarePlans'], { timeout: 15000 })
    
    // Navigate to Details tab (second sidebar item)
    cy.get('.sidebar-item').eq(1).click()
  })

  it('should display all sections', () => {
    cy.get('.page-title').should('contain', 'Patient Details')
    
    cy.get('.section-title').should('contain', 'Conditions')
    cy.get('.section-title').should('contain', 'Immunizations')
    cy.get('.section-title').should('contain', 'Procedures')
    cy.get('.section-title').should('contain', 'Care Plans')
    cy.get('.section-title').should('contain', 'All Observations')
  })

  it('should display conditions', () => {
    cy.get('.section-title').contains('Conditions').should('be.visible')
    cy.get('.condition-item').should('have.length.at.least', 1)
  })

  it('should display immunizations', () => {
    cy.get('.section-title').contains('Immunizations').should('be.visible')
    cy.get('.immunization-item').should('have.length.at.least', 1)
  })

  it('should display procedures', () => {
    cy.get('.section-title').contains('Procedures').should('be.visible')
    cy.get('.procedure-item').should('have.length.at.least', 1)
  })

  it('should display care plans', () => {
    cy.get('.section-title').contains('Care Plans').should('be.visible')
    cy.get('.procedure-item').should('be.visible')
  })
})
