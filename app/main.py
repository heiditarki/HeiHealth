"""
FastAPI application entry point for HeiHealth backend.

This backend simulates a Finnish SMART App Launch and exposes FHIR-style REST endpoints
based on HL7 SynderAI European Patient Summary (EPS) Bundle format using synthetic data.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import smart, fhir_api

app = FastAPI(
    title="HeiHealth Backend",
    description="FastAPI backend for European Patient Summary (EPS) data with SMART App Launch simulation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware to allow frontend access
# In production, update allow_origins with your frontend URL(s)
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(smart.router)
app.include_router(fhir_api.router)


@app.get("/")
async def root():
    """Root endpoint providing API information."""
    return {
        "name": "HeiHealth Backend",
        "version": "1.0.0",
        "description": "European Patient Summary (EPS) FHIR API with SMART App Launch simulation",
        "endpoints": {
            "smart": "/smart/launch",
            "fhir": {
                "patient": "/fhir/Patient/{id}",
                "condition": "/fhir/Condition?patient={id}",
                "immunization": "/fhir/Immunization?patient={id}",
                "procedure": "/fhir/Procedure?patient={id}",
                "careplan": "/fhir/CarePlan?patient={id}",
                "observation": "/fhir/Observation?patient={id}",
            },
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/patients")
async def list_patients():
    """List all available patients with their identifiers and names."""
    from app.fhir_api import (
        get_available_patients,
        load_eps_bundle,
        find_patient_in_bundle,
    )

    patient_ids = get_available_patients()
    patients_info = []

    for patient_id in patient_ids:
        try:
            bundle = load_eps_bundle(patient_id)
            patient = find_patient_in_bundle(bundle, patient_id)

            if patient:
                # Extract patient name
                name = patient.get("name", [{}])[0]
                given = name.get("given", [])
                family = name.get("family", "")
                full_name = (
                    f"{' '.join(given)} {family}".strip()
                    if given or family
                    else "Unknown"
                )

                # Extract henkilötunnus (Finnish SSN) - look for identifier with system containing "1.2.246.21"
                henkilötunnus = None
                for identifier in patient.get("identifier", []):
                    system = identifier.get("system", "")
                    if "1.2.246.21" in system or "246.21" in system:
                        henkilötunnus = identifier.get("value")
                        break

                # Fallback to first identifier if no Finnish SSN found
                if not henkilötunnus and patient.get("identifier"):
                    henkilötunnus = patient.get("identifier")[0].get("value")

                patients_info.append(
                    {
                        "id": patient_id,
                        "name": full_name,
                        "identifier": henkilötunnus or patient_id,
                    }
                )
            else:
                # Fallback if patient not found
                patients_info.append(
                    {"id": patient_id, "name": "Unknown", "identifier": patient_id}
                )
        except Exception as e:
            # If there's an error loading patient, still include the ID
            patients_info.append(
                {"id": patient_id, "name": "Unknown", "identifier": patient_id}
            )

    return {"patients": patients_info}
