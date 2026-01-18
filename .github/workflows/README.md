# GitHub Actions Workflows

This directory contains CI/CD workflows for the HeiHealth Backend & Dashboard project.

## Workflows

### 1. `cypress.yml` - Cypress E2E Tests
Runs end-to-end tests using Cypress.

**Triggers:**
- Push to main/master/develop branches
- Pull requests to main/master/develop branches
- Manual dispatch

**Test Coverage:**
- Login page and SMART launch flow
- Overview page with patient information
- Details page with all sections
- Navigation and sidebar
- Multi-patient support (eps-001, eps-005)
- Patient nationality display
- Logout functionality

**Steps:**
1. Sets up Python and Node.js
2. Installs dependencies
3. Starts backend server
4. Starts frontend dev server
5. Runs Cypress tests
6. Uploads screenshots/videos on failure

### 2. `backend-tests.yml` - Backend API Tests
Tests backend API endpoints.

**Triggers:**
- Push to main/master/develop branches
- Pull requests to main/master/develop branches
- Manual dispatch

**Steps:**
1. Sets up Python
2. Installs dependencies
3. Starts backend server
4. Tests API endpoints (health, SMART launch, FHIR endpoints)
5. Tests multiple patients (eps-001, eps-005)
6. Tests error handling (404, 400 responses)

### 3. `lint.yml` - Code Linting
Lints backend and frontend code.

**Triggers:**
- Push to main/master/develop branches
- Pull requests to main/master/develop branches
- Manual dispatch

**Steps:**
1. Lints Python code with flake8
2. Checks frontend syntax

### 4. `build.yml` - Build Frontend
Builds the frontend for production.

**Triggers:**
- Push to main/master branches
- Pull requests to main/master branches
- Manual dispatch

**Steps:**
1. Sets up Node.js
2. Installs dependencies
3. Builds frontend
4. Uploads build artifacts

### 5. `ci.yml` - Comprehensive CI
Runs tests with matrix strategy (multiple Python and Node versions).

**Triggers:**
- Push to main/master/develop branches
- Pull requests to main/master/develop branches
- Manual dispatch

**Matrix:**
- Python: 3.10, 3.11
- Node.js: 18, 20

## Status Badge

Add this to your README to show CI status:

```markdown
![CI](https://github.com/YOUR_USERNAME/HealthDataApp/workflows/CI/badge.svg)
```

## Local Testing

To test workflows locally before pushing:

```bash
# Install act (GitHub Actions local runner)
# macOS: brew install act
# Linux: See https://github.com/nektos/act

# Run a workflow locally
act -j cypress-run
```
