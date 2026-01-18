# Data Flow Diagram - HeiHealth Backend

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HL7 SynderAI EPS Bundle                       │
│                    (app/data/eps-001.json)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Bundle (type: "document")                                │   │
│  │  ├─ Composition (Patient Summary Document)               │   │
│  │  ├─ Patient (eps-001)                                    │   │
│  │  ├─ Condition (Essential hypertension)                   │   │
│  │  ├─ Condition (Dependent drug abuse)                     │   │
│  │  ├─ Immunization (Influenza, COVID-19 x3)                │   │
│  │  ├─ Procedure (Depression screening, Clavicle X-ray)    │   │
│  │  ├─ CarePlan (Hypertension lifestyle care plan)          │   │
│  │  └─ Observation (BP, BMI, Cholesterol, etc.)             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Load & Parse
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                               │
│                    (app/fhir_api.py)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Bundle Parser Functions                                  │   │
│  │  ├─ load_eps_bundle(patient_id)                         │   │
│  │  │   └─> Loads JSON file, caches in memory              │   │
│  │  │                                                       │   │
│  │  ├─ extract_resources_from_bundle(                       │   │
│  │  │     bundle, resource_type, patient_ref)             │   │
│  │  │   └─> Filters entries by resourceType                │   │
│  │  │   └─> Filters by patient reference                  │   │
│  │  │   └─> Returns list of resources                      │   │
│  │  │                                                       │   │
│  │  └─ find_patient_in_bundle(bundle, patient_id)          │   │
│  │     └─> Finds Patient resource by ID                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ Extract                           │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ FHIR REST Endpoints                                      │   │
│  │  ├─ GET /fhir/Patient/eps-001                           │   │
│  │  │   └─> Returns single Patient resource                │   │
│  │  │                                                       │   │
│  │  ├─ GET /fhir/Condition?patient=eps-001                 │   │
│  │  │   └─> Returns Bundle with Condition resources        │   │
│  │  │                                                       │   │
│  │  ├─ GET /fhir/Observation?patient=eps-001               │   │
│  │  │   └─> Returns Bundle with Observation resources     │   │
│  │  │                                                       │   │
│  │  └─ ... (Immunization, Procedure, CarePlan)            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP GET
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend                                │
│                    (frontend/src/)                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Service (services/api.js)                            │   │
│  │  ├─ getPatient(patientId)                                │   │
│  │  ├─ getConditions(patientId)                             │   │
│  │  ├─ getObservations(patientId)                           │   │
│  │  └─ ... (other endpoints)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ Process & Display                 │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components                                               │   │
│  │  ├─ PatientInfo.jsx                                      │   │
│  │  │   └─> Displays: Name, DOB, Gender, Address          │   │
│  │  │                                                       │   │
│  │  ├─ HealthMetricCard.jsx                                 │   │
│  │  │   └─> Displays: BP, HR, BMI, Cholesterol            │   │
│  │  │   └─> Shows: Value, Unit, Trend, Graph              │   │
│  │  │                                                       │   │
│  │  ├─ Conditions.jsx                                       │   │
│  │  │   └─> Displays: Condition name, status, dates       │   │
│  │  │                                                       │   │
│  │  └─ Observations.jsx                                      │   │
│  │     └─> Displays: Vital signs & lab results            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structure Breakdown

### HL7 SynderAI EPS Bundle Structure

