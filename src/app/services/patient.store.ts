import { Injectable, computed, inject, signal } from '@angular/core';
import { PatientService } from './patient.service';
import { ToastService } from './toast.service';
import {
  ChamberStats,
  Patient,
  PatientFilters,
  PatientPriority,
  PatientSortOption,
  PatientStatus,
  PriorityFilter,
  Specialty,
  StatusFilter,
  ViewMode
} from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientStore {
  private readonly patientService = inject(PatientService);
  private readonly toast = inject(ToastService);

  // --- State Signals ---
  private readonly _patients = signal<Patient[]>([]);
  private readonly _specialties = signal<Specialty[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isSubmitting = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- Filter and View State ---
  private readonly _filters = signal<PatientFilters>({
    searchTerm: '',
    specialtyId: null,
    status: 'all',
    priority: 'all',
    sortBy: 'queue'
  });
  private readonly _viewMode = signal<ViewMode>('table');

  // --- Modals State ---
  private readonly _isFormOpen = signal<boolean>(false);
  private readonly _isDetailOpen = signal<boolean>(false);
  private readonly _patientToEdit = signal<Patient | null>(null);
  private readonly _selectedPatient = signal<Patient | null>(null);
  private readonly _patientToDelete = signal<Patient | null>(null);

  // --- Public Readonly Signals ---
  public readonly patients = this._patients.asReadonly();
  public readonly specialties = this._specialties.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly isSubmitting = this._isSubmitting.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly filters = this._filters.asReadonly();
  public readonly viewMode = this._viewMode.asReadonly();
  public readonly isFormOpen = this._isFormOpen.asReadonly();
  public readonly isDetailOpen = this._isDetailOpen.asReadonly();
  public readonly patientToEdit = this._patientToEdit.asReadonly();
  public readonly selectedPatient = this._selectedPatient.asReadonly();
  public readonly patientToDelete = this._patientToDelete.asReadonly();

  // --- Computed State: Filtered & Sorted Patients ---
  public readonly filteredPatients = computed<Patient[]>(() => {
    const list = this._patients();
    const { searchTerm, specialtyId, status, priority, sortBy } = this._filters();

    let result = [...list];

    // Search filter: matches name, registration number, phone, disease, or medicine
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(p => {
        const matchesName = p.fullName.toLowerCase().includes(term);
        const matchesReg = p.regNo.toLowerCase().includes(term);
        const matchesPhone = p.phone.toLowerCase().includes(term);
        const matchesComplaint = p.chiefComplaint ? p.chiefComplaint.toLowerCase().includes(term) : false;
        const matchesSpecialty = p.specialty?.specialtyName.toLowerCase().includes(term) || false;
        const matchesMedicine = p.prescriptions?.some(m => m.medicineName.toLowerCase().includes(term));
        return matchesName || matchesReg || matchesPhone || matchesComplaint || matchesSpecialty || matchesMedicine;
      });
    }

    // Specialty filter
    if (specialtyId !== null) {
      result = result.filter(p => p.specialtyId === specialtyId);
    }

    // Status filter
    if (status !== 'all') {
      if (status === 'waiting') result = result.filter(p => p.status === 'Waiting');
      else if (status === 'in_consultation') result = result.filter(p => p.status === 'In-Consultation');
      else if (status === 'completed') result = result.filter(p => p.status === 'Completed');
      else if (status === 'critical') result = result.filter(p => p.status === 'Critical');
    }

    // Priority filter
    if (priority !== 'all') {
      if (priority === 'emergency') result = result.filter(p => p.priority === 'Emergency');
      else if (priority === 'urgent') result = result.filter(p => p.priority === 'Urgent');
      else if (priority === 'normal') result = result.filter(p => p.priority === 'Normal');
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'queue': {
          const prioScore = (p: Patient) => (p.priority === 'Emergency' ? 3 : p.priority === 'Urgent' ? 2 : 1);
          const diff = prioScore(b) - prioScore(a);
          if (diff !== 0) return diff;
          return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
        }
        case 'age-asc':
          return a.age - b.age;
        case 'fee-desc':
          return b.consultationFee - a.consultationFee;
        case 'priority': {
          const map: Record<PatientPriority, number> = { Emergency: 3, Urgent: 2, Normal: 1 };
          return map[b.priority] - map[a.priority];
        }
        default:
          return 0;
      }
    });

    return result;
  });

  // --- Computed State: Chamber Statistics ---
  public readonly stats = computed<ChamberStats>(() => {
    const list = this._patients();
    const specialtiesCount = this._specialties().length;

    let waitingCount = 0;
    let inConsultationCount = 0;
    let completedCount = 0;
    let criticalCount = 0;
    let totalRevenue = 0;
    let totalPrescriptionsGiven = 0;

    for (const p of list) {
      if (p.status === 'Waiting') waitingCount++;
      else if (p.status === 'In-Consultation') inConsultationCount++;
      else if (p.status === 'Completed') completedCount++;
      else if (p.status === 'Critical') criticalCount++;

      totalRevenue += p.consultationFee || 0;
      totalPrescriptionsGiven += p.prescriptions?.length || 0;
    }

    return {
      totalPatients: list.length,
      waitingCount,
      inConsultationCount,
      completedCount,
      criticalCount,
      totalRevenue,
      totalPrescriptionsGiven,
      specialtiesCount
    };
  });

  // --- Data Loading Actions ---
  loadInitialData(): void {
    this.loadSpecialties();
    this.loadPatients();
  }

  loadSpecialties(): void {
    this.patientService.getSpecialties().subscribe({
      next: (specs) => this._specialties.set(specs),
      error: (err) => console.error('Failed to load specialties', err)
    });
  }

  loadPatients(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.patientService.getPatients().subscribe({
      next: (list) => {
        this._patients.set(list);
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
        this._error.set('Failed to connect to patient service.');
        this.toast.showError('Could not retrieve patient records');
      }
    });
  }

  // --- Filter and View Modifiers ---
  setSearch(searchTerm: string): void {
    this._filters.update(f => ({ ...f, searchTerm }));
  }

  setSpecialty(specialtyId: number | null): void {
    this._filters.update(f => ({ ...f, specialtyId }));
  }

  setStatus(status: StatusFilter): void {
    this._filters.update(f => ({ ...f, status }));
  }

  setPriority(priority: PriorityFilter): void {
    this._filters.update(f => ({ ...f, priority }));
  }

  setSortBy(sortBy: PatientSortOption): void {
    this._filters.update(f => ({ ...f, sortBy }));
  }

  setViewMode(viewMode: ViewMode): void {
    this._viewMode.set(viewMode);
  }

  resetFilters(): void {
    this._filters.set({
      searchTerm: '',
      specialtyId: null,
      status: 'all',
      priority: 'all',
      sortBy: 'queue'
    });
    this.toast.showInfo('Filters reset to default');
  }

  // --- Modal Controls ---
  openCreateForm(): void {
    this._patientToEdit.set(null);
    this._isFormOpen.set(true);
  }

  openEditForm(patient: Patient): void {
    this._patientToEdit.set(patient);
    this._isFormOpen.set(true);
  }

  closeForm(): void {
    this._isFormOpen.set(false);
    this._patientToEdit.set(null);
  }

  openDetail(patient: Patient): void {
    this._selectedPatient.set(patient);
    this._isDetailOpen.set(true);
  }

  closeDetail(): void {
    this._isDetailOpen.set(false);
    this._selectedPatient.set(null);
  }

  openDeleteModal(patient: Patient): void {
    this._patientToDelete.set(patient);
  }

  closeDeleteModal(): void {
    this._patientToDelete.set(null);
  }

  // --- CRUD Mutations ---
  savePatient(patientData: Omit<Patient, 'patientId'>, editingId?: number): void {
    this._isSubmitting.set(true);

    if (editingId) {
      this.patientService.updatePatient(editingId, patientData).subscribe({
        next: (updated) => {
          this._patients.update(list => list.map(p => (p.patientId === editingId ? updated : p)));
          this._isSubmitting.set(false);
          this.closeForm();
          this.toast.showSuccess(`Patient "${updated.fullName}" updated.`);
        },
        error: (err) => {
          this._isSubmitting.set(false);
          this.toast.showError(`Failed to update patient: ${err.message || 'Error'}`);
        }
      });
    } else {
      this.patientService.createPatient(patientData).subscribe({
        next: (created) => {
          this._patients.update(list => [created, ...list]);
          this._isSubmitting.set(false);
          this.closeForm();
          this.toast.showSuccess(`Patient "${created.fullName}" registered.`);
        },
        error: (err) => {
          this._isSubmitting.set(false);
          this.toast.showError(`Failed to register patient: ${err.message || 'Error'}`);
        }
      });
    }
  }

  quickUpdateStatus(patientId: number, status: PatientStatus): void {
    this.patientService.updatePatientStatus(patientId, status).subscribe({
      next: (updated) => {
        this._patients.update(list => list.map(p => (p.patientId === patientId ? updated : p)));
        if (this._selectedPatient()?.patientId === patientId) {
          this._selectedPatient.set(updated);
        }
        const friendlyStatus = status === 'In-Consultation' ? 'With Doctor' : (status === 'Critical' ? 'Emergency' : status);
        this.toast.showInfo(`Patient status changed to "${friendlyStatus}".`);
      },
      error: () => {
        this.toast.showError('Failed to change status.');
      }
    });
  }

  confirmDelete(): void {
    const patient = this._patientToDelete();
    if (!patient) return;

    this.patientService.deletePatient(patient.patientId).subscribe({
      next: () => {
        this._patients.update(list => list.filter(p => p.patientId !== patient.patientId));
        this.closeDeleteModal();
        this.toast.showWarning(`Patient "${patient.fullName}" deleted.`);
      },
      error: () => {
        this.toast.showError('Failed to delete patient.');
      }
    });
  }

  resetSeedData(): void {
    this.patientService.resetToDefaultData();
    this.loadInitialData();
    this.toast.showSuccess('Sample patient records reloaded.');
  }
}
