"""
FHIR-style REST API endpoints based on HL7 SynderAI European Patient Summary (EPS) structure.
Uses HL7 SynderAI EPS Bundle format where all resources are stored in a single Bundle.
"""
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/fhir", tags=["FHIR"])

# Get the data directory path
DATA_DIR = Path(__file__).parent / "data"

# Cache for loaded bundles with modification times
_bundle_cache: Dict[str, Dict[str, Any]] = {}
_bundle_mtimes: Dict[str, float] = {}


def get_available_patients() -> List[str]:
    """Get list of available patient IDs from data directory."""
    patients = []
    for file_path in DATA_DIR.glob("eps-*.json"):
        patient_id = file_path.stem  # Gets filename without extension
        patients.append(patient_id)
    return sorted(patients)


def load_eps_bundle(patient_id: str) -> Dict[str, Any]:
    """Load an EPS Bundle file for a patient."""
    file_path = DATA_DIR / f"{patient_id}.json"
    if not file_path.exists():
        available = get_available_patients()
        available_str = ', '.join(available)
        raise HTTPException(
            status_code=404,
            detail=f"Patient {patient_id} not found. Available: {available_str}"
        )

    # Check if file has been modified since last load
    current_mtime = file_path.stat().st_mtime
    cached_mtime = _bundle_mtimes.get(patient_id, 0)

    # Reload if file is new or has been modified
    if patient_id not in _bundle_cache or current_mtime > cached_mtime:
        with open(file_path, "r", encoding="utf-8") as f:
            bundle = json.load(f)
            _bundle_cache[patient_id] = bundle
            _bundle_mtimes[patient_id] = current_mtime
            return bundle

    return _bundle_cache[patient_id]


