import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PatientStore } from './patient.store';
import { PatientService } from './patient.service';
import { ToastService } from './toast.service';

describe('PatientStore', () => {
  let store: PatientStore;
  let service: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientStore,
        PatientService,
        ToastService,
        provideHttpClient()
      ]
    });

    store = TestBed.inject(PatientStore);
    service = TestBed.inject(PatientService);
  });

  it('should initialize with default states', () => {
    expect(store).toBeTruthy();
    expect(store.patients().length).toBe(0);
    expect(store.viewMode()).toBe('table');
    expect(store.isLoading()).toBe(false);
  });

  it('should load initial data and populate patients & specialties', (done) => {
    store.loadInitialData();

    // Small timeout to allow mock service / localstorage to complete
    setTimeout(() => {
      expect(store.patients().length).toBeGreaterThan(0);
      expect(store.specialties().length).toBeGreaterThan(0);
      expect(store.stats().totalPatients).toBeGreaterThan(0);
      done();
    }, 200);
  });

  it('should toggle triage status with quickUpdateStatus', (done) => {
    store.loadInitialData();

    setTimeout(() => {
      const patient = store.patients()[0];
      expect(patient).toBeDefined();
      
      const newStatus = patient.status === 'Completed' ? 'Waiting' : 'Completed';
      store.quickUpdateStatus(patient.patientId, newStatus);

      setTimeout(() => {
        const updated = store.patients().find(p => p.patientId === patient.patientId);
        expect(updated?.status).toBe(newStatus);
        done();
      }, 100);
    }, 200);
  });

  it('should filter patients by status correctly', (done) => {
    store.loadInitialData();

    setTimeout(() => {
      store.setStatus('waiting');
      const filtered = store.filteredPatients();
      expect(filtered.every(p => p.status === 'Waiting')).toBeTrue();
      done();
    }, 200);
  });

  it('should switch view mode between table and grid', () => {
    expect(store.viewMode()).toBe('table');
    store.setViewMode('grid');
    expect(store.viewMode()).toBe('grid');
    store.setViewMode('table');
    expect(store.viewMode()).toBe('table');
  });
});
