import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PatientService } from './patient.service';

describe('PatientService', () => {
  let service: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(PatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve patients list with default records', (done) => {
    service.getPatients().subscribe(patients => {
      expect(patients).toBeDefined();
      expect(patients.length).toBeGreaterThan(0);
      expect(patients[0].fullName).toBeDefined();
      expect(patients[0].vitals).toBeDefined();
      expect(patients[0].prescriptions.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should retrieve specialties list', (done) => {
    service.getSpecialties().subscribe(specialties => {
      expect(specialties).toBeDefined();
      expect(specialties.length).toBeGreaterThanOrEqual(5);
      expect(specialties[0].specialtyName).toBeDefined();
      done();
    });
  });
});
