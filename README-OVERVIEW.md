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

<img width="1512" height="822" alt="image" src="https://github.com/user-attachments/assets/5c4e4568-12b7-4a29-8ce4-9f6b24ca3fa2" />

The application starts with a SMART App Launch simulation, where users select a
patient and healthcare organization to access their health data.

### Patient Overview Dashboard

<img width="1512" height="822" alt="image" src="https://github.com/user-attachments/assets/378e8808-e3bb-45f3-ada1-2eaf66146c7d" />
<img width="1451" height="822" alt="image" src="https://github.com/user-attachments/assets/226e45ab-8eba-4fc9-8d6b-7ff5b09744bc" />


The overview provides a quick snapshot of the patient's health status with key
metrics displayed in easy-to-read cards.

### Patient Details View

<img width="1455" height="767" alt="image" src="https://github.com/user-attachments/assets/bad26aee-7b80-45f7-8bc1-f9ab794bba67" />
<img width="1455" height="764" alt="image" src="https://github.com/user-attachments/assets/8a3f61fb-d6f9-40c9-b45a-aef2defd446f" />


The details page offers a complete view of all patient health information,
organized into clear sections.

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