def extract_resources_from_bundle(
    bundle: Dict[str, Any],
    resource_type: str,
    patient_ref: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Extract resources of a specific type from a Bundle.

    Args:
        bundle: FHIR Bundle containing resources
        resource_type: Type of resource to extract (e.g., "Patient", "Condition")
        patient_ref: Optional patient reference to filter by
            (e.g., "urn:uuid:patient-eps-001")

    Returns:
        List of resource dictionaries
    """
    resources = []

    if "entry" not in bundle:
        return resources

    for entry in bundle.get("entry", []):
        if "resource" not in entry:
            continue

        resource = entry["resource"]

        # Check resource type
        if resource.get("resourceType") != resource_type:
            continue

        # If patient_ref is provided, check if resource belongs to that patient
        if patient_ref:
            # Get subject reference (can be a dict with "reference" key or a string)
            subject = resource.get("subject") or resource.get("patient")
            if isinstance(subject, dict):
                subject_ref = subject.get("reference", "")
            elif isinstance(subject, str):
                subject_ref = subject
            else:
                subject_ref = ""

            # Match if the reference contains the patient reference
            if subject_ref and patient_ref not in subject_ref:
                # Try to match by extracting UUID from patient_ref
                if ":" in patient_ref:
                    patient_uuid = patient_ref.split(":")[-1]
                else:
                    patient_uuid = patient_ref
                if patient_uuid not in subject_ref:
                    continue

        resources.append(resource)

    return resources


def find_patient_in_bundle(bundle: Dict[str, Any], patient_id: str) -> Optional[Dict[str, Any]]:
    """Find a Patient resource by ID in a Bundle."""
    for entry in bundle.get("entry", []):
        if "resource" not in entry:
            continue

        resource = entry["resource"]
        if resource.get("resourceType") == "Patient":
            # Check if this is the patient we're looking for
            if resource.get("id") == patient_id:
                return resource
            # Also check by identifier
            for identifier in resource.get("identifier", []):
                if identifier.get("value") == patient_id:
                    return resource
            # If patient_id matches bundle filename pattern (eps-002), return first Patient
            # This handles cases where Patient.id doesn't match the filename
            if patient_id.startswith("eps-"):
                return resource

    return None


def get_patient_reference_from_bundle(
    bundle: Dict[str, Any], patient_id: str
) -> Optional[str]:
    """Get the patient reference (fullUrl) from a Bundle for a given patient ID."""
    for entry in bundle.get("entry", []):
        if "resource" not in entry:
            continue

        resource = entry["resource"]
        if resource.get("resourceType") == "Patient":
            # Check if this is the patient we're looking for
            if resource.get("id") == patient_id:
                return entry.get("fullUrl")
            # Also check by identifier
            for identifier in resource.get("identifier", []):
                if identifier.get("value") == patient_id:
                    return entry.get("fullUrl")
            # If patient_id matches bundle filename pattern (eps-002), return first Patient's fullUrl
            # This handles cases where Patient.id doesn't match the filename
            if patient_id.startswith("eps-"):
                return entry.get("fullUrl")

    return None


@router.get("/Patient/{patient_id}")
async def get_patient(patient_id: str):
    """
    Get a Patient resource by ID.

    Returns a synthetic EPS Patient resource (FHIR R4) extracted from Bundle.
    Example: GET /fhir/Patient/eps-001
    """
    bundle = load_eps_bundle(patient_id)
    patient = find_patient_in_bundle(bundle, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail=f"Patient {patient_id} not found in Bundle"
        )

    return patient


@router.get("/Condition")
async def get_conditions(
    patient: Optional[str] = Query(None, description="Patient ID filter")
):
    """
    Get Condition resources, optionally filtered by patient.

    Returns a Bundle of Condition resources (problems/diagnoses)
    extracted from EPS Bundle.
    Example: GET /fhir/Condition?patient=eps-001
    """
    if not patient:
        raise HTTPException(
            status_code=400,
            detail="Patient parameter is required. Use ?patient=eps-001"
        )

    bundle = load_eps_bundle(patient)
    patient_ref = (
        get_patient_reference_from_bundle(bundle, patient) or
        f"urn:uuid:patient-{patient}"
    )
    conditions = extract_resources_from_bundle(
        bundle, "Condition", patient_ref
    )

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(conditions),
        "entry": [
            {
                "resource": condition
            }
            for condition in conditions
        ]
    }


@router.get("/Immunization")
async def get_immunizations(
    patient: Optional[str] = Query(None, description="Patient ID filter")
):
    """
    Get Immunization resources, optionally filtered by patient.

    Returns a Bundle of Immunization resources (vaccinations)
    extracted from EPS Bundle.
    Example: GET /fhir/Immunization?patient=eps-001
    """
    if not patient:
        raise HTTPException(
            status_code=400,
            detail="Patient parameter is required. Use ?patient=eps-001"
        )

    bundle = load_eps_bundle(patient)
    patient_ref = (
        get_patient_reference_from_bundle(bundle, patient) or
        f"urn:uuid:patient-{patient}"
    )
    immunizations = extract_resources_from_bundle(
        bundle, "Immunization", patient_ref
    )

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(immunizations),
        "entry": [
            {
                "resource": immunization
            }
            for immunization in immunizations
        ]
    }


@router.get("/Procedure")
async def get_procedures(
    patient: Optional[str] = Query(None, description="Patient ID filter")
):
    """
    Get Procedure resources, optionally filtered by patient.

    Returns a Bundle of Procedure resources (procedures performed)
    extracted from EPS Bundle.
    Example: GET /fhir/Procedure?patient=eps-001
    """
    if not patient:
        raise HTTPException(
            status_code=400,
            detail="Patient parameter is required. Use ?patient=eps-001"
        )

    bundle = load_eps_bundle(patient)
    patient_ref = (
        get_patient_reference_from_bundle(bundle, patient) or
        f"urn:uuid:patient-{patient}"
    )
    procedures = extract_resources_from_bundle(
        bundle, "Procedure", patient_ref
    )

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(procedures),
        "entry": [
            {
                "resource": procedure
            }
            for procedure in procedures
        ]
    }


@router.get("/CarePlan")
async def get_care_plans(
    patient: Optional[str] = Query(None, description="Patient ID filter")
):
    """
    Get CarePlan resources, optionally filtered by patient.

    Returns a Bundle of CarePlan resources (care plans)
    extracted from EPS Bundle.
    Example: GET /fhir/CarePlan?patient=eps-001
    """
    if not patient:
        raise HTTPException(
            status_code=400,
            detail="Patient parameter is required. Use ?patient=eps-001"
        )

    bundle = load_eps_bundle(patient)
    patient_ref = (
        get_patient_reference_from_bundle(bundle, patient) or
        f"urn:uuid:patient-{patient}"
    )
    care_plans = extract_resources_from_bundle(
        bundle, "CarePlan", patient_ref
    )

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(care_plans),
        "entry": [
            {
                "resource": care_plan
            }
            for care_plan in care_plans
        ]
    }


@router.get("/Observation")
async def get_observations(
    patient: Optional[str] = Query(None, description="Patient ID filter")
):
    """
    Get Observation resources, optionally filtered by patient.

    Returns a Bundle of Observation resources (vital signs, lab results, etc.) extracted from EPS Bundle.
    Example: GET /fhir/Observation?patient=eps-001
    """
    if not patient:
        raise HTTPException(
            status_code=400,
            detail="Patient parameter is required. Use ?patient=eps-001"
        )

    bundle = load_eps_bundle(patient)
    patient_ref = (
        get_patient_reference_from_bundle(bundle, patient) or
        f"urn:uuid:patient-{patient}"
    )
    observations = extract_resources_from_bundle(
        bundle, "Observation", patient_ref
    )

    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(observations),
        "entry": [
            {
                "resource": observation
            }
            for observation in observations
        ]
    }
