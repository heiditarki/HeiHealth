describe('Navigation', () => {
  beforeEach(() => {
    // Intercept API calls BEFORE login
    cy.intercept('GET', '**/fhir/Patient/eps-001', { fixture: 'patient.json' }).as('getPatient')
    cy.intercept('GET', '**/fhir/**?patient=eps-001', { fixture: 'patient.json' }).as('getPatientData')
    
    // Login - this will trigger the API calls
    cy.login('eps-001', 'OYS')
    
    // Wait for API calls to complete
    cy.wait(['@getPatient', '@getPatientData'], { timeout: 15000 })
  })

  it('should have sidebar navigation', () => {
    cy.get('.sidebar').should('be.visible')
    cy.get('.sidebar-item').should('have.length.at.least', 2)
  })

  it('should navigate to Details tab', () => {
    // Click the Details tab (second item with 'D')
    cy.get('.sidebar-item').eq(1).click()
    cy.get('.page-title').should('contain', 'Patient Details')
  })

  it('should highlight active tab', () => {
    cy.get('.sidebar-item.active').should('exist')
    cy.get('.sidebar-item.active').should('have.class', 'active')
  })

  it('should display top bar with logo and patient selector', () => {
    cy.get('.topbar').should('be.visible')
    cy.get('.logo').should('contain', 'HeiHealth')
    cy.get('.patient-selector').should('be.visible')
  })

  it('should logout and return to login page', () => {
    cy.get('.logout-button').click()
    cy.get('.login-container').should('be.visible')
    cy.get('.login-logo').should('contain', 'HeiHealth')
  })
})
