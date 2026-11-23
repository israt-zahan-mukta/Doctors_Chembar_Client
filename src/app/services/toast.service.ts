import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  show(type: ToastMessage['type'], title: string, message: string, durationMs = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: ToastMessage = { id, type, title, message };

    this._toasts.update(current => [...current, toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  showSuccess(message: string, title = 'Operation Successful'): void {
    this.show('success', title, message);
  }

  showError(message: string, title = 'Error Occurred'): void {
    this.show('danger', title, message, 6000);
  }

  showWarning(message: string, title = 'Attention'): void {
    this.show('warning', title, message, 5000);
  }

  showInfo(message: string, title = 'Information'): void {
    this.show('info', title, message);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }
}
