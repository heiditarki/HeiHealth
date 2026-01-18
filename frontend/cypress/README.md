# Cypress E2E Tests

End-to-end tests for the HeiHealth frontend using Cypress.

## Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run test:open
```

### Run Tests Headlessly
```bash
npm run test
```

## Test Structure

- `cypress/e2e/` - Test files
  - `overview.cy.js` - Tests for the overview/dashboard page
  - `details.cy.js` - Tests for the details page
  - `navigation.cy.js` - Tests for navigation and UI elements
  - `api.cy.js` - Tests for API integration
  - `error-handling.cy.js` - Tests for error states

- `cypress/fixtures/` - Mock data files
  - `patient.json` - Mock patient data
  - `conditions.json` - Mock conditions data
  - `observations.json` - Mock observations data
  - `immunizations.json` - Mock immunizations data
  - `procedures.json` - Mock procedures data
  - `careplans.json` - Mock care plans data

- `cypress/support/` - Support files
  - `commands.js` - Custom Cypress commands
  - `e2e.js` - Configuration and imports

## Prerequisites

1. **Start the backend server:**
   ```bash
   cd ..
   python run.py
   ```

2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npm run test:open
   ```

## Test Coverage

### Overview Page Tests
- ✅ Page title and patient name display
- ✅ Patient information card
- ✅ Key metrics cards (BP, HR, BMI, Cholesterol)
- ✅ Active conditions summary
- ✅ Recent vital signs

### Details Page Tests
- ✅ All sections display correctly
- ✅ Conditions, Immunizations, Procedures, Care Plans, Observations

### Navigation Tests
- ✅ Sidebar navigation
- ✅ Tab switching
- ✅ Active tab highlighting
- ✅ Top bar elements

### API Integration Tests
- ✅ Patient endpoint
- ✅ Conditions endpoint
- ✅ Observations endpoint
- ✅ SMART launch endpoint
- ✅ Error handling for invalid requests

### Error Handling Tests
- ✅ Backend unavailable error
- ✅ Loading states
