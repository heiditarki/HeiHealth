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

  it('should display patient details page', () => {
    cy.get('.page-title').should('be.visible')
  })
})