```
eps-001.json (Bundle)
│
├── Bundle Metadata
│   ├── resourceType: "Bundle"
│   ├── type: "document"
│   ├── profile: "http://hl7.eu/fhir/eps/StructureDefinition/bundle-eu-eps"
│   └── timestamp: "2023-11-15T10:00:00+02:00"
│
└── entry[] (Array of resources)
    │
    ├── [0] Composition
    │   ├── fullUrl: "urn:uuid:composition-eps-001"
    │   ├── resourceType: "Composition"
    │   ├── subject.reference: "urn:uuid:patient-eps-001"
    │   └── type: "Patient summary Document"
    │
    ├── [1] Patient
    │   ├── fullUrl: "urn:uuid:patient-eps-001"
    │   ├── resourceType: "Patient"
    │   ├── id: "eps-001"
    │   ├── name: [{given: ["Albert"], family: "Knudsen"}]
    │   ├── birthDate: "1978-01-25"
    │   └── identifier: [{value: "250178-123X"}]
    │
    ├── [2] Condition #1
    │   ├── fullUrl: "urn:uuid:condition-001"
    │   ├── resourceType: "Condition"
    │   ├── subject.reference: "urn:uuid:patient-eps-001"
    │   ├── code: "Essential hypertension"
    │   └── clinicalStatus: "active"
    │
    ├── [3] Condition #2
    │   ├── fullUrl: "urn:uuid:condition-002"
    │   ├── resourceType: "Condition"
    │   ├── subject.reference: "urn:uuid:patient-eps-001"
    │   ├── code: "Dependent drug abuse"
    │   └── clinicalStatus: "active"
    │
    ├── [4-7] Immunizations (4 entries)
    │   ├── Influenza vaccine
    │   └── COVID-19 vaccine (3 doses)
    │
    ├── [8-9] Procedures (2 entries)
    │   ├── Depression screening
    │   └── Clavicle X-ray
    │
    ├── [10] CarePlan
    │   └── Hypertension lifestyle care plan
    │
    └── [11-18] Observations (8 entries)
        ├── Blood Pressure (with components)
        ├── BMI
        ├── Cholesterol (Total, LDL, HDL)
        ├── Triglycerides
        ├── Weight
        └── Height
```

## Extraction Flow Example

### Example: Getting Conditions

```
1. Request: GET /fhir/Condition?patient=eps-001
   │
   ├─> fhir_api.py: get_conditions()
   │   │
   │   ├─> load_eps_bundle("eps-001")
   │   │   └─> Returns: Full Bundle object
   │   │
   │   ├─> get_patient_reference_from_bundle(bundle, "eps-001")
   │   │   └─> Returns: "urn:uuid:patient-eps-001"
   │   │
   │   └─> extract_resources_from_bundle(
   │         bundle, 
   │         "Condition", 
   │         "urn:uuid:patient-eps-001"
   │       )
   │       │
   │       └─> Filters Bundle.entry[]:
   │           ├─> resourceType === "Condition" ✓
   │           └─> subject.reference contains "patient-eps-001" ✓
   │
   └─> Returns: Bundle {
         resourceType: "Bundle",
         type: "searchset",
         total: 2,
         entry: [
           {resource: Condition #1},
           {resource: Condition #2}
         ]
       }
```

## Frontend Data Processing

### Overview Page Data Flow

```
App.jsx (useEffect)
│
├─> Loads all data in parallel:
│   ├─> getPatient("eps-001")
│   ├─> getConditions("eps-001")
│   ├─> getObservations("eps-001")
│   └─> ... (others)
│
└─> Processes observations:
    │
    ├─> getBloodPressure()
    │   └─> Finds Observation with code "85354-9"
    │   └─> Extracts systolic & diastolic from components
    │   └─> Returns: "142/88"
    │
    ├─> getHeartRate()
    │   └─> Finds Observation with code "8867-4"
    │   └─> Returns: 92
    │
    ├─> getBMI()
    │   └─> Finds Observation with code "39156-5"
    │   └─> Returns: 28.5
    │
    └─> getCholesterol()
        └─> Finds Observation with code "2093-3"
        └─> Returns: 5.8
```

## Resource Reference Mapping

```
Patient Reference: "urn:uuid:patient-eps-001"
│
├─> Used to filter resources that belong to this patient
│
└─> Found in:
    ├─> Condition.subject.reference
    ├─> Immunization.patient.reference
    ├─> Procedure.subject.reference
    ├─> CarePlan.subject.reference
    └─> Observation.subject.reference
```

## Key Data Transformations

### 1. Bundle → Individual Resources

```
Input:  Bundle with 19 entries
Output: Single resource or filtered Bundle
```

### 2. Observation → Metric Value

```
Input:  Observation {
          code: {coding: [{code: "85354-9"}]},
          component: [
            {code: {code: "8480-6"}, valueQuantity: {value: 142}},
            {code: {code: "8462-4"}, valueQuantity: {value: 88}}
          ]
        }
Output: "142/88 mmHg"
```

### 3. Condition → Display Format

```
Input:  Condition {
          code: {text: "Essential hypertension"},
          clinicalStatus: {coding: [{code: "active"}]},
          onsetDateTime: "2020-03-15"
        }
Output: Card showing:
        - Name: "Essential hypertension"
        - Status: "Active" (green badge)
        - Onset: "Mar 15, 2020"
```
