# HeiHealth - Overview

HeiHealth is a modern healthcare application that visualizes European Patient
Summary (EPS) data with a clean, intuitive interface. It demonstrates
integration with healthcare systems using SMART App Launch and FHIR standards.

## What is HeiHealth?

HeiHealth is a full-stack application that:

- Simulates SMART App Launch - Demonstrates how healthcare apps integrate with
  Electronic Health Records (EHRs)
- Visualizes Patient Data - Displays comprehensive patient health information in
  an easy-to-understand dashboard
- Uses Real Healthcare Standards - Built with FHIR (Fast Healthcare
  Interoperability Resources) and European Patient Summary format
- Multi-Patient Support - Switch between different patients to view their health
  records

## Key Features

### Patient Dashboard

Overview Page - Quick summary of patient health status:

- Patient demographics and nationality
- Key health metrics (Blood Pressure, Heart Rate, BMI, Cholesterol)
- Active conditions summary
- Recent vital signs

Details Page - Comprehensive health information:

- Medical conditions and diagnoses
- Immunization history
- Medical procedures
- Care plans and treatment goals
- Laboratory results and vital signs

## Screenshots

### Login Page

_[Screenshot: Login page with patient and organization selection]_

The application starts with a SMART App Launch simulation, where users select a
patient and healthcare organization to access their health data.

### Patient Overview Dashboard

_[Screenshot: Overview page showing patient information, key metrics, and active
conditions]_

The overview provides a quick snapshot of the patient's health status with key
metrics displayed in easy-to-read cards.

### Patient Details View

_[Screenshot: Details page showing comprehensive health information across
multiple sections]_

The details page offers a complete view of all patient health information,
organized into clear sections.

### Multi-Patient Support

_[Screenshot: Patient dropdown showing multiple patients with names and
identifiers]_

Users can easily switch between different patients to view their respective
health records.

## Technology Stack

- Backend: Python, FastAPI, FHIR R4
- Frontend: React, Vite, Modern CSS
- Standards: HL7 FHIR, European Patient Summary (EPS), SMART App Launch
- Testing: Cypress E2E tests, GitHub Actions CI/CD

## Data Source

The application uses patient data from HL7 SynderAI's example patients,
following the European Patient Summary Bundle structure. This is synthetic test
data for development and demonstration purposes only.

## Getting Started

For technical details, setup instructions, and API documentation, see
[README.md](README.md).

## Project Highlights

- Full-stack healthcare application
- FHIR and SMART standards compliance
- Modern React frontend with professional UI
- FastAPI backend with comprehensive API
- Multi-patient support
- Automated testing with Cypress
- CI/CD pipeline with GitHub Actions
