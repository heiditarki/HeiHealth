describe('Overview Page', () => {
  beforeEach(() => {
    // Set up intercepts for all FHIR endpoints
    cy.intercept('GET', '**/fhir/**', { fixture: 'patient.json' }).as('fhirCalls')
    
    // Login
    cy.login('eps-001', 'OYS')
    
    // Wait for API calls to complete
    cy.wait('@fhirCalls', { timeout: 10000 })
    cy.wait(500) // Small wait for data to load
  })

  it('should display overview page', () => {
    cy.get('.page-title').should('be.visible')
  })
})
