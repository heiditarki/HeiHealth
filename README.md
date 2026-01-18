# HeiHealth - Technical Documentation

> **For a quick overview with screenshots, see
> [README-OVERVIEW.md](README-OVERVIEW.md)**

HeiHealth is a FastAPI backend and React frontend for visualizing European
Patient Summary (EPS) data with SMART App Launch simulation. The patient data
comes from [HL7 SynderAI's](https://synderai.net/index.php?menu=index) example
patients, following the European Patient Summary Bundle structure.

## Project Structure

```
HealthDataApp/
├── app/                   # Backend application
│   ├── main.py            # FastAPI entry point
│   ├── smart.py           # SMART launch simulation
│   ├── fhir_api.py        # FHIR-style API endpoints
│   └── data/              # EPS Bundle JSON files
│       └── eps-001.json   # Patient data bundle
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service
│   │   └── styles/        # CSS styles
│   └── package.json
├── requirements.txt       # Python dependencies
└── run.py                 # Server launcher
```

## Backend Setup

### Installation

```bash
pip install -r requirements.txt
```

### Running the Server

```bash
python run.py
```

The backend will be available at `http://127.0.0.1:8000`

### API Documentation

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## API Endpoints

### SMART Launch Endpoint

**GET** `/smart/launch`

Simulates a SMART App Launch for Finnish healthcare context.

**Query Parameters:**

- `patient` (required): Patient ID (e.g., `eps-001`)
- `org` (required): Organization identifier (e.g., `OuluHVA`, `HelsinkiHUS`,
  `TampereTAYS`)

**Example:**

```bash
GET /smart/launch?patient=eps-001&org=OuluHVA
```

**Response:**

```json
{
   "patientId": "eps-001",
   "organization": "OuluHVA",
   "practitionerId": "prac-001",
   "launchType": "provider-ehr"
}
```

**Supported Organizations:**

- `OuluHVA` → `prac-001`
- `HelsinkiHUS` → `prac-002`
- `TampereTAYS` → `prac-003`

### FHIR Endpoints

**FHIR** (Fast Healthcare Interoperability Resources) is an HL7 standard for
exchanging healthcare information electronically. All FHIR endpoints return
resources extracted from
[HL7 SynderAI](https://synderai.net/index.php?menu=index) European Patient
Summary Bundle format. The data structure follows the SynderAI EPS Bundle
specification with **FHIR R4** (version 4) resources, which are standard
healthcare data formats like Patient, Condition, Observation, etc.

#### Patient Resource

**GET** `/fhir/Patient/{patient_id}`

Returns a Patient resource by ID.

**Example:**

```bash
GET /fhir/Patient/eps-001
```

**Response:** FHIR Patient resource

#### Condition Resources

**GET** `/fhir/Condition?patient={patient_id}`

Returns a Bundle of Condition resources (problems/diagnoses).

**Query Parameters:**

- `patient` (required): Patient ID

**Example:**

```bash
GET /fhir/Condition?patient=eps-001
```

**Response:** FHIR Bundle containing Condition resources

#### Immunization Resources

**GET** `/fhir/Immunization?patient={patient_id}`

Returns a Bundle of Immunization resources (vaccinations).

**Query Parameters:**

- `patient` (required): Patient ID

**Example:**

```bash
GET /fhir/Immunization?patient=eps-001
```

**Response:** FHIR Bundle containing Immunization resources

#### Procedure Resources

**GET** `/fhir/Procedure?patient={patient_id}`

Returns a Bundle of Procedure resources (procedures performed).

**Query Parameters:**

- `patient` (required): Patient ID

**Example:**

```bash
GET /fhir/Procedure?patient=eps-001
```

**Response:** FHIR Bundle containing Procedure resources

#### CarePlan Resources

**GET** `/fhir/CarePlan?patient={patient_id}`

Returns a Bundle of CarePlan resources (care plans).

**Query Parameters:**

- `patient` (required): Patient ID

**Example:**

```bash
GET /fhir/CarePlan?patient=eps-001
```

**Response:** FHIR Bundle containing CarePlan resources

#### Observation Resources

**GET** `/fhir/Observation?patient={patient_id}`

Returns a Bundle of Observation resources (vital signs, lab results, etc.).

**Query Parameters:**

- `patient` (required): Patient ID

**Example:**

```bash
GET /fhir/Observation?patient=eps-001
```

**Response:** FHIR Bundle containing Observation resources

### Health Check

**GET** `/health`

Returns server health status.

**Response:**

```json
{
   "status": "healthy"
}
```

## SMART Configuration

### SMART App Launch Flow

The backend simulates a SMART App Launch flow for Finnish healthcare systems:

1. **Launch Request**: Frontend calls `/smart/launch` with patient and
   organization parameters
2. **Context Return**: Backend returns launch context including:
   - `patientId`: The patient identifier
   - `organization`: The healthcare organization
   - `practitionerId`: The practitioner ID (mapped from organization)
   - `launchType`: Always `"provider-ehr"` for provider-launched apps

### Using SMART Launch in Frontend

```javascript
import { smartLaunch } from "./services/api";

// Launch the app with patient and organization
const context = await smartLaunch("eps-001", "OuluHVA");

console.log(context);
// {
//   patientId: "eps-001",
//   organization: "OuluHVA",
//   practitionerId: "prac-001",
//   launchType: "provider-ehr"
// }

// Use the context to fetch patient data
const patient = await getPatient(context.patientId);
```

### Organization Mapping

The backend automatically maps organization identifiers to practitioner IDs:

| Organization | Practitioner ID |
| ------------ | --------------- |
| OuluHVA      | prac-001        |
| HelsinkiHUS  | prac-002        |
| TampereTAYS  | prac-003        |

## Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Running the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Configuration

The frontend connects to the FastAPI backend at `http://127.0.0.1:8000` by
default.

To change the API URL, create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://your-backend-url:8000
```

### Frontend API Endpoints Used

The frontend uses the following backend endpoints:

#### SMART Launch

- `GET /smart/launch?patient={id}&org={org}` - Get SMART launch context

#### FHIR Resources

- `GET /fhir/Patient/{id}` - Get patient information
- `GET /fhir/Condition?patient={id}` - Get conditions/diagnoses
- `GET /fhir/Immunization?patient={id}` - Get immunizations
- `GET /fhir/Procedure?patient={id}` - Get procedures
- `GET /fhir/CarePlan?patient={id}` - Get care plans
- `GET /fhir/Observation?patient={id}` - Get vital signs and lab results

### Frontend SMART Configuration

#### Using SMART Launch in Frontend

The frontend can use SMART launch to initialize with patient context:

```javascript
import { getPatient, smartLaunch } from "./services/api";

// Launch with patient and organization
const context = await smartLaunch("eps-001", "OuluHVA");

// Use the context to fetch patient data
const patient = await getPatient(context.patientId);
```

#### Supported Organizations

- `OuluHVA` - Maps to practitioner `prac-001`
- `HelsinkiHUS` - Maps to practitioner `prac-002`
- `TampereTAYS` - Maps to practitioner `prac-003`

#### SMART Launch Response

The SMART launch endpoint returns:

```json
{
   "patientId": "eps-001",
   "organization": "OuluHVA",
   "practitionerId": "prac-001",
   "launchType": "provider-ehr"
}
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Frontend Development

The frontend uses:

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **8pt Grid System** - Consistent spacing

### Frontend Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   ├── TopBar.jsx    # Top navigation bar
│   │   ├── HealthMetricCard.jsx  # Metric cards with graphs
│   │   ├── PatientInfo.jsx
│   │   ├── Conditions.jsx
│   │   ├── Immunizations.jsx
│   │   ├── Procedures.jsx
│   │   ├── CarePlans.jsx
│   │   └── Observations.jsx
│   ├── services/
│   │   └── api.js        # API service functions
│   ├── styles/
│   │   └── index.css     # Global styles with 8pt grid
│   ├── App.jsx           # Main app component
│   └── main.jsx          # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Features

### Backend

- SMART App Launch simulation
- FHIR R4 compliant endpoints
- HL7 SynderAI European Patient Summary (EPS) Bundle format
- Patient data from [SynderAI's](https://synderai.net/index.php?menu=index)
  example patients
- CORS enabled for frontend access
- Auto-reload in development

### Frontend

- Modern UI with sidebar navigation
- Health metric cards with visualizations
- Patient information display
- Conditions & diagnoses
- Immunizations history
- Procedures history
- Care plans
- Vital signs and laboratory results
- 8pt grid spacing system
- Responsive design

## Data Format

The backend uses HL7 SynderAI European Patient Summary Bundle format where all
resources are stored in a single JSON Bundle file. The patient data comes from
[SynderAI's](https://synderai.net/index.php?menu=index) example patients.

- **Source**: [HL7 SynderAI](https://synderai.net/index.php?menu=index) example
  patients (European Patient Summary Bundle format)
- **Location**: `app/data/{patient-id}.json`
- **Format**: FHIR R4 Bundle with `type: "document"` following SynderAI EPS
  specification
- **Structure**: Contains Composition, Patient, Condition, Immunization,
  Procedure, CarePlan, Observation resources as per HL7 SynderAI EPS Bundle
  structure
- **Metadata**: Resources include SynderAI synthetic data tags and security
  markers (HTEST, TRAIN) indicating test/training data

## Example Usage

### Complete Flow

1. **Start Backend:**
   ```bash
   python run.py
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Dashboard:**
   - Open http://localhost:3000
   - The app automatically loads patient `eps-001` data

4. **Test SMART Launch:**
   ```bash
   curl "http://127.0.0.1:8000/smart/launch?patient=eps-001&org=OuluHVA"
   ```

5. **Fetch Patient Data:**
   ```bash
   curl "http://127.0.0.1:8000/fhir/Patient/eps-001"
   ```

## Data Attribution

This project uses patient data from
[HL7 SynderAI's](https://synderai.net/index.php?menu=index) example patients,
following the European Patient Summary (EPS) Bundle format. The data structure
and format are based on HL7 SynderAI's EPS specification for interoperability
testing and training purposes.

**Data Source**: [HL7 SynderAI](https://synderai.net/index.php?menu=index)
example patients (European Patient Summary Bundle format) **Purpose**:
Development, testing, and training only (non-clinical use) **Tags**: All
resources include SynderAI synthetic data markers (HTEST, TRAIN)

## CI/CD

The project includes GitHub Actions workflows for continuous integration:

### Workflows

- **`cypress.yml`** - Runs Cypress E2E tests
- **`backend-tests.yml`** - Tests backend API endpoints
- **`lint.yml`** - Lints backend and frontend code
- **`build.yml`** - Builds frontend for production
- **`ci.yml`** - Comprehensive CI with matrix testing

### Running Tests Locally

**Cypress Tests:**

```bash
cd frontend
npm run test:open  # Interactive mode
npm run test:ci    # Headless mode (for CI)
```

**Backend API Tests:**

```bash
# Start backend
python run.py

# In another terminal, test endpoints
curl http://127.0.0.1:8000/health
curl "http://127.0.0.1:8000/smart/launch?patient=eps-001&org=OuluHVA"
curl http://127.0.0.1:8000/fhir/Patient/eps-001
```

### GitHub Actions

The workflows run automatically on:

- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches
- Manual trigger via `workflow_dispatch`
