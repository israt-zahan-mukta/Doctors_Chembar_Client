import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast show animate-slide-up shadow-lg border-0 mb-2 toast-{{ t.type }}" role="alert">
          <div class="toast-header-custom d-flex align-items-center justify-content-between p-2 px-3">
            <div class="d-flex align-items-center gap-2">
              @switch (t.type) {
                @case ('success') {
                  <i class="bi bi-check-circle-fill text-success fs-6"></i>
                }
                @case ('danger') {
                  <i class="bi bi-exclamation-octagon-fill text-danger fs-6"></i>
                }
                @case ('warning') {
                  <i class="bi bi-exclamation-triangle-fill text-warning fs-6"></i>
                }
                @case ('info') {
                  <i class="bi bi-info-circle-fill text-primary fs-6"></i>
                }
              }
              <strong class="toast-title small">{{ t.title }}</strong>
            </div>
            <button
              type="button"
              class="btn-close-toast"
              (click)="toastService.dismiss(t.id)"
              aria-label="Close"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="toast-body-custom px-3 pb-2 pt-1 text-secondary small">
            {{ t.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack-container {
      max-width: 380px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }

    .toast-success { border-left: 4px solid #10b981; }
    .toast-danger { border-left: 4px solid #f43f5e; }
    .toast-warning { border-left: 4px solid #f59e0b; }
    .toast-info { border-left: 4px solid #0284c7; }

    .toast-header-custom {
      background: transparent;
      border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    }

    .btn-close-toast {
      background: none;
      border: none;
      font-size: 1.1rem;
      line-height: 1;
      color: #94a3b8;
      cursor: pointer;
      padding: 0;
    }

    .btn-close-toast:hover {
      color: #334155;
    }

    .animate-slide-up {
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
