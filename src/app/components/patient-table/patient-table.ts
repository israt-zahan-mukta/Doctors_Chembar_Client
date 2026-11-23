import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Patient, PatientStatus } from '../../models/patient';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-responsive chamber-table-container shadow-xs">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th class="ps-3" style="width: 55px;">Photo</th>
            <th>Name & Serial #</th>
            <th>Doctor & Room</th>
            <th>Health Check (BP / Pulse / Oxygen)</th>
            <th style="min-width: 250px;">Visit Status (Click to Change)</th>
            <th>Medicines</th>
            <th>Doctor Fee</th>
            <th class="text-end pe-3" style="width: 140px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (p of patients(); track p.patientId) {
            <tr class="table-row-item">
              <!-- Avatar -->
              <td class="ps-3">
                <img
                  [src]="p.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'"
                  [alt]="p.fullName"
                  class="rounded-circle border"
                  style="width: 38px; height: 38px; object-fit: cover;"
                  (error)="handleImageError($event)"
                />
              </td>

              <!-- Name & Demographics -->
              <td>
                <div class="patient-name fw-bold text-dark" (click)="viewDetail.emit(p)">
                  {{ p.fullName }}
                  @if (p.priority === 'Emergency') {
                    <span class="badge bg-danger ms-1 small">URGENT</span>
                  }
                </div>
                <div class="text-muted small mt-0.5">
                  <span class="reg-code">{{ p.regNo }}</span>
                  <span class="mx-1">&bull;</span>
                  <span>{{ p.age }} yrs, {{ p.gender }}</span>
                  <span class="mx-1">&bull;</span>
                  <span class="badge bg-light text-danger border fw-bold">{{ p.bloodGroup }}</span>
                </div>
              </td>

              <!-- Specialty & Doctor -->
              <td>
                <div class="fw-semibold text-dark small">
                  {{ p.specialty?.doctorName }}
                </div>
                <div class="text-muted small">
                  {{ p.specialty?.specialtyName }} &bull; Room {{ p.specialty?.roomNo }}
                </div>
              </td>

              <!-- Vitals Summary (Clean, human readable) -->
              <td>
                <div class="vitals-simple-text small">
                  <div><strong class="text-dark">BP:</strong> {{ p.vitals.bloodPressure }}</div>
                  <div class="text-muted">Pulse: {{ p.vitals.heartRate }} bpm &bull; Oxygen: {{ p.vitals.spo2 }}%</div>
                </div>
              </td>

              <!-- Interactive Visit Status Button Toggle -->
              <td>
                <div class="btn-group btn-group-sm triage-btn-group w-100" role="group" aria-label="Change visit status">
                  <button
                    type="button"
                    class="btn btn-status-pill"
                    [class.active-waiting]="p.status === 'Waiting'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Waiting' })"
                    title="Change status to Waiting"
                  >
                    Waiting
                  </button>
                  <button
                    type="button"
                    class="btn btn-status-pill"
                    [class.active-consult]="p.status === 'In-Consultation'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'In-Consultation' })"
                    title="Change status to With Doctor"
                  >
                    With Doctor
                  </button>
                  <button
                    type="button"
                    class="btn btn-status-pill"
                    [class.active-done]="p.status === 'Completed'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Completed' })"
                    title="Change status to Done"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    class="btn btn-status-pill"
                    [class.active-critical]="p.status === 'Critical'"
                    (click)="statusChange.emit({ id: p.patientId, status: 'Critical' })"
                    title="Change status to Emergency"
                  >
                    Emergency
                  </button>
                </div>
              </td>

              <!-- Prescriptions Preview -->
              <td>
                <div class="fw-semibold small text-primary">
                  <i class="bi bi-prescription2 me-1"></i>{{ p.prescriptions.length }} Medicine(s)
                </div>
                <div class="text-muted small text-truncate" style="max-width: 140px;">
                  {{ p.prescriptions[0]?.medicineName || 'No medicines' }}
                </div>
              </td>

              <!-- Doctor Fee -->
              <td>
                <div class="fw-bold text-dark font-monospace small">৳ {{ p.consultationFee }}</div>
                <span class="badge bg-success-subtle text-success small" style="font-size: 0.68rem;">Paid</span>
              </td>

              <!-- Actions -->
              <td class="text-end pe-3">
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    (click)="viewDetail.emit(p)"
                    title="View Doctor's Prescription Slip"
                  >
                    <i class="bi bi-file-earmark-medical"></i>
                  </button>
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
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="8" class="py-5 text-center text-muted">
                <i class="bi bi-inbox display-6 mb-2 d-block"></i>
                <h6 class="fw-bold text-secondary">No Matching Patients Found</h6>
                <p class="small text-muted mb-0">Try clearing search filters or click '+ Register Patient'.</p>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .chamber-table-container {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .table thead th {
      background: #f1f5f9;
      font-size: 0.78rem;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 2px solid #cbd5e1;
      padding: 0.75rem 0.75rem;
    }

    .table tbody td {
      padding: 0.75rem 0.75rem;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.875rem;
      background: #ffffff;
      color: #1e293b;
    }

    .patient-name {
      cursor: pointer;
    }

    .patient-name:hover {
      color: #0284c7 !important;
    }

    .reg-code {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #475569;
    }

    /* Status Toggle Button Group */
    .triage-btn-group {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    .btn-status-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.45rem;
      border: none;
      border-right: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      transition: all 0.15s ease;
    }

    .btn-status-pill:last-child {
      border-right: none;
    }

    .btn-status-pill:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .btn-status-pill.active-waiting {
      background: #f59e0b !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-status-pill.active-consult {
      background: #0284c7 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-status-pill.active-done {
      background: #10b981 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-status-pill.active-critical {
      background: #ef4444 !important;
      color: #ffffff !important;
      font-weight: 700;
    }
  `]
})
export class PatientTableComponent {
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
