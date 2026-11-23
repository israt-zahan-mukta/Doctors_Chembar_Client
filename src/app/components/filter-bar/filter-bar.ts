import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import {
  PatientFilters,
  PatientPriority,
  PatientSortOption,
  PriorityFilter,
  Specialty,
  StatusFilter,
  ViewMode
} from '../../models/patient';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filter-card shadow-sm mb-4">
      <div class="row g-3 align-items-center">

        <!-- Search Input -->
        <div class="col-lg-3 col-md-6">
          <div class="search-input-wrapper">
            <i class="bi bi-search search-icon text-primary"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search patient name, serial #, phone..."
              [value]="filters().searchTerm"
              (input)="onSearchInput($event)"
            />
            @if (filters().searchTerm) {
              <button class="clear-search-btn" (click)="searchChange.emit('')" type="button" aria-label="Clear Search">
                <i class="bi bi-x-circle-fill text-danger"></i>
              </button>
            }
          </div>
        </div>

        <!-- Department / Specialty Filter -->
        <div class="col-lg-3 col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 text-primary">
              <i class="bi bi-hospital"></i>
            </span>
            <select
              class="form-select border-start-0"
              [value]="filters().specialtyId !== null ? filters().specialtyId : ''"
              (change)="onSpecialtyChange($event)"
            >
              <option value="">All Doctor Departments ({{ specialties().length }})</option>
              @for (spec of specialties(); track spec.specialtyId) {
                <option [value]="spec.specialtyId">{{ spec.specialtyName }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Filter by Status Buttons -->
        <div class="col-lg-4 col-md-7">
          <div class="btn-group w-100 triage-group" role="group" aria-label="Filter by patient status">
            <button
              type="button"
              class="btn btn-sm btn-filter"
              [class.active-all]="filters().status === 'all'"
              (click)="statusChange.emit('all')"
            >
              All ({{ resultCount() }})
            </button>
            <button
              type="button"
              class="btn btn-sm btn-filter"
              [class.active-waiting]="filters().status === 'waiting'"
              (click)="statusChange.emit('waiting')"
            >
              Waiting
            </button>
            <button
              type="button"
              class="btn btn-sm btn-filter"
              [class.active-consultation]="filters().status === 'in_consultation'"
              (click)="statusChange.emit('in_consultation')"
            >
              With Doctor
            </button>
            <button
              type="button"
              class="btn btn-sm btn-filter"
              [class.active-critical]="filters().status === 'critical'"
              (click)="statusChange.emit('critical')"
            >
              Emergency
            </button>
            <button
              type="button"
              class="btn btn-sm btn-filter"
              [class.active-completed]="filters().status === 'completed'"
              (click)="statusChange.emit('completed')"
            >
              Done
            </button>
          </div>
        </div>

        <!-- Sort & View Mode -->
        <div class="col-lg-2 col-md-5 d-flex gap-2 justify-content-lg-end">
          <select
            class="form-select form-select-sm"
            [value]="filters().sortBy"
            (change)="onSortChange($event)"
          >
            <option value="queue">Sort: Arrival Order</option>
            <option value="name">Sort: Name (A to Z)</option>
            <option value="age-asc">Sort: Youngest First</option>
            <option value="fee-desc">Sort: Highest Fee</option>
          </select>

          <div class="btn-group btn-group-sm" role="group">
            <button
              type="button"
              class="btn btn-outline-secondary"
              [class.active]="viewMode() === 'table'"
              (click)="viewModeChange.emit('table')"
              title="Table / List View"
            >
              <i class="bi bi-table"></i>
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              [class.active]="viewMode() === 'grid'"
              (click)="viewModeChange.emit('grid')"
              title="Card View"
            >
              <i class="bi bi-grid-fill"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .filter-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 0.85rem 1rem;
      border: 1px solid #cbd5e1;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 0.85rem;
      pointer-events: none;
      font-size: 0.875rem;
    }

    .search-input {
      padding-left: 2.25rem;
      padding-right: 2rem;
      font-size: 0.875rem;
      border-radius: 6px;
      border-color: #cbd5e1;
    }

    .clear-search-btn {
      position: absolute;
      right: 0.6rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 0.875rem;
    }

    .triage-group {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    .btn-filter {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.35rem 0.5rem;
      border: none;
      border-right: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
    }

    .btn-filter:last-child {
      border-right: none;
    }

    .btn-filter:hover {
      background: #e2e8f0;
    }

    .btn-filter.active-all {
      background: #0f172a !important;
      color: #ffffff !important;
    }

    .btn-filter.active-waiting {
      background: #f59e0b !important;
      color: #ffffff !important;
    }

    .btn-filter.active-consultation {
      background: #0284c7 !important;
      color: #ffffff !important;
    }

    .btn-filter.active-critical {
      background: #ef4444 !important;
      color: #ffffff !important;
    }

    .btn-filter.active-completed {
      background: #10b981 !important;
      color: #ffffff !important;
    }
  `]
})
export class FilterBarComponent {
  readonly specialties = input.required<Specialty[]>();
  readonly filters = input.required<PatientFilters>();
  readonly viewMode = input.required<ViewMode>();
  readonly resultCount = input.required<number>();

  readonly searchChange = output<string>();
  readonly specialtyChange = output<number | null>();
  readonly statusChange = output<StatusFilter>();
  readonly priorityChange = output<PriorityFilter>();
  readonly sortByChange = output<PatientSortOption>();
  readonly viewModeChange = output<ViewMode>();

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChange.emit(input.value);
  }

  onSpecialtyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const val = select.value === '' ? null : Number(select.value);
    this.specialtyChange.emit(val);
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortByChange.emit(select.value as PatientSortOption);
  }
}
