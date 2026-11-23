import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Patient, Specialty, PatientStatus } from '../models/patient';

const STORAGE_KEY_PATIENTS = 'medchamber_patients_v1';
const STORAGE_KEY_SPECIALTIES = 'medchamber_specialties_v1';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly http = inject(HttpClient);
  public readonly apiUrl = 'http://localhost:5058/api/Patients';

  private readonly initialSpecialties: Specialty[] = [
    {
      specialtyId: 1,
      specialtyName: 'Cardiology & Hypertension Care',
      doctorName: 'Dr. Sarah Rahman',
      degree: 'MBBS, FCPS (Cardiology), FACC (USA)',
      roomNo: 'Chamber 302 (Floor 3)',
      visitingHours: '5:00 PM - 9:30 PM',
      colorScheme: 'cyan',
      icon: 'bi-heart-pulse-fill'
    },
    {
      specialtyId: 2,
      specialtyName: 'Internal & General Medicine',
      doctorName: 'Prof. Dr. Tanvir Hossain',
      degree: 'MBBS, FCPS, MRCP (UK)',
      roomNo: 'Chamber 104 (Floor 1)',
      visitingHours: '4:00 PM - 8:30 PM',
      colorScheme: 'teal',
      icon: 'bi-capsule-pill'
    },
    {
      specialtyId: 3,
      specialtyName: 'Pediatrics & Child Health',
      doctorName: 'Dr. Ayesha Siddiqa',
      degree: 'MBBS, DCH, FCPS (Pediatrics)',
      roomNo: 'Chamber 205 (Floor 2)',
      visitingHours: '5:30 PM - 9:00 PM',
      colorScheme: 'purple',
      icon: 'bi-emoji-smile-fill'
    },
    {
      specialtyId: 4,
      specialtyName: 'Neurology & Stroke Clinic',
      doctorName: 'Dr. Kazi Mahfuzur Rahman',
      degree: 'MBBS, MD (Neurology), FINR',
      roomNo: 'Chamber 401 (Floor 4)',
      visitingHours: '6:00 PM - 10:00 PM',
      colorScheme: 'indigo',
      icon: 'bi-activity'
    },
    {
      specialtyId: 5,
      specialtyName: 'Dermatology & Skin Aesthetics',
      doctorName: 'Dr. Nusrat Jahan',
      degree: 'MBBS, DDV, FCPS (Dermatology)',
      roomNo: 'Chamber 108 (Floor 1)',
      visitingHours: '4:30 PM - 8:00 PM',
      colorScheme: 'rose',
      icon: 'bi-bandaid-fill'
    },
    {
      specialtyId: 6,
      specialtyName: 'Orthopedics & Joint Care',
      doctorName: 'Dr. Rafiqul Islam',
      degree: 'MBBS, MS (Orthopedics), Fellow Arthroscopy',
      roomNo: 'Chamber 310 (Floor 3)',
      visitingHours: '5:00 PM - 9:00 PM',
      colorScheme: 'amber',
      icon: 'bi-person-arms-up'
    }
  ];

  private readonly initialPatients: Patient[] = [
    {
      patientId: 101,
      regNo: 'DOC-2026-081',
      fullName: 'Farhana Yasmin',
      age: 42,
      gender: 'Female',
      bloodGroup: 'B+',
      phone: '+880 1712-894521',
      email: 'farhana.y@outlook.com',
      address: 'House 14, Road 7, Dhanmondi, Dhaka',
      emergencyContact: '+880 1711-223344 (Spouse)',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      specialtyId: 1,
      status: 'In-Consultation',
      priority: 'Urgent',
      consultationFee: 1500,
      appointmentDate: '2026-11-24T17:30:00',
      nextFollowUp: '2026-12-08T18:00:00',
      chiefComplaint: 'Chest tightness radiating to left arm for 3 days with exertion dyspnea',
      medicalHistory: 'Hypertensive for 4 years; Dyslipidemia; No known drug allergy',
      vitals: {
        bloodPressure: '145/95',
        heartRate: 88,
        temperature: 98.4,
        spo2: 97,
        weightKg: 68
      },
      prescriptions: [
        {
          prescriptionId: 1,
          medicineName: 'Tab. Telmisartan',
          dosage: '40 mg',
          frequency: '1 + 0 + 0',
          duration: '30 Days',
          timing: 'Morning after breakfast',
          instructions: 'Monitor BP weekly and record values'
        },
        {
          prescriptionId: 2,
          medicineName: 'Tab. Atorvastatin',
          dosage: '20 mg',
          frequency: '0 + 0 + 1',
          duration: '30 Days',
          timing: 'At bedtime',
          instructions: 'Avoid grapefruit juice'
        },
        {
          prescriptionId: 3,
          medicineName: 'Tab. Aspirin (Ecosprin)',
          dosage: '75 mg',
          frequency: '0 + 1 + 0',
          duration: '30 Days',
          timing: 'After lunch with water',
          instructions: 'Take after food to prevent gastric irritation'
        }
      ]
    },
    {
      patientId: 102,
      regNo: 'DOC-2026-082',
      fullName: 'Kamrul Hassan',
      age: 58,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+880 1819-456789',
      email: 'kamrul.hassan@gmail.com',
      address: 'Flat 4B, Green Avenue, Gulshan 2, Dhaka',
      emergencyContact: '+880 1912-334455 (Son)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      specialtyId: 2,
      status: 'Waiting',
      priority: 'Normal',
      consultationFee: 1200,
      appointmentDate: '2026-11-24T18:00:00',
      nextFollowUp: '2026-12-15T18:00:00',
      chiefComplaint: 'Persistent evening fever with dry cough and body ache for 5 days',
      medicalHistory: 'Type 2 Diabetes Mellitus (HbA1c 7.4%); Allergic to Sulfa drugs',
      vitals: {
        bloodPressure: '125/82',
        heartRate: 82,
        temperature: 101.2,
        spo2: 98,
        weightKg: 74
      },
      prescriptions: [
        {
          prescriptionId: 4,
          medicineName: 'Tab. Cefuroxime Axetil',
          dosage: '500 mg',
          frequency: '1 + 0 + 1',
          duration: '7 Days',
          timing: 'After meals',
          instructions: 'Complete full 7-day antibiotic course'
        },
        {
          prescriptionId: 5,
          medicineName: 'Tab. Paracetamol',
          dosage: '500 mg',
          frequency: '1 + 1 + 1 (SOS)',
          duration: '5 Days',
          timing: 'After meal if temperature > 100°F',
          instructions: 'Maximum 4 tablets in 24 hours'
        },
        {
          prescriptionId: 6,
          medicineName: 'Syrup Dextromethorphan',
          dosage: '10 ml',
          frequency: '1 + 1 + 1',
          duration: '5 Days',
          timing: 'After food',
          instructions: 'Warm water gargle recommended'
        }
      ]
    },
    {
      patientId: 103,
      regNo: 'DOC-2026-083',
      fullName: 'Zubair Al-Mahmud (Child)',
      age: 7,
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '+880 1622-998877',
      email: 'mahmud.parents@yahoo.com',
      address: 'Sector 4, Uttara, Dhaka',
      emergencyContact: '+880 1622-998877 (Father)',
      avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      specialtyId: 3,
      status: 'Waiting',
      priority: 'Urgent',
      consultationFee: 1000,
      appointmentDate: '2026-11-24T18:30:00',
      nextFollowUp: '2026-12-01T17:00:00',
      chiefComplaint: 'Recurrent wheezing, nighttime coughing episodes, and mild shortness of breath',
      medicalHistory: 'Childhood bronchial asthma; Atopic dermatitis in infancy',
      vitals: {
        bloodPressure: '100/65',
        heartRate: 96,
        temperature: 98.6,
        spo2: 96,
        weightKg: 22
      },
      prescriptions: [
        {
          prescriptionId: 7,
          medicineName: 'Inhaler Salbutamol with Spacer',
          dosage: '100 mcg (2 puffs)',
          frequency: 'SOS (as needed)',
          duration: '14 Days',
          timing: 'During acute coughing or wheezing',
          instructions: 'Rinse mouth after each inhalation session'
        },
        {
          prescriptionId: 8,
          medicineName: 'Syrup Montelukast Sodium',
          dosage: '5 mg (Chewable)',
          frequency: '0 + 0 + 1',
          duration: '30 Days',
          timing: 'Evening bedtime',
          instructions: 'Give regularly for airway inflammation control'
        }
      ]
    },
    {
      patientId: 104,
      regNo: 'DOC-2026-084',
      fullName: 'Shahana Begum',
      age: 63,
      gender: 'Female',
      bloodGroup: 'AB+',
      phone: '+880 1733-112233',
      email: 'shahana.begum@hotmail.com',
      address: 'Holding 88, Mirpur 10, Dhaka',
      emergencyContact: '+880 1844-556677 (Daughter)',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      specialtyId: 4,
      status: 'Critical',
      priority: 'Emergency',
      consultationFee: 2000,
      appointmentDate: '2026-11-24T17:15:00',
      nextFollowUp: '2026-11-28T16:00:00',
      chiefComplaint: 'Sudden onset transient right-sided facial weakness and slurred speech lasting 20 mins',
      medicalHistory: 'TIA suspicion, Atrial Fibrillation history, On anticoagulant therapy',
      vitals: {
        bloodPressure: '170/105',
        heartRate: 104,
        temperature: 98.7,
        spo2: 95,
        weightKg: 62
      },
      prescriptions: [
        {
          prescriptionId: 9,
          medicineName: 'Tab. Clopidogrel + Aspirin',
          dosage: '75 mg / 75 mg',
          frequency: '1 + 0 + 0',
          duration: '21 Days',
          timing: 'Morning with food',
          instructions: 'URGENT: Proceed for Emergency Brain MRI (Diffusion weighted)'
        },
        {
          prescriptionId: 10,
          medicineName: 'Tab. Amlodipine + Olmesartan',
          dosage: '5 mg / 20 mg',
          frequency: '1 + 0 + 0',
          duration: '30 Days',
          timing: 'Morning',
          instructions: 'Continuous blood pressure charting mandatory'
        }
      ]
    },
    {
      patientId: 105,
      regNo: 'DOC-2026-085',
      fullName: 'Tariq Anowar',
      age: 34,
      gender: 'Male',
      bloodGroup: 'A-',
      phone: '+880 1977-889900',
      email: 'tariq.anowar@techcorp.io',
      address: 'Tower 2, Bashundhara R/A, Dhaka',
      emergencyContact: '+880 1977-889901 (Brother)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      specialtyId: 5,
      status: 'Completed',
      priority: 'Normal',
      consultationFee: 1200,
      appointmentDate: '2026-11-24T16:00:00',
      nextFollowUp: '2026-12-24T17:00:00',
      chiefComplaint: 'Severe facial cystic acne flares with erythema exacerbated over past 2 months',
      medicalHistory: 'Sensitive skin barrier; No major chronic illnesses',
      vitals: {
        bloodPressure: '118/76',
        heartRate: 72,
        temperature: 98.6,
        spo2: 99,
        weightKg: 71
      },
      prescriptions: [
        {
          prescriptionId: 11,
          medicineName: 'Cap. Doxycycline Hyclate',
          dosage: '100 mg',
          frequency: '0 + 0 + 1',
          duration: '30 Days',
          timing: 'Evening with large glass of water',
          instructions: 'Do not lie down for 30 minutes after taking'
        },
        {
          prescriptionId: 12,
          medicineName: 'Gel Adapalene + Benzoyl Peroxide (0.1%/2.5%)',
          dosage: 'Pea-sized amount',
          frequency: '0 + 0 + 1',
          duration: '60 Days',
          timing: 'Apply at night over clean dry face',
          instructions: 'Use non-comedogenic sunscreen SPF 50 during daytime'
        }
      ]
    },
    {
      patientId: 106,
      regNo: 'DOC-2026-086',
      fullName: 'Nusrat Parveen',
      age: 49,
      gender: 'Female',
      bloodGroup: 'O-',
      phone: '+880 1552-334455',
      email: 'nusrat.p@gmail.com',
      address: 'House 5, Mohakhali DOHS, Dhaka',
      emergencyContact: '+880 1711-990011 (Spouse)',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      specialtyId: 6,
      status: 'Waiting',
      priority: 'Normal',
      consultationFee: 1500,
      appointmentDate: '2026-11-24T19:00:00',
      nextFollowUp: '2026-12-10T18:30:00',
      chiefComplaint: 'Bilateral knee joint stiffness and chronic pain aggravated on climbing stairs',
      medicalHistory: 'Early Osteoarthritis; Bone Mineral Density T-score -2.1 (Osteopenia)',
      vitals: {
        bloodPressure: '130/85',
        heartRate: 76,
        temperature: 98.2,
        spo2: 98,
        weightKg: 69
      },
      prescriptions: [
        {
          prescriptionId: 13,
          medicineName: 'Tab. Glucosamine + Chondroitin Sulfate',
          dosage: '750 mg / 600 mg',
          frequency: '1 + 0 + 1',
          duration: '60 Days',
          timing: 'After meals',
          instructions: 'Quadriceps strengthening exercises prescribed'
        },
        {
          prescriptionId: 14,
          medicineName: 'Cap. Calcium Carbonate + Vitamin D3',
          dosage: '500 mg / 400 IU',
          frequency: '0 + 0 + 1',
          duration: '60 Days',
          timing: 'At night after food',
          instructions: 'Adequate daylight exposure recommended'
        }
      ]
    },
    {
      patientId: 107,
      regNo: 'DOC-2026-087',
      fullName: 'Mustafizur Rahman',
      age: 51,
      gender: 'Male',
      bloodGroup: 'B-',
      phone: '+880 1817-223344',
      email: 'mustafiz.r@corp.com',
      address: 'Block C, Banani, Dhaka',
      emergencyContact: '+880 1817-223355 (Wife)',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      specialtyId: 1,
      status: 'Completed',
      priority: 'Normal',
      consultationFee: 1500,
      appointmentDate: '2026-11-24T16:30:00',
      nextFollowUp: '2027-01-20T17:00:00',
      chiefComplaint: 'Routine post-PCI (Stent placed 6 months ago) cardiovascular follow-up',
      medicalHistory: 'Coronary Artery Disease; Stent to LAD in May 2026; Good exercise tolerance',
      vitals: {
        bloodPressure: '115/75',
        heartRate: 64,
        temperature: 98.5,
        spo2: 99,
        weightKg: 73
      },
      prescriptions: [
        {
          prescriptionId: 15,
          medicineName: 'Tab. Bisoprolol Fumarate',
          dosage: '2.5 mg',
          frequency: '1 + 0 + 0',
          duration: '90 Days',
          timing: 'Morning',
          instructions: 'Target resting heart rate 60-70 bpm'
        },
        {
          prescriptionId: 16,
          medicineName: 'Tab. Rosuvastatin',
          dosage: '10 mg',
          frequency: '0 + 0 + 1',
          duration: '90 Days',
          timing: 'Bedtime',
          instructions: 'Repeat lipid profile in 3 months'
        }
      ]
    },
    {
      patientId: 108,
      regNo: 'DOC-2026-088',
      fullName: 'Sabrina Chowdhury',
      age: 28,
      gender: 'Female',
      bloodGroup: 'AB-',
      phone: '+880 1923-456789',
      email: 'sabrina.chowdhury@agency.net',
      address: 'Lalmatia Block D, Dhaka',
      emergencyContact: '+880 1923-456790 (Mother)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialtyId: 2,
      status: 'Waiting',
      priority: 'Urgent',
      consultationFee: 1200,
      appointmentDate: '2026-11-24T19:30:00',
      nextFollowUp: '2026-12-05T18:00:00',
      chiefComplaint: 'Acute right lower quadrant abdominal cramping with nausea and low-grade pyrexia',
      medicalHistory: 'Rule out Acute Appendicitis vs Mesenteric Adenitis; Nil by mouth advised',
      vitals: {
        bloodPressure: '110/70',
        heartRate: 92,
        temperature: 100.1,
        spo2: 98,
        weightKg: 54
      },
      prescriptions: [
        {
          prescriptionId: 17,
          medicineName: 'Inj. Drotaverine HCl (Emergency IV/IM)',
          dosage: '40 mg',
          frequency: 'Stat dose',
          duration: '1 Day',
          timing: 'Immediately in chamber',
          instructions: 'Urgent Ultrasound of whole abdomen and CBC with ESR stat'
        }
      ]
    }
  ];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem(STORAGE_KEY_SPECIALTIES)) {
        localStorage.setItem(STORAGE_KEY_SPECIALTIES, JSON.stringify(this.initialSpecialties));
      }
      if (!localStorage.getItem(STORAGE_KEY_PATIENTS)) {
        localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(this.initialPatients));
      }
    }
  }

  private getLocalPatients(): Patient[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [...this.initialPatients];
    }
    const raw = localStorage.getItem(STORAGE_KEY_PATIENTS);
    if (!raw) return [...this.initialPatients];
    try {
      const parsed: Patient[] = JSON.parse(raw);
      // Link specialties
      const specs = this.getLocalSpecialties();
      return parsed.map(p => ({
        ...p,
        specialty: specs.find(s => s.specialtyId === p.specialtyId)
      }));
    } catch {
      return [...this.initialPatients];
    }
  }

  private saveLocalPatients(list: Patient[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(list));
    }
  }

  private getLocalSpecialties(): Specialty[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [...this.initialSpecialties];
    }
    const raw = localStorage.getItem(STORAGE_KEY_SPECIALTIES);
    if (!raw) return [...this.initialSpecialties];
    try {
      return JSON.parse(raw);
    } catch {
      return [...this.initialSpecialties];
    }
  }

  // --- HTTP & Fallback Observable API ---

  getSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${this.apiUrl}/specialties`).pipe(
      catchError(() => of(this.getLocalSpecialties()))
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      catchError(() => of(this.getLocalPatients()))
    );
  }

  getPatientById(id: number): Observable<Patient | undefined> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.getLocalPatients().find(p => p.patientId === id);
        return of(found);
      })
    );
  }

  createPatient(patient: Omit<Patient, 'patientId'>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      catchError(() => {
        const all = this.getLocalPatients();
        const maxId = all.length > 0 ? Math.max(...all.map(p => p.patientId)) : 100;
        const newPatient: Patient = {
          ...patient,
          patientId: maxId + 1,
          regNo: patient.regNo || `DOC-2026-${String(maxId + 1).padStart(3, '0')}`,
          specialty: this.getLocalSpecialties().find(s => s.specialtyId === patient.specialtyId)
        };
        const updated = [newPatient, ...all];
        this.saveLocalPatients(updated);
        return of(newPatient);
      })
    );
  }

  updatePatient(id: number, patientData: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patientData).pipe(
      catchError(() => {
        const all = this.getLocalPatients();
        const index = all.findIndex(p => p.patientId === id);
        if (index === -1) {
          throw new Error(`Patient #${id} not found`);
        }
        const updated: Patient = {
          ...all[index],
          ...patientData,
          patientId: id,
          specialty: this.getLocalSpecialties().find(s => s.specialtyId === (patientData.specialtyId ?? all[index].specialtyId))
        };
        all[index] = updated;
        this.saveLocalPatients(all);
        return of(updated);
      })
    );
  }

  deletePatient(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const all = this.getLocalPatients().filter(p => p.patientId !== id);
        this.saveLocalPatients(all);
        return of(true);
      })
    );
  }

  updatePatientStatus(id: number, status: PatientStatus): Observable<Patient> {
    return this.updatePatient(id, { status });
  }

  resetToDefaultData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(this.initialPatients));
      localStorage.setItem(STORAGE_KEY_SPECIALTIES, JSON.stringify(this.initialSpecialties));
    }
  }
}
