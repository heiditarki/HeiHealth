describe('Multi-Patient Support', () => {
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
  })

  it('should switch between patients', () => {
    // Set up intercepts for eps-001 BEFORE login
    cy.intercept('GET', '**/fhir/Patient/eps-001', { fixture: 'patient.json' }).as('getPatient1')
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/') && req.url.includes('patient=eps-001')
    }, { fixture: 'patient.json' }).as('getPatient1Data')
    
    // Login with eps-001
    cy.login('eps-001', 'OYS')
    
    cy.wait(['@getPatient1', '@getPatient1Data'], { timeout: 15000 })
    cy.get('.page-subtitle').should('contain', 'Albert')
    
    // Set up intercepts for eps-005 BEFORE switching
    cy.intercept('GET', '**/fhir/Patient/eps-005', {
      statusCode: 200,
      body: {
        resourceType: 'Patient',
        id: '50a7d0f4-832f-4290-93ac-3ff760eb528c',
        name: [{ given: ['Aurėja'], family: 'Grinius' }],
        gender: 'female',
        birthDate: '1943-08-01',
        extension: [{
          url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
          valueCodeableConcept: {
            coding: [{ code: 'LT', system: 'http://hl7.org/fhir/ValueSet/country' }]
          }
        }]
      }
    }).as('getPatient5')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/') && req.url.includes('patient=eps-005')
    }, {
      statusCode: 200,
      body: {
        resourceType: 'Bundle',
        type: 'searchset',
        entry: []
      }
    }).as('getPatient5Data')
    
    cy.get('#patient-select').select('eps-005')
    cy.wait(['@getPatient5', '@getPatient5Data'], { timeout: 15000 })
    cy.get('.page-subtitle').should('contain', 'Aurėja')
  })

  it('should display patient dropdown with names and identifiers', () => {
    cy.visit('/')
    cy.wait('@getPatients', { timeout: 10000 })
    
    cy.get('#patient option').should('have.length.at.least', 2)
    cy.get('#patient option').contains('Albert Knudsen').should('exist')
    cy.get('#patient option').contains('Aurėja Grinius').should('exist')
  })

  it('should display nationality for Lithuanian patient', () => {
    // Set up intercepts BEFORE login
    cy.intercept('GET', '**/fhir/Patient/eps-005', {
      statusCode: 200,
      body: {
        resourceType: 'Patient',
        id: '50a7d0f4-832f-4290-93ac-3ff760eb528c',
        name: [{ given: ['Aurėja'], family: 'Grinius' }],
        extension: [{
          url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
          valueCodeableConcept: {
            coding: [{ code: 'LT', system: 'http://hl7.org/fhir/ValueSet/country' }]
          }
        }]
      }
    }).as('getPatient5')
    
    cy.intercept('GET', (req) => {
      return req.url.includes('/fhir/') && req.url.includes('patient=eps-005')
    }, {
      statusCode: 200,
      body: { resourceType: 'Bundle', type: 'searchset', entry: [] }
    }).as('getPatient5Data')
    
    cy.login('eps-005', 'OYS')
    
    cy.wait(['@getPatient5', '@getPatient5Data'], { timeout: 15000 })
    
    cy.get('.info-label').contains('Nationality').should('be.visible')
    cy.get('.info-value').contains('Lithuania').should('be.visible')
  })
})
