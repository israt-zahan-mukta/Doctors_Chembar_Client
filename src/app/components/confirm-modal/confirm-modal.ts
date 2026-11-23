import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (patient(); as p) {
      <div class="modal-backdrop-blur animate-fade-in" (click)="onBackdropClick($event)">
        <div class="modal-card shadow-xl" (click)="$event.stopPropagation()">
          <div class="modal-card-icon-wrapper">
            <div class="modal-card-icon">
              <i class="bi bi-trash3-fill text-danger"></i>
            </div>
          </div>

          <div class="modal-card-content text-center">
            <h4 class="fw-bold text-dark mb-2">Delete Patient Record?</h4>
            <p class="text-secondary small mb-3">
              Are you sure you want to remove patient <strong class="text-dark">"{{ p.fullName }}"</strong>
              (Serial #: <code class="text-primary">{{ p.regNo }}</code>)?
            </p>
            <div class="alert alert-warning py-2 px-3 small text-start border-0 rounded-3 mb-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>
              This will remove this patient from the queue along with their health check numbers and <strong>{{ p.prescriptions?.length || 0 }}</strong> prescribed medicines.
            </div>

            <div class="d-flex gap-2 justify-content-center">
              <button type="button" class="btn btn-secondary px-4 rounded-3 fw-medium" (click)="cancelled.emit()">
                Cancel
              </button>
              <button type="button" class="btn btn-danger px-4 rounded-3 fw-semibold shadow-sm" (click)="confirmed.emit()">
                <i class="bi bi-trash3 me-1"></i> Yes, Delete Patient
              </button>
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
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1060;
      padding: 1.5rem;
    }

    .modal-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem 1.75rem;
      max-width: 440px;
      width: 100%;
      border: 1px solid #cbd5e1;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-card-icon-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .modal-card-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #fee2e2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: 2px solid #fca5a5;
    }
  `]
})
export class ConfirmModalComponent {
  readonly patient = input<Patient | null>(null);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelled.emit();
    }
  }
}
