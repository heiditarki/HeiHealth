describe('Overview Page', () => {
  beforeEach(() => {
    // Set up intercepts BEFORE login (so they catch the API calls triggered by login)
    cy.intercept('GET', '**/fhir/Patient/eps-001', { fixture: 'patient.json' }).as('getPatient')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/Condition') && req.url.includes('patient=eps-001')
    }, { fixture: 'conditions.json' }).as('getConditions')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/Observation') && req.url.includes('patient=eps-001')
    }, { fixture: 'observations.json' }).as('getObservations')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/Immunization') && req.url.includes('patient=eps-001')
    }, { fixture: 'immunizations.json' }).as('getImmunizations')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/Procedure') && req.url.includes('patient=eps-001')
    }, { fixture: 'procedures.json' }).as('getProcedures')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/CarePlan') && req.url.includes('patient=eps-001')
    }, { fixture: 'careplans.json' }).as('getCarePlans')
    
    // Login - this will trigger the API calls
    cy.login('eps-001', 'OYS')
    
    // Wait for all API calls to complete
    cy.wait(['@getPatient', '@getConditions', '@getObservations', '@getImmunizations', '@getProcedures', '@getCarePlans'], { timeout: 15000 })
  })

  it('should display the page title and patient name', () => {
    cy.get('.page-title').should('contain', 'Patient Summary')
    cy.get('.page-subtitle').should('be.visible')
  })

  it('should display patient information card', () => {
    cy.get('.patient-info-card').should('be.visible')
    cy.get('.card-title').should('contain', 'Patient Information')
    
    // Check patient info fields
    cy.get('.info-label').should('contain', 'Date of Birth')
    cy.get('.info-label').should('contain', 'Gender')
  })

  it('should display key metrics cards', () => {
    cy.get('.section-title').contains('Key Metrics').should('be.visible')
    cy.get('.health-metric-card').should('have.length.at.least', 1)
    
    // Check for specific metrics
    cy.get('.health-metric-card').should('contain', 'Blood Pressure')
    cy.get('.health-metric-card').should('contain', 'Heart Rate')
  })

  it('should display active conditions summary', () => {
    cy.get('.section-title').contains('Active Conditions').should('be.visible')
    cy.get('.conditions-summary').should('be.visible')
    cy.get('.condition-summary-item').should('have.length.at.least', 1)
    cy.get('.badge-active').should('be.visible')
  })

  it('should display recent vital signs', () => {
    cy.get('.section-title').contains('Recent Vital Signs').should('be.visible')
    cy.get('.observations-grid').should('be.visible')
    cy.get('.observation-card').should('have.length.at.least', 1)
  })

  it('should display metric values correctly', () => {
    cy.get('.metric-value').should('be.visible')
    cy.get('.metric-unit').should('be.visible')
  })

  it('should display patient nationality', () => {
    cy.get('.patient-info-card').should('be.visible')
    cy.get('.info-label').contains('Nationality').should('be.visible')
  })

  it('should display logout button', () => {
    cy.get('.logout-button').should('be.visible')
    cy.get('.logout-button').should('contain', 'Log out')
  })
})
