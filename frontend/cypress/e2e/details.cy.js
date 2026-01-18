describe('Details Page', () => {
  beforeEach(() => {
    // Set up intercepts for all FHIR endpoints
    cy.intercept('GET', '**/fhir/**', { fixture: 'patient.json' }).as('fhirCalls')
    
    // Login
    cy.login('eps-001', 'OYS')
    
    // Wait for API calls and navigate to Details tab
    cy.wait('@fhirCalls', { timeout: 10000 })
    cy.get('.sidebar-item').eq(1).click()
    cy.wait(500) // Small wait for navigation
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
