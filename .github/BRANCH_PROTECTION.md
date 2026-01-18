# Branch Protection

## Setup

1. Go to GitHub → Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select required checks:
   - `CI / test`
   - `Cypress Tests / cypress-run`
   - `Lint / lint-backend`
   - `Lint / lint-frontend`

## Deployment

- Backend: Manual via Actions → Deploy → Run workflow
- Frontend: Auto-deploys on Vercel
