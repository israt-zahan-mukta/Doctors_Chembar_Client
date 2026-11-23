import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientStore } from '../../services/patient.store';
import { StatsCardsComponent } from '../stats-cards/stats-cards';
import { FilterBarComponent } from '../filter-bar/filter-bar';
import { PatientTableComponent } from '../patient-table/patient-table';
import { PatientGridComponent } from '../patient-grid/patient-grid';
import { PatientFormModalComponent } from '../patient-form-modal/patient-form-modal';
import { PatientDetailModalComponent } from '../patient-detail-modal/patient-detail-modal';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal';
import { ToastContainerComponent } from '../toast/toast-container';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    FilterBarComponent,
    PatientTableComponent,
    PatientGridComponent,
    PatientFormModalComponent,
    PatientDetailModalComponent,
    ConfirmModalComponent,
    ToastContainerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-wrapper no-print">
      <div class="container-xl">

        <!-- Page Title & Action Bar -->
        <div class="page-title-box p-3 mb-4 bg-white rounded-2 border shadow-xs d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold text-dark mb-0">Doctor's Chamber &bull; Patient Queue & Prescriptions</h4>
              <span class="badge bg-primary">Today's Queue</span>
            </div>
            <p class="text-secondary small mb-0 mt-1">
              Manage daily patient visits, record basic health checks, and write medicine prescriptions.
            </p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn btn-success btn-sm px-3 fw-bold"
              (click)="store.openCreateForm()"
            >
              <i class="bi bi-person-plus-fill me-1"></i> + Register New Patient
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm px-3"
              (click)="store.resetSeedData()"
              title="Reload sample demonstration records"
            >
              <i class="bi bi-arrow-clockwise me-1"></i> Reset Demo Data
            </button>
          </div>
        </div>

        <!-- 1. Classic Colored Metric Panels (2015 Style) -->
        <app-stats-cards [stats]="store.stats()" />

        <!-- 2. Search & Triage Color Tabs Bar -->
        <app-filter-bar
          [specialties]="store.specialties()"
          [filters]="store.filters()"
          [viewMode]="store.viewMode()"
          [resultCount]="store.filteredPatients().length"
          (searchChange)="store.setSearch($event)"
          (specialtyChange)="store.setSpecialty($event)"
          (statusChange)="store.setStatus($event)"
          (priorityChange)="store.setPriority($event)"
          (sortByChange)="store.setSortBy($event)"
          (viewModeChange)="store.setViewMode($event)"
        />

        <!-- Loading State -->
        @if (store.isLoading()) {
          <div class="loading-container p-5 text-center shadow-xs">
            <div class="spinner-border text-primary mb-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h6 class="fw-bold text-dark">Loading Patient List...</h6>
            <p class="text-muted small mb-0">Please wait while the patient queue is loaded.</p>
          </div>
        }

        <!-- Error State -->
        @if (store.error(); as err) {
          <div class="alert alert-danger shadow-xs d-flex align-items-center justify-content-between p-3 rounded-2 mb-4">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill fs-5"></i>
              <span>{{ err }}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" (click)="store.loadPatients()">Retry</button>
          </div>
        }

        <!-- 3. Dynamic Views: Table Queue vs Grid Cards -->
        @if (!store.isLoading()) {
          @if (store.viewMode() === 'table') {
            <app-patient-table
              [patients]="store.filteredPatients()"
              (viewDetail)="store.openDetail($event)"
              (editPatient)="store.openEditForm($event)"
              (deletePatient)="store.openDeleteModal($event)"
              (statusChange)="onQuickStatusChange($event)"
            />
          } @else {
            <app-patient-grid
              [patients]="store.filteredPatients()"
              (viewDetail)="store.openDetail($event)"
              (editPatient)="store.openEditForm($event)"
              (deletePatient)="store.openDeleteModal($event)"
              (statusChange)="onQuickStatusChange($event)"
            />
          }
        }

      </div>
    </div>

    <!-- Modals -->
    @if (store.isFormOpen()) {
      <app-patient-form-modal
        [specialties]="store.specialties()"
        [patientToEdit]="store.patientToEdit()"
        [isSubmitting]="store.isSubmitting()"
        (close)="store.closeForm()"
        (save)="onSavePatient($event)"
      />
    }

    @if (store.isDetailOpen()) {
      <app-patient-detail-modal
        [patient]="store.selectedPatient()"
        (close)="store.closeDetail()"
        (editPatient)="onEditFromDetail($event)"
      />
    }

    @if (store.patientToDelete()) {
      <app-confirm-modal
        [patient]="store.patientToDelete()"
        (confirmed)="store.confirmDelete()"
        (cancelled)="store.closeDeleteModal()"
      />
    }

    <app-toast-container />
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: calc(100vh - 140px);
    }

    .page-title-box {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0284c7;
    }

    .shadow-xs {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .loading-container {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  readonly store = inject(PatientStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  onSavePatient(event: { data: any; id?: number }): void {
    this.store.savePatient(event.data, event.id);
  }

  onQuickStatusChange(event: { id: number; status: any }): void {
    this.store.quickUpdateStatus(event.id, event.status);
  }

  onEditFromDetail(patient: any): void {
    this.store.closeDetail();
    this.store.openEditForm(patient);
  }
}
