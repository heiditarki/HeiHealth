describe('Details Page', () => {
  beforeEach(() => {
    // Login first
    cy.login('eps-001', 'OYS')
    
    // Intercept API calls
    cy.intercept('GET', '**/fhir/Patient/eps-001', { fixture: 'patient.json' }).as('getPatient')
    cy.intercept('GET', '**/fhir/Condition?patient=eps-001', { fixture: 'conditions.json' }).as('getConditions')
    cy.intercept('GET', '**/fhir/Observation?patient=eps-001', { fixture: 'observations.json' }).as('getObservations')
    cy.intercept('GET', '**/fhir/Immunization?patient=eps-001', { fixture: 'immunizations.json' }).as('getImmunizations')
    cy.intercept('GET', '**/fhir/Procedure?patient=eps-001', { fixture: 'procedures.json' }).as('getProcedures')
    cy.intercept('GET', '**/fhir/CarePlan?patient=eps-001', { fixture: 'careplans.json' }).as('getCarePlans')

    cy.wait(['@getPatient', '@getConditions', '@getObservations', '@getImmunizations', '@getProcedures', '@getCarePlans'], { timeout: 10000 })
    
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
