# Branch Protection Setup

To require CI/CD checks to pass before merging pull requests, configure branch protection rules in GitHub:

## Steps to Enable Branch Protection

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** or edit an existing rule for your main branch (e.g., `main`, `master`)
4. Configure the following:

### Required Settings

- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - Select the following required checks:
    - `CI / Test Suite (ubuntu-latest)`
    - `Cypress Tests / cypress-run`
    - `Lint / lint-backend`
    - `Lint / lint-frontend`

### Optional Settings (Recommended)

- ✅ **Require branches to be up to date before merging**
- ✅ **Do not allow bypassing the above settings**
- ✅ **Require conversation resolution before merging** (if using reviews)

## Current CI/CD Workflows

The following workflows run on pull requests:

- **CI** (`.github/workflows/ci.yml`) - Runs full test suite with multiple Python/Node versions
- **Cypress Tests** (`.github/workflows/cypress.yml`) - Runs end-to-end tests
- **Lint** (`.github/workflows/lint.yml`) - Runs linting for backend and frontend

All workflows must pass (green checkmark ✅) before a pull request can be merged when branch protection is enabled.

## Deployment

Deployment is **manual** via GitHub Actions workflow dispatch:

- **Backend**: Deploy via `.github/workflows/deploy.yml` → Run workflow → Select "Deploy Backend to Fly.io"
- **Frontend**: Automatically deploys to Vercel (if Vercel is connected to the GitHub repository)

To enable automatic backend deployment, set the `FLY_API_TOKEN` secret in GitHub repository settings (Settings → Secrets and variables → Actions) and update the workflow trigger.
