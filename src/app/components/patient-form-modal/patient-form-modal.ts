import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BloodGroup, Gender, Patient, PatientPriority, PatientStatus, PrescriptionItem, Specialty } from '../../models/patient';

@Component({
  selector: 'app-patient-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop-blur animate-fade-in" (click)="onBackdropClick($event)">
      <div class="modal-card shadow-2xl" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="modal-header d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <div class="header-icon">
              <i class="bi" [class]="isEditMode() ? 'bi-pencil-square' : 'bi-person-plus-fill'"></i>
            </div>
            <div>
              <h5 class="modal-title mb-0 text-white">
                {{ isEditMode() ? 'Edit Patient Record #' + patientToEdit()?.regNo : 'New Patient Registration' }}
              </h5>
              <p class="modal-sub mb-0 text-white-50">
                {{ isEditMode() ? 'Update patient details, health check readings, and prescribed medicines' : 'Fill Section 1 to quickly register patient. Optional health check & medicines can be added below.' }}
              </p>
            </div>
          </div>
          <button type="button" class="btn-close-modal text-white" (click)="close.emit()" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" class="modal-body p-3 p-md-4">

          <!-- ======================================================== -->
          <!-- SECTION 1 (HIGHLIGHTED): BASIC PATIENT INFO & VISIT REASON -->
          <!-- ======================================================== -->
          <div class="primary-section-card mb-4 p-3 p-md-4 rounded-3">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary px-2.5 py-1.5 fw-bold">
                  <i class="bi bi-star-fill me-1 text-warning"></i> SECTION 1 (MAIN)
                </span>
                <span class="fw-bold text-dark fs-6">Basic Patient Information & Visit Reason</span>
              </div>
              <span class="badge bg-light text-danger border fw-normal small">* Required Fields</span>
            </div>

            <div class="row g-3">
              <!-- Full Name -->
              <div class="col-md-6">
                <label class="form-label fw-bold small text-dark mb-1">
                  Patient Full Name <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="fullName"
                  placeholder="e.g. Farhana Yasmin"
                  [class.is-invalid]="isFieldInvalid('fullName')"
                />
                @if (isFieldInvalid('fullName')) {
                  <div class="invalid-feedback">Patient full name is required (min 3 chars).</div>
                }
              </div>

              <!-- Phone -->
              <div class="col-md-6">
                <label class="form-label fw-bold small text-dark mb-1">
                  Phone / Mobile Number <span class="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  class="form-control"
                  formControlName="phone"
                  placeholder="+880 1700-000000"
                  [class.is-invalid]="isFieldInvalid('phone')"
                />
                @if (isFieldInvalid('phone')) {
                  <div class="invalid-feedback">Valid phone number is required.</div>
                }
              </div>

              <!-- Age -->
              <div class="col-6 col-md-3">
                <label class="form-label fw-bold small text-dark mb-1">
                  Age (Years) <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  class="form-control"
                  formControlName="age"
                  min="0"
                  max="125"
                  [class.is-invalid]="isFieldInvalid('age')"
                />
              </div>

              <!-- Gender -->
              <div class="col-6 col-md-3">
                <label class="form-label fw-bold small text-dark mb-1">
                  Gender <span class="text-danger">*</span>
                </label>
                <select class="form-select" formControlName="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Blood Group -->
              <div class="col-6 col-md-3">
                <label class="form-label fw-bold small text-dark mb-1">
                  Blood Group <span class="text-danger">*</span>
                </label>
                <select class="form-select" formControlName="bloodGroup">
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <!-- Doctor Visit Fee -->
              <div class="col-6 col-md-3">
                <label class="form-label fw-bold small text-dark mb-1">
                  Doctor Visit Fee (৳) <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  class="form-control font-monospace"
                  formControlName="consultationFee"
                  min="0"
                  step="100"
                />
              </div>

              <!-- Doctor & Department -->
              <div class="col-md-6">
                <label class="form-label fw-bold small text-dark mb-1">
                  Doctor & Department <span class="text-danger">*</span>
                </label>
                <select class="form-select" formControlName="specialtyId">
                  @for (s of specialties(); track s.specialtyId) {
                    <option [value]="s.specialtyId">{{ s.doctorName }} — {{ s.specialtyName }} (Room {{ s.roomNo }})</option>
                  }
                </select>
              </div>

              <!-- Urgency -->
              <div class="col-md-6">
                <label class="form-label fw-bold small text-dark mb-1">
                  Visit Urgency <span class="text-danger">*</span>
                </label>
                <select class="form-select" formControlName="priority">
                  <option value="Normal">Normal Queue</option>
                  <option value="Urgent">Urgent Case</option>
                  <option value="Emergency">Emergency (Immediate Care)</option>
                </select>
              </div>

              <!-- Problem / Reason for visit -->
              <div class="col-12">
                <label class="form-label fw-bold small text-dark mb-1">
                  Main Problem / Symptoms (Reason for Visit) <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="chiefComplaint"
                  placeholder="e.g. Fever, persistent cough for 4 days, chest discomfort"
                  [class.is-invalid]="isFieldInvalid('chiefComplaint')"
                />
                @if (isFieldInvalid('chiefComplaint')) {
                  <div class="invalid-feedback">Please enter the patient's problem or symptom.</div>
                }
              </div>

              <!-- Visit Status Button Toggle -->
              <div class="col-12">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <label class="form-label fw-bold small text-dark mb-0">
                    <i class="bi bi-toggles2 text-primary me-1"></i> Current Visit Status:
                  </label>
                  <span class="small text-muted">Click a button below to change status</span>
                </div>
                
                <div class="btn-group w-100 triage-toggle-group" role="group" aria-label="Change visit status">
                  <button
                    type="button"
                    class="btn btn-triage"
                    [class.active-waiting]="patientForm.get('status')?.value === 'Waiting'"
                    (click)="setStatus('Waiting')"
                  >
                    <i class="bi bi-clock-history me-1"></i> Waiting
                  </button>
                  <button
                    type="button"
                    class="btn btn-triage"
                    [class.active-consult]="patientForm.get('status')?.value === 'In-Consultation'"
                    (click)="setStatus('In-Consultation')"
                  >
                    <i class="bi bi-person-workspace me-1"></i> With Doctor
                  </button>
                  <button
                    type="button"
                    class="btn btn-triage"
                    [class.active-done]="patientForm.get('status')?.value === 'Completed'"
                    (click)="setStatus('Completed')"
                  >
                    <i class="bi bi-check-circle-fill me-1"></i> Done
                  </button>
                  <button
                    type="button"
                    class="btn btn-triage"
                    [class.active-critical]="patientForm.get('status')?.value === 'Critical'"
                    (click)="setStatus('Critical')"
                  >
                    <i class="bi bi-exclamation-triangle-fill me-1"></i> Emergency
                  </button>
                </div>
                <div class="d-flex align-items-center gap-2 mt-1">
                  <span class="small text-muted">Selected Status:</span>
                  <span class="badge text-uppercase" [ngClass]="{
                    'bg-warning text-dark': patientForm.get('status')?.value === 'Waiting',
                    'bg-primary text-white': patientForm.get('status')?.value === 'In-Consultation',
                    'bg-success text-white': patientForm.get('status')?.value === 'Completed',
                    'bg-danger text-white': patientForm.get('status')?.value === 'Critical'
                  }">
                    {{ patientForm.get('status')?.value === 'In-Consultation' ? 'With Doctor' : (patientForm.get('status')?.value === 'Critical' ? 'Emergency' : patientForm.get('status')?.value) }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- ======================================================== -->
          <!-- OPTION 1: BASIC HEALTH CHECK (OPTIONAL EXTENSION)        -->
          <!-- ======================================================== -->
          <div class="optional-card mb-3 rounded-3 border">
            <div
              class="optional-header d-flex justify-content-between align-items-center p-3 cursor-pointer"
              (click)="toggleVitals()"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-heart-pulse-fill text-danger fs-5"></i>
                <div>
                  <span class="fw-bold text-dark">Option 1: Basic Health Check (Optional)</span>
                  <span class="text-muted small ms-2">(Blood Pressure, Pulse, Fever / Temp, Oxygen, Weight)</span>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary py-1 px-3 fw-semibold"
                (click)="$event.stopPropagation(); toggleVitals()"
              >
                {{ showVitals() ? '− Hide Health Check' : '+ Add Health Check (Optional)' }}
              </button>
            </div>

            @if (showVitals()) {
              <div class="p-3 border-top bg-light-soft" formGroupName="vitals">
                <p class="small text-muted mb-2">Record basic health checkup numbers:</p>
                <div class="row g-2">
                  <div class="col-sm-3">
                    <label class="form-label small fw-semibold text-muted mb-1">Blood Pressure (BP)</label>
                    <input type="text" class="form-control form-control-sm font-monospace" formControlName="bloodPressure" placeholder="120/80" />
                  </div>
                  <div class="col-sm-2">
                    <label class="form-label small fw-semibold text-muted mb-1">Pulse (bpm)</label>
                    <input type="number" class="form-control form-control-sm" formControlName="heartRate" placeholder="75" />
                  </div>
                  <div class="col-sm-2">
                    <label class="form-label small fw-semibold text-muted mb-1">Fever / Temp (°F)</label>
                    <input type="number" step="0.1" class="form-control form-control-sm" formControlName="temperature" placeholder="98.6" />
                  </div>
                  <div class="col-sm-2">
                    <label class="form-label small fw-semibold text-muted mb-1">Oxygen - SpO2 (%)</label>
                    <input type="number" class="form-control form-control-sm" formControlName="spo2" placeholder="98" />
                  </div>
                  <div class="col-sm-3">
                    <label class="form-label small fw-semibold text-muted mb-1">Body Weight (kg)</label>
                    <input type="number" step="0.5" class="form-control form-control-sm" formControlName="weightKg" placeholder="65" />
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- ======================================================== -->
          <!-- OPTION 2: PRESCRIBED MEDICINES & ADVICE (OPTIONAL)        -->
          <!-- ======================================================== -->
          <div class="optional-card mb-3 rounded-3 border">
            <div
              class="optional-header d-flex justify-content-between align-items-center p-3 cursor-pointer"
              (click)="togglePrescriptions()"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-prescription2 text-primary fs-5"></i>
                <div>
                  <span class="fw-bold text-dark">Option 2: Prescribed Medicines & Advice (Optional)</span>
                  <span class="badge bg-light text-secondary border ms-2">
                    {{ prescriptionsArray.length }} Medicine(s)
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary py-1 px-3 fw-semibold"
                (click)="$event.stopPropagation(); togglePrescriptions()"
              >
                {{ showPrescriptions() ? '− Hide Medicines' : '+ Add Medicines (Optional)' }}
              </button>
            </div>

            @if (showPrescriptions()) {
              <div class="p-3 border-top bg-light-soft" formArrayName="prescriptions">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <p class="small text-muted mb-0">Doctor's medicine orders and how to take them:</p>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary fw-semibold"
                    (click)="addPrescriptionRow()"
                  >
                    <i class="bi bi-plus-circle me-1"></i> + Add Another Medicine
                  </button>
                </div>

                @for (rxGroup of prescriptionsArray.controls; track $index) {
                  <div [formGroupName]="$index" class="p-2.5 mb-2 rounded-2 border bg-white">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="small fw-bold text-primary">Medicine #{{ $index + 1 }}</span>
                      @if (prescriptionsArray.length > 1) {
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger py-0 px-2"
                          (click)="removePrescriptionRow($index)"
                        >
                          <i class="bi bi-trash me-1"></i> Remove
                        </button>
                      }
                    </div>

                    <div class="row g-2">
                      <div class="col-md-5">
                        <label class="form-label small text-muted mb-0">Medicine Name <span class="text-danger">*</span></label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          formControlName="medicineName"
                          placeholder="e.g. Tab. Paracetamol"
                        />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label small text-muted mb-0">Dose / Strength</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          formControlName="dosage"
                          placeholder="e.g. 500 mg"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-muted mb-0">How Often (Schedule)</label>
                        <input
                          type="text"
                          class="form-control form-control-sm font-monospace"
                          formControlName="frequency"
                          placeholder="1 + 0 + 1"
                        />
                        <div class="quick-freq-tags mt-1">
                          <span class="badge freq-pill" (click)="setFreq($index, '1 + 0 + 1')" title="Morning and Night">1+0+1</span>
                          <span class="badge freq-pill" (click)="setFreq($index, '1 + 0 + 0')" title="Morning only">1+0+0</span>
                          <span class="badge freq-pill" (click)="setFreq($index, '0 + 0 + 1')" title="Night only">0+0+1</span>
                          <span class="badge freq-pill" (click)="setFreq($index, '1 + 1 + 1')" title="3 times daily">1+1+1</span>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-muted mb-0">How Many Days</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          formControlName="duration"
                          placeholder="e.g. 7 Days"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-muted mb-0">When to Take</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          formControlName="timing"
                          placeholder="e.g. After meals"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-muted mb-0">Doctor's Advice / Notes</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          formControlName="instructions"
                          placeholder="e.g. Drink plenty of water"
                        />
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- ======================================================== -->
          <!-- OPTION 3: ADDITIONAL CONTACT & PAST ILLNESSES (OPTIONAL) -->
          <!-- ======================================================== -->
          <div class="optional-card mb-4 rounded-3 border">
            <div
              class="optional-header d-flex justify-content-between align-items-center p-3 cursor-pointer"
              (click)="toggleMoreDetails()"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-card-text text-secondary fs-5"></i>
                <div>
                  <span class="fw-bold text-dark">Option 3: Additional Contact & Past Illnesses (Optional)</span>
                  <span class="text-muted small ms-2">(Address, Email, Serial #, Next Visit Date)</span>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary py-1 px-3 fw-semibold"
                (click)="$event.stopPropagation(); toggleMoreDetails()"
              >
                {{ showMoreDetails() ? '− Hide Extra' : '+ Add Extra Details (Optional)' }}
              </button>
            </div>

            @if (showMoreDetails()) {
              <div class="p-3 border-top bg-light-soft">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label fw-bold small text-dark mb-1">Patient Serial / Reg #</label>
                    <input type="text" class="form-control font-monospace form-control-sm" formControlName="regNo" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold small text-dark mb-1">Email Address</label>
                    <input type="email" class="form-control form-control-sm" formControlName="email" placeholder="patient@example.com" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold small text-dark mb-1">Emergency Contact Phone</label>
                    <input type="text" class="form-control form-control-sm" formControlName="emergencyContact" placeholder="+880 1800-000000" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-dark mb-1">Home Address</label>
                    <input type="text" class="form-control form-control-sm" formControlName="address" placeholder="e.g. Dhanmondi, Dhaka" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-dark mb-1">Next Doctor Visit Date</label>
                    <input type="date" class="form-control form-control-sm" formControlName="nextFollowUp" />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold small text-dark mb-1">Past Illnesses & Known Medicine Allergies</label>
                    <textarea class="form-control form-control-sm" rows="2" formControlName="medicalHistory" placeholder="e.g. High blood pressure 3 yrs; allergic to penicillin"></textarea>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Modal Footer Actions -->
          <div class="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="button" class="btn btn-secondary px-4 fw-semibold" (click)="close.emit()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2"
              [disabled]="isSubmitting() || patientForm.invalid"
            >
              @if (isSubmitting()) {
                <span class="spinner-border spinner-border-sm" role="status"></span>
                <span>Saving...</span>
              } @else {
                <i class="bi bi-check2-circle fs-5"></i>
                <span>{{ isEditMode() ? 'Save Changes' : 'Register Patient' }}</span>
              }
            </button>
          </div>

        </form>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop-blur {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .modal-card {
      background: #ffffff;
      border-radius: 12px;
      max-width: 860px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid #cbd5e1;
    }

    .modal-header {
      background: #0f2b46;
      padding: 1rem 1.5rem;
      border-bottom: 2px solid #0284c7;
    }

    .header-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #38bdf8;
    }

    .modal-title {
      font-weight: 700;
      font-size: 1.1rem;
    }

    .modal-sub {
      font-size: 0.775rem;
    }

    .btn-close-modal {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
    }

    /* Highlighted Section 1 */
    .primary-section-card {
      background: #f8fafc;
      border: 2px solid #0284c7;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
    }

    /* Status Toggle Button Group */
    .triage-toggle-group {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    .btn-triage {
      background: #ffffff;
      color: #475569;
      border: none;
      border-right: 1px solid #cbd5e1;
      padding: 0.45rem 0.75rem;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.15s ease;
    }

    .btn-triage:last-child {
      border-right: none;
    }

    .btn-triage:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .btn-triage.active-waiting {
      background: #f59e0b !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-triage.active-consult {
      background: #0284c7 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-triage.active-done {
      background: #10b981 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .btn-triage.active-critical {
      background: #ef4444 !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    /* Optional Cards */
    .optional-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
    }

    .optional-header {
      background: #f8fafc;
      transition: background 0.15s;
    }

    .optional-header:hover {
      background: #f1f5f9;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .bg-light-soft {
      background: #f8fafc;
    }

    .freq-pill {
      background: #e2e8f0;
      color: #334155;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      cursor: pointer;
      margin-right: 3px;
    }

    .freq-pill:hover {
      background: #0284c7;
      color: #ffffff;
    }
  `]
})
export class PatientFormModalComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  readonly specialties = input.required<Specialty[]>();
  readonly patientToEdit = input<Patient | null>(null);
  readonly isSubmitting = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<{ data: Omit<Patient, 'patientId'>; id?: number }>();

  readonly isEditMode = signal<boolean>(false);
  readonly showVitals = signal<boolean>(false);
  readonly showPrescriptions = signal<boolean>(false);
  readonly showMoreDetails = signal<boolean>(false);

  patientForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientToEdit'] && this.patientForm) {
      const p = this.patientToEdit();
      if (p) {
        this.isEditMode.set(true);
        this.patchFormWithPatient(p);
      } else {
        this.isEditMode.set(false);
        this.resetForm();
      }
    }
  }

  toggleVitals(): void {
    this.showVitals.update(v => !v);
  }

  togglePrescriptions(): void {
    this.showPrescriptions.update(v => !v);
  }

  toggleMoreDetails(): void {
    this.showMoreDetails.update(v => !v);
  }

  setStatus(status: PatientStatus): void {
    this.patientForm.patchValue({ status });
    this.patientForm.get('status')?.markAsDirty();
  }

  private initForm(): void {
    this.patientForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      regNo: [`DOC-2026-${Math.floor(100 + Math.random() * 900)}`, [Validators.required]],
      age: [35, [Validators.required, Validators.min(0), Validators.max(125)]],
      gender: ['Male' as Gender, Validators.required],
      bloodGroup: ['B+' as BloodGroup, Validators.required],
      phone: ['', [Validators.required]],
      email: [''],
      address: [''],
      emergencyContact: [''],
      avatarUrl: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'],
      specialtyId: [1, Validators.required],
      status: ['Waiting' as PatientStatus, Validators.required],
      priority: ['Normal' as PatientPriority, Validators.required],
      consultationFee: [1200, [Validators.required, Validators.min(0)]],
      chiefComplaint: ['', Validators.required],
      medicalHistory: [''],
      appointmentDate: [new Date().toISOString().slice(0, 16)],
      nextFollowUp: [new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)],
      vitals: this.fb.group({
        bloodPressure: ['120/80'],
        heartRate: [76],
        temperature: [98.6],
        spo2: [98],
        weightKg: [65]
      }),
      prescriptions: this.fb.array([])
    });

    const p = this.patientToEdit();
    if (p) {
      this.isEditMode.set(true);
      this.patchFormWithPatient(p);
    } else {
      this.addPrescriptionRow({
        medicineName: 'Tab. Paracetamol',
        dosage: '500 mg',
        frequency: '1 + 1 + 1',
        duration: '5 Days',
        timing: 'After meals',
        instructions: 'Take if fever occurs'
      });
    }
  }

  get prescriptionsArray(): FormArray {
    return this.patientForm.get('prescriptions') as FormArray;
  }

  addPrescriptionRow(item?: Partial<PrescriptionItem>): void {
    const rxGroup = this.fb.group({
      prescriptionId: [item?.prescriptionId || null],
      medicineName: [item?.medicineName || '', Validators.required],
      dosage: [item?.dosage || '500 mg'],
      frequency: [item?.frequency || '1 + 0 + 1'],
      duration: [item?.duration || '7 Days'],
      timing: [item?.timing || 'After meal'],
      instructions: [item?.instructions || '']
    });
    this.prescriptionsArray.push(rxGroup);
  }

  removePrescriptionRow(index: number): void {
    this.prescriptionsArray.removeAt(index);
  }

  setFreq(index: number, freq: string): void {
    const row = this.prescriptionsArray.at(index);
    if (row) {
      row.patchValue({ frequency: freq });
    }
  }

  private patchFormWithPatient(p: Patient): void {
    this.prescriptionsArray.clear();
    p.prescriptions?.forEach(rx => this.addPrescriptionRow(rx));

    this.patientForm.patchValue({
      fullName: p.fullName,
      regNo: p.regNo,
      age: p.age,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      phone: p.phone,
      email: p.email,
      address: p.address,
      emergencyContact: p.emergencyContact,
      avatarUrl: p.avatarUrl,
      specialtyId: p.specialtyId,
      status: p.status,
      priority: p.priority,
      consultationFee: p.consultationFee,
      chiefComplaint: p.chiefComplaint,
      medicalHistory: p.medicalHistory,
      appointmentDate: p.appointmentDate ? p.appointmentDate.slice(0, 16) : '',
      nextFollowUp: p.nextFollowUp ? p.nextFollowUp.slice(0, 10) : '',
      vitals: {
        bloodPressure: p.vitals?.bloodPressure || '120/80',
        heartRate: p.vitals?.heartRate || 75,
        temperature: p.vitals?.temperature || 98.6,
        spo2: p.vitals?.spo2 || 98,
        weightKg: p.vitals?.weightKg || 65
      }
    });

    if (p.vitals && (p.vitals.bloodPressure || p.vitals.heartRate)) {
      this.showVitals.set(true);
    }
    if (p.prescriptions && p.prescriptions.length > 0) {
      this.showPrescriptions.set(true);
    }
    if (p.address || p.medicalHistory || p.emergencyContact) {
      this.showMoreDetails.set(true);
    }
  }

  private resetForm(): void {
    this.prescriptionsArray.clear();
    this.patientForm.reset({
      regNo: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      gender: 'Male',
      bloodGroup: 'B+',
      specialtyId: 1,
      status: 'Waiting',
      priority: 'Normal',
      consultationFee: 1200,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      appointmentDate: new Date().toISOString().slice(0, 16),
      nextFollowUp: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      vitals: {
        bloodPressure: '120/80',
        heartRate: 76,
        temperature: 98.6,
        spo2: 98,
        weightKg: 65
      }
    });
    this.addPrescriptionRow({
      medicineName: 'Tab. Paracetamol',
      dosage: '500 mg',
      frequency: '1 + 1 + 1',
      duration: '5 Days',
      timing: 'After meals'
    });
    this.showVitals.set(false);
    this.showPrescriptions.set(false);
    this.showMoreDetails.set(false);
  }

  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.patientForm.get(fieldName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const formVal = this.patientForm.value;
    const patientData: Omit<Patient, 'patientId'> = {
      fullName: formVal.fullName,
      regNo: formVal.regNo,
      age: Number(formVal.age),
      gender: formVal.gender,
      bloodGroup: formVal.bloodGroup,
      phone: formVal.phone,
      email: formVal.email || '',
      address: formVal.address || '',
      emergencyContact: formVal.emergencyContact || '',
      avatarUrl: formVal.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      specialtyId: Number(formVal.specialtyId),
      status: formVal.status,
      priority: formVal.priority,
      consultationFee: Number(formVal.consultationFee),
      appointmentDate: formVal.appointmentDate,
      nextFollowUp: formVal.nextFollowUp,
      chiefComplaint: formVal.chiefComplaint,
      medicalHistory: formVal.medicalHistory || '',
      vitals: {
        bloodPressure: formVal.vitals?.bloodPressure || '120/80',
        heartRate: Number(formVal.vitals?.heartRate) || 75,
        temperature: Number(formVal.vitals?.temperature) || 98.6,
        spo2: Number(formVal.vitals?.spo2) || 98,
        weightKg: Number(formVal.vitals?.weightKg) || 65
      },
      prescriptions: formVal.prescriptions || []
    };

    const editPatient = this.patientToEdit();
    this.save.emit({
      data: patientData,
      id: editPatient?.patientId
    });
  }
}
