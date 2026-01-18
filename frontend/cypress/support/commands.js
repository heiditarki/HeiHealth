// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command to wait for API calls to complete
Cypress.Commands.add('waitForApiCalls', () => {
  cy.intercept('GET', '**/fhir/**').as('fhirCalls')
  cy.intercept('GET', '**/smart/**').as('smartCalls')
  cy.wait(['@fhirCalls', '@smartCalls'], { timeout: 10000 })
})

// Custom command to check if element contains text (case insensitive)
Cypress.Commands.add('containsText', (selector, text) => {
  cy.get(selector).should('contain.text', text)
})

// Custom command to login with SMART launch
Cypress.Commands.add('login', (patientId = 'eps-001', org = 'OYS') => {
  cy.intercept('GET', `**/smart/launch?patient=${patientId}&org=${org}`, {
    statusCode: 200,
    body: {
      patientId: patientId,
      organization: org,
      practitionerId: 'prac-001',
      launchType: 'provider-ehr'
    }
  }).as('smartLaunch')
  
  cy.intercept('GET', '**/patients', {
    statusCode: 200,
    body: {
      patients: [
        { id: 'eps-001', name: 'Albert Knudsen', identifier: '250178-123X' },
        { id: 'eps-002', name: 'Bob Madsen', identifier: '123456-789A' },
        { id: 'eps-003', name: 'Miroslava Staňková', identifier: '987654-321B' },
        { id: 'eps-004', name: 'Alwin Wernecke', identifier: '555555-666C' },
        { id: 'eps-005', name: 'Aurėja Grinius', identifier: '4402-486299-5' }
      ]
    }
  }).as('getPatients')

  cy.visit('/')
  
  // Wait for patients to load
  cy.wait('@getPatients', { timeout: 10000 })
  
  // Select patient and organization
  cy.get('#patient').select(patientId)
  cy.get('#org').select(org)
  
  // Click launch button
  cy.get('.login-button').click()
  
  // Wait for SMART launch
  cy.wait('@smartLaunch', { timeout: 10000 })
})
