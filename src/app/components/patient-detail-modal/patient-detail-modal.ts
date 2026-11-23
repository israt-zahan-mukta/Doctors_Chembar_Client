import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-patient-detail-modal',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (patient(); as p) {
      <div class="modal-backdrop-blur animate-fade-in" (click)="onBackdropClick($event)">
        <div class="modal-prescription-card shadow-2xl" (click)="$event.stopPropagation()">

          <!-- Top Control Header (Non-printable) -->
          <div class="prescription-top-actions no-print d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-primary px-2.5 py-1.5 rounded-pill">
                <i class="bi bi-file-medical-fill me-1"></i> Doctor's Prescription Slip & Patient Details
              </span>
              <span class="text-muted small">&bull; Serial #: {{ p.regNo }}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-outline-primary btn-sm px-3 rounded-pill" (click)="printPrescription()">
                <i class="bi bi-printer-fill me-1"></i> Print Prescription
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm px-3 rounded-pill" (click)="editPatient.emit(p)">
                <i class="bi bi-pencil me-1"></i> Edit Patient Details
              </button>
              <button type="button" class="btn-close-modal ms-2" (click)="close.emit()" aria-label="Close">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <!-- Official Doctor Chamber Prescription Slip Document (Printable) -->
          <div class="prescription-document p-4 p-md-5">

            <!-- Doctor Chamber Letterhead -->
            <div class="row align-items-center pb-4 mb-4 border-bottom border-2">
              <div class="col-sm-8">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <div class="chamber-emblem">
                    <i class="bi bi-hospital text-white fs-4"></i>
                  </div>
                  <div>
                    <h3 class="doctor-name mb-0 text-dark fw-bold">
                      {{ p.specialty?.doctorName || 'Dr. Specialist Physician' }}
                    </h3>
                    <p class="doctor-credentials mb-0 text-primary small fw-semibold">
                      {{ p.specialty?.degree || 'MBBS, FCPS' }}
                    </p>
                  </div>
                </div>
                <div class="text-secondary small mt-1">
                  <strong>Specialist in:</strong> {{ p.specialty?.specialtyName }}
                </div>
              </div>

              <div class="col-sm-4 text-sm-end mt-3 mt-sm-0">
                <div class="chamber-location-box">
                  <div class="fw-bold text-dark small">MedChamber Healthcare</div>
                  <div class="text-muted small">Room No: {{ p.specialty?.roomNo }}</div>
                  <div class="text-teal small fw-semibold">Visiting Hours: {{ p.specialty?.visitingHours }}</div>
                  <div class="text-muted small">Phone / Hotline: +880 9610-000999</div>
                </div>
              </div>
            </div>

            <!-- Patient Information Bar -->
            <div class="patient-meta-banner p-3 mb-4 rounded-3">
              <div class="row g-2 align-items-center">
                <div class="col-6 col-md-3">
                  <span class="meta-label">Patient Name:</span>
                  <div class="meta-val fw-bold text-dark">{{ p.fullName }}</div>
                </div>
                <div class="col-6 col-md-2">
                  <span class="meta-label">Serial / Reg #:</span>
                  <div class="meta-val font-monospace fw-semibold text-primary">{{ p.regNo }}</div>
                </div>
                <div class="col-4 col-md-2">
                  <span class="meta-label">Age & Gender:</span>
                  <div class="meta-val">{{ p.age }} Yrs / {{ p.gender }}</div>
                </div>
                <div class="col-4 col-md-2">
                  <span class="meta-label">Blood Group:</span>
                  <div>
                    <span class="badge bg-danger text-white fw-bold">{{ p.bloodGroup }}</span>
                  </div>
                </div>
                <div class="col-4 col-md-3 text-md-end">
                  <span class="meta-label">Visit Date:</span>
                  <div class="meta-val font-monospace">{{ p.appointmentDate | date:'mediumDate' }}</div>
                </div>
              </div>
            </div>

            <!-- Basic Health Check Bar (BP, Pulse, Temp, Oxygen, Weight) -->
            <div class="vitals-dashboard-row p-3 mb-4 rounded-3 border">
              <div class="row g-3 text-center">
                <div class="col-6 col-sm-3 col-md">
                  <span class="text-muted small d-block">Blood Pressure</span>
                  <strong class="text-primary fs-5">{{ p.vitals.bloodPressure }}</strong>
                  <span class="text-muted small"> mmHg</span>
                </div>
                <div class="col-6 col-sm-3 col-md">
                  <span class="text-muted small d-block">Pulse / Heart Rate</span>
                  <strong class="text-danger fs-5">{{ p.vitals.heartRate }}</strong>
                  <span class="text-muted small"> bpm</span>
                </div>
                <div class="col-6 col-sm-3 col-md">
                  <span class="text-muted small d-block">Body Temperature</span>
                  <strong class="text-warning fs-5">{{ p.vitals.temperature }}</strong>
                  <span class="text-muted small"> &deg;F</span>
                </div>
                <div class="col-6 col-sm-3 col-md">
                  <span class="text-muted small d-block">Oxygen Level</span>
                  <strong class="text-info fs-5">{{ p.vitals.spo2 }}</strong>
                  <span class="text-muted small"> %</span>
                </div>
                <div class="col-6 col-sm-3 col-md">
                  <span class="text-muted small d-block">Body Weight</span>
                  <strong class="text-success fs-5">{{ p.vitals.weightKg }}</strong>
                  <span class="text-muted small"> kg</span>
                </div>
              </div>
            </div>

            <!-- Problem / Symptoms & Past Illnesses -->
            <div class="row g-4 mb-4">
              <div class="col-md-7">
                <div class="clinical-box p-3 rounded-3 h-100">
                  <h6 class="text-primary fw-bold mb-2">
                    <i class="bi bi-chat-square-text-fill me-1"></i> Patient's Problem / Symptoms:
                  </h6>
                  <p class="text-dark small mb-0">{{ p.chiefComplaint }}</p>
                </div>
              </div>
              <div class="col-md-5">
                <div class="clinical-box p-3 rounded-3 h-100">
                  <h6 class="text-danger fw-bold mb-2">
                    <i class="bi bi-exclamation-octagon-fill me-1"></i> Past Illnesses & Drug Allergies:
                  </h6>
                  <p class="text-secondary small mb-0">{{ p.medicalHistory || 'No major drug allergies reported.' }}</p>
                </div>
              </div>
            </div>

            <!-- Official Rx Section -->
            <div class="prescription-rx-section mb-5">
              <div class="d-flex align-items-center gap-2 mb-3">
                <span class="rx-symbol">℞</span>
                <h5 class="fw-bold text-dark mb-0">Prescribed Medicines & Advice</h5>
              </div>

              <div class="table-responsive">
                <table class="table table-bordered prescription-table align-middle">
                  <thead>
                    <tr>
                      <th style="width: 40px;" class="text-center">#</th>
                      <th>Medicine Name</th>
                      <th>Dose / Strength</th>
                      <th>How Often (Schedule)</th>
                      <th>When to Take</th>
                      <th>How Many Days</th>
                      <th>Doctor's Advice / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rx of p.prescriptions; track $index) {
                      <tr>
                        <td class="text-center fw-bold text-muted">{{ $index + 1 }}</td>
                        <td>
                          <strong class="text-dark">{{ rx.medicineName }}</strong>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark border">{{ rx.dosage }}</span>
                        </td>
                        <td>
                          <span class="fw-semibold text-primary font-monospace">{{ rx.frequency }}</span>
                        </td>
                        <td>
                          <span class="text-secondary small">{{ rx.timing }}</span>
                        </td>
                        <td>
                          <span class="text-secondary small">{{ rx.duration }}</span>
                        </td>
                        <td>
                          <span class="text-muted small">{{ rx.instructions || '-' }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Next Visit Date & Doctor Signature -->
            <div class="row align-items-end pt-4 mt-4 border-top">
              <div class="col-sm-7">
                <div class="follow-up-box p-3 bg-light rounded-3">
                  <div class="fw-bold text-primary small">
                    <i class="bi bi-calendar2-check me-1"></i> Next Doctor Visit Date:
                  </div>
                  <div class="text-dark fw-bold mt-1">
                    {{ p.nextFollowUp | date:'fullDate' }}
                  </div>
                  <small class="text-muted">Please bring this prescription slip and all test reports on your next visit.</small>
                </div>
              </div>
              <div class="col-sm-5 text-sm-end mt-4 mt-sm-0">
                <div class="doctor-signature-area">
                  <div class="signature-line">
                    <span class="fst-italic text-primary fs-5 font-cursive">Dr. {{ p.specialty?.doctorName }}</span>
                  </div>
                  <div class="fw-bold text-dark small mt-1">Doctor's Signature & Seal</div>
                  <div class="text-muted small" style="font-size: 0.72rem;">Chamber Reg. # MED-89412</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop-blur {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .modal-prescription-card {
      background: #ffffff;
      border-radius: 12px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid #cbd5e1;
      position: relative;
    }

    .chamber-emblem {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .doctor-name {
      font-size: 1.35rem;
    }

    .patient-meta-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .meta-label {
      display: block;
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .meta-val {
      font-size: 0.875rem;
      color: #1e293b;
    }

    .vitals-dashboard-row {
      background: #f0fdfa;
      border-color: #ccfbf1 !important;
    }

    .clinical-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .rx-symbol {
      font-family: serif;
      font-size: 2.25rem;
      font-weight: 800;
      color: #0284c7;
      line-height: 1;
    }

    .prescription-table th {
      background: #f8fafc;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #475569;
    }

    .prescription-table td {
      font-size: 0.85rem;
      padding: 0.7rem 0.6rem;
    }

    .signature-line {
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 0.5rem;
      display: inline-block;
      min-width: 200px;
    }

    .font-cursive {
      font-family: 'Brush Script MT', cursive, sans-serif;
    }

    .btn-close-modal {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #64748b;
      cursor: pointer;
    }

    @media print {
      .modal-backdrop-blur {
        position: static !important;
        inset: auto !important;
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        overflow: visible !important;
      }

      .modal-prescription-card {
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        max-height: none !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .prescription-top-actions,
      .no-print,
      .btn-close-modal {
        display: none !important;
      }

      .prescription-document {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
    }
  `]
})
export class PatientDetailModalComponent {
  readonly patient = input<Patient | null>(null);
  readonly close = output<void>();
  readonly editPatient = output<Patient>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  printPrescription(): void {
    window.print();
  }
}
