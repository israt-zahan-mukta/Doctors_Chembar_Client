# Doctor's Chamber - Patient Care & Prescription Management System

A doctor's chamber patient queue and prescription management system built with **Angular 22 Signals**, **Zoneless Change Detection**, and **Reactive Forms**.

Designed with clean, classic styling, simple tabs, and easy-to-understand terms suitable for healthcare staff and everyday users.

---

## Key Features

### 1. Simple Patient Registration (Section 1 Highlighted)
- **Highlighted Section 1 (Basic Details)**:
  - Patient Full Name, Phone / Mobile Number, Age, Gender, Blood Group, Doctor & Department, Reason for Visit / Symptoms, and Doctor's Fee.
  - Highlighted in a clear card container for quick patient intake.
- **Option 1: Basic Health Check (Optional Extension)**:
  - Collapsible checkup card for Blood Pressure (BP), Pulse (bpm), Fever / Temp (°F), Oxygen SpO2 (%), and Weight (kg).
- **Option 2: Prescribed Medicines & Advice (Optional Extension)**:
  - Collapsible medication card with dynamic `FormArray` for medicine names, doses, schedules (`1+0+1`, `1+1+1`), duration, and advice.
- **Option 3: Additional Contact & Past Illnesses (Optional Extension)**:
  - Collapsible card for Home Address, Email, Emergency Contact Phone, Next Visit Date, and Past Illnesses / Drug Allergies.

### 2. Interactive Visit Status Button Toggles
- Clear, clickable button toggle groups across the app:
  - **`[ Waiting ]`** (Amber - Waiting in chamber)
  - **`[ With Doctor ]`** (Blue - Inside doctor's room)
  - **`[ Done ]`** (Green - Consultation completed)
  - **`[ Emergency ]`** (Red - Needs urgent care)
- One click on any button immediately updates the patient's visit status in real time.

### 3. Clear, Straightforward Patient Cards (Card View)
- Easy-to-read cards without visual clutter:
  - Patient Name, Age, Gender, Serial #, and Blood Group badge.
  - Doctor name and chamber room number.
  - Reason for visit / symptoms in plain English.
  - Single-line health check readout: `BP • Pulse • Oxygen`.
  - Prescriptions count and Doctor's Fee.
  - Direct status toggle buttons and action buttons (`[ View Prescription ]`, `[ Edit ]`, `[ Delete ]`).

### 4. Official Printable Prescription Slip
- Doctor letterhead with degrees, visiting hours, and chamber room number.
- Patient details, visit date, and basic health check numbers.
- Structured tabular medicine schedule with dose, timing, and duration.
- Next visit date and doctor signature area.
- Formatted with `@media print` for clean A4 printing (`window.print()`).

### 5. Dual-Mode Data Layer & Signal State Store
- **Signal-based Store** (`PatientStore`) providing instant searching, department filtering, status tabs, and summary statistics.
- Pre-configured `HttpClient` ready to connect to ASP.NET Core API endpoints (`http://localhost:5058/api/Patients`).
- Built-in LocalStorage / in-memory fallback pre-seeded with realistic demonstration records.
- "Reset Demo Data" action in the top navigation to restore default records anytime.

---

## Project Structure

```
Doctor'sChembarClient/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── confirm-modal/           # Delete confirmation dialog
│   │   │   ├── dashboard/               # Main chamber queue page & action bar
│   │   │   ├── filter-bar/              # Search, department dropdown & status buttons
│   │   │   ├── patient-detail-modal/    # Printable doctor's prescription slip
│   │   │   ├── patient-form-modal/      # Highlighted Section 1 & optional extensions
│   │   │   ├── patient-grid/            # Straightforward patient cards
│   │   │   ├── patient-table/           # Patient list table with status buttons
│   │   │   ├── stats-cards/             # Metric panels (Total, Waiting, With Doctor, etc.)
│   │   │   └── toast/                   # Notification stack
│   │   ├── models/
│   │   │   └── patient.ts               # Domain types, vitals & prescriptions
│   │   ├── services/
│   │   │   ├── patient.service.ts       # HttpClient service with LocalStorage fallback
│   │   │   ├── patient.service.spec.ts  # Service unit tests
│   │   │   ├── patient.store.ts         # Signal-based store & computed state
│   │   │   ├── patient.store.spec.ts    # Store unit tests
│   │   │   └── toast.service.ts         # Notification service
│   │   ├── app.config.ts                # Application configuration & Zoneless provider
│   │   ├── app.routes.ts                # Route configuration
│   │   ├── app.ts / app.html / app.css  # Navigation header & layout shell
│   │   └── app.spec.ts                  # Root component unit tests
│   ├── index.html                       # Entry HTML & Bootstrap
│   ├── main.ts                          # Bootstrap entry point
│   └── styles.css                       # High-contrast clinical design & print styles
├── .gitignore
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Installation
```bash
cd Doctor'sChembarClient
npm install
```

### Run Locally
```bash
npm start
```
Open `http://localhost:4300/` in your browser.

### Production Build
```bash
npm run build
```
