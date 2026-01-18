describe('Error Handling', () => {
  it('should display error message when backend is unavailable', () => {
    // Intercept and fail all API calls
    cy.intercept('GET', '**/fhir/**', { statusCode: 500, forceNetworkError: true }).as('failedCalls')
    cy.intercept('GET', '**/smart/**', { statusCode: 500, forceNetworkError: true }).as('failedSmart')
    
    cy.visit('/')
    
    // Wait a bit for the error to appear
    cy.wait(2000)
    
    // Check for error message
    cy.get('.error').should('be.visible')
    cy.get('.error').should('contain', 'Error')
  })

  it('should show loading state initially', () => {
    // Delay API responses
    cy.intercept('GET', '**/fhir/**', { delay: 1000, fixture: 'patient.json' }).as('delayedCalls')
    
    cy.visit('/')
    
    // Should show loading state
    cy.get('.loading').should('be.visible')
    cy.get('.loading').should('contain', 'Loading')
  })
})
