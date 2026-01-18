describe('Login Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/patients', {
      statusCode: 200,
      body: {
        patients: [
          { id: 'eps-001', name: 'Albert Knudsen', identifier: '250178-123X' },
          { id: 'eps-005', name: 'Aurėja Grinius', identifier: '4402-486299-5' }
        ]
      }
    }).as('getPatients')
    
    cy.visit('/')
  })

  it('should display login page', () => {
    cy.get('.login-container').should('be.visible')
    cy.get('.login-logo').should('contain', 'HeiHealth')
    cy.get('.login-subtitle').should('contain', 'SMART App Launch')
  })

  it('should load available patients', () => {
    cy.wait('@getPatients', { timeout: 10000 })
    cy.get('#patient').should('be.visible')
    cy.get('#patient option').should('have.length.at.least', 2)
  })

  it('should display organization selector', () => {
    cy.get('#org').should('be.visible')
    cy.get('#org option').should('have.length', 3)
  })

  it('should login successfully', () => {
    cy.intercept('GET', '**/smart/launch?patient=eps-001&org=OYS', {
      statusCode: 200,
      body: {
        patientId: 'eps-001',
        organization: 'OYS',
        practitionerId: 'prac-001',
        launchType: 'provider-ehr'
      }
    }).as('smartLaunch')

    cy.intercept('GET', '**/fhir/**', { fixture: 'patient.json' }).as('fhirCalls')

    cy.wait('@getPatients', { timeout: 10000 })
    cy.get('#patient').select('eps-001')
    cy.get('#org').select('OYS')
    cy.get('.login-button').click()
    
    cy.wait('@smartLaunch', { timeout: 10000 })
    
    // Should redirect to dashboard
    cy.get('.app-layout').should('be.visible')
    cy.get('.page-title').should('be.visible')
  })

  it('should display error on login failure', () => {
    cy.intercept('GET', '**/smart/launch?patient=eps-001&org=OYS', {
      statusCode: 500,
      body: { detail: 'Internal server error' }
    }).as('smartLaunchError')

    cy.wait('@getPatients', { timeout: 10000 })
    cy.get('#patient').select('eps-001')
    cy.get('#org').select('OYS')
    cy.get('.login-button').click()
    
    cy.wait('@smartLaunchError', { timeout: 10000 })
    cy.get('.error-message').should('be.visible')
  })
})
