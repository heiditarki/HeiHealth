"""
SMART App Launch simulation for Finnish healthcare context.
"""

from fastapi import APIRouter, Query
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/smart", tags=["SMART"])


class SMARTContext(BaseModel):
    """SMART launch context response."""

    patientId: str
    organization: str
    practitionerId: str
    launchType: str = "provider-ehr"


@router.get("/launch", response_model=SMARTContext)
async def smart_launch(
    patient: str = Query(..., description="Patient ID (e.g., eps-001)"),
    org: str = Query(..., description="Organization identifier (e.g., OuluHVA)"),
):
    """
    Simulates a SMART App Launch endpoint.

    Returns a SMART-like context with patientId, organization, and practitionerId.
    This simulates the launch context that would be provided by a real EHR system
    during a SMART App Launch flow.

    Args:
        patient: Patient identifier (e.g., eps-001)
        org: Organization identifier (e.g., OuluHVA)

    Returns:
        SMARTContext: Launch context with patient, organization, and practitioner IDs
    """
    # Simulate practitioner ID based on organization
    practitioner_map = {
        "OYS": "prac-001",
        "OuluHVA": "prac-001",  # Legacy name
        "HUS": "prac-002",
        "HelsinkiHUS": "prac-002",  # Legacy name
        "TAYS": "prac-003",
        "TampereTAYS": "prac-003",  # Legacy name
    }

    practitioner_id = practitioner_map.get(org, "prac-001")

    return SMARTContext(
        patientId=patient,
        organization=org,
        practitionerId=practitioner_id,
        launchType="provider-ehr",
    )
