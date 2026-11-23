import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient, PatientStatus } from '../../models/patient';

@Component({
  selector: 'app-patient-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-3 mb-4">
      @for (p of patients(); track p.patientId) {
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 patient-clean-card shadow-xs">

            <!-- Card Header: Name, Serial #, and Blood Group -->
            <div class="card-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-0 fw-bold text-dark patient-title" (click)="viewDetail.emit(p)">
                  {{ p.fullName }}
                </h6>
                <div class="text-muted small mt-0.5">
                  <span class="font-monospace text-secondary">{{ p.regNo }}</span>
                  <span class="mx-1">&bull;</span>
                  <span>{{ p.age }} yrs, {{ p.gender }}</span>
                </div>
              </div>

              <span class="badge bg-danger-subtle text-danger border border-danger-subtle fw-bold px-2 py-1">
                {{ p.bloodGroup }}
              </span>
            </div>

            <!-- Card Body: Clean Straightforward Information -->
            <div class="card-body p-3 d-flex flex-column justify-content-between">
              
              <div class="mb-3">
                <!-- Doctor & Chamber Room -->
                <div class="small mb-2">
                  <span class="text-muted">Doctor:</span>
                  <strong class="text-dark ms-1">{{ p.specialty?.doctorName }}</strong>
                  <div class="text-secondary small">
                    {{ p.specialty?.specialtyName }} &bull; Room {{ p.specialty?.roomNo }}
                  </div>
                </div>

                <!-- Problem / Symptoms -->
                <div class="small mb-2">
                  <span class="text-muted">Reason for visit / Symptoms:</span>
                  <div class="text-dark fw-normal mt-0.5 complaint-clean-text">
                    {{ p.chiefComplaint }}
                  </div>
                </div>

                <!-- Basic Health Check -->
                <div class="vitals-clean-box p-2 rounded bg-light border small mb-2">
                  <span class="text-primary fw-bold">BP: {{ p.vitals.bloodPressure }}</span>
                  <span class="mx-1 text-muted">&bull;</span>
                  <span class="text-danger">Pulse: {{ p.vitals.heartRate }} bpm</span>
                  <span class="mx-1 text-muted">&bull;</span>
                  <span class="text-info">Oxygen: {{ p.vitals.spo2 }}%</span>
                </div>

                <!-- Prescriptions & Doctor Fee -->
                <div class="d-flex align-items-center justify-content-between text-muted small pt-1">
                  <span>
                    <i class="bi bi-prescription2 text-primary me-1"></i>
                    <strong>{{ p.prescriptions.length }}</strong> Medicines Prescribed
                  </span>
                  <span>
                    Fee: <strong class="text-dark font-monospace">৳ {{ p.consultationFee }}</strong>
                  </span>
                </div>
              </div>

              <!-- Interactive Visit Status Toggle Buttons -->
              <div class="mt-auto pt-2 border-top">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <span class="text-muted" style="font-size: 0.72rem;">Visit Status:</span>
                  <span class="badge text-uppercase" style="font-size: 0.68rem;" [ngClass]="{
                    'bg-warning text-dark': p.status === 'Waiting',
                    'bg-primary text-white': p.status === 'In-Consultation',
                    'bg-success text-white': p.status === 'Completed',
                    'bg-danger text-white': p.status === 'Critical'
                  }">
                    {{ p.status === 'In-Consultation' ? 'With Doctor' : (p.status === 'Critical' ? 'Emergency' : p.status) }}
                  </span>
                </div>
                <div class="btn-group btn-group-sm w-100 triage-grid-group" role="group" aria-label="Change visit status">
                  <button
                    type="button"
                    class="btn btn-grid-status"
                    [class.active-waiting]="p.status === 'Waiting'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Waiting' })"
                  >
                    Waiting
                  </button>
                  <button
                    type="button"
                    class="btn btn-grid-status"
                    [class.active-consult]="p.status === 'In-Consultation'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'In-Consultation' })"
                  >
                    With Doctor
                  </button>
                  <button
                    type="button"
                    class="btn btn-grid-status"
                    [class.active-done]="p.status === 'Completed'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Completed' })"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    class="btn btn-grid-status"
                    [class.active-critical]="p.status === 'Critical'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Critical' })"
                  >
                    Emergency
                  </button>
                </div>
              </div>

            </div>

            <!-- Card Footer: 3 Clear Simple Buttons -->
            <div class="card-footer bg-light border-top p-2.5 px-3 d-flex align-items-center justify-content-between">
              <button
                type="button"
                class="btn btn-primary btn-sm px-3 fw-semibold"
                (click)="viewDetail.emit(p)"
              >
                <i class="bi bi-file-earmark-medical me-1"></i> View Prescription
              </button>

              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="editPatient.emit(p)"
                  title="Edit Patient Details"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  (click)="deletePatient.emit(p)"
                  title="Delete Patient Record"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      } @empty {
        <div class="col-12 py-5 text-center text-muted bg-white rounded-2 border">
          <i class="bi bi-inbox display-5 mb-2 d-block"></i>
          <h5>No patients in this view</h5>
          <p class="small text-muted mb-0">Try clearing your search query or department filters.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .patient-clean-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      transition: border-color 0.15s ease;
    }

    .patient-clean-card:hover {
      border-color: #0284c7;
    }

    .patient-title {
      cursor: pointer;
      font-size: 0.95rem;
    }

    .patient-title:hover {
      color: #0284c7 !important;
    }

    .complaint-clean-text {
      color: #334155;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .vitals-clean-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    /* Status Grid Group */
    .triage-grid-group {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      overflow: hidden;
    }

    .btn-grid-status {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.35rem;
      border: none;
      border-right: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
    }

    .btn-grid-status:last-child {
      border-right: none;
    }

    .btn-grid-status:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .btn-grid-status.active-waiting {
      background: #f59e0b !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-grid-status.active-consult {
      background: #0284c7 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-grid-status.active-done {
      background: #10b981 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-grid-status.active-critical {
      background: #ef4444 !important;
      color: #ffffff !important;
      font-weight: 700;
    }
  `]
})
export class PatientGridComponent {
  readonly patients = input.required<Patient[]>();

  readonly viewDetail = output<Patient>();
  readonly editPatient = output<Patient>();
  readonly deletePatient = output<Patient>();
  readonly statusChange = output<{ id: number; status: PatientStatus }>();

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
  }
}
