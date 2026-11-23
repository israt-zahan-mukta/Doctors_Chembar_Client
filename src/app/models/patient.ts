export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientStatus = 'Waiting' | 'In-Consultation' | 'Completed' | 'Critical' | 'Scheduled';
export type PatientPriority = 'Normal' | 'Urgent' | 'Emergency';

export interface Specialty {
  specialtyId: number;
  specialtyName: string;
  doctorName: string;
  degree: string;
  roomNo: string;
  visitingHours: string;
  colorScheme: string;
  icon: string;
}

export interface PrescriptionItem {
  prescriptionId?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions?: string;
  patientId?: number;
}

export interface PatientVitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  spo2: number;
  weightKg: number;
}

export interface Patient {
  patientId: number;
  regNo: string;
  fullName: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  avatarUrl: string;
  specialtyId: number;
  specialty?: Specialty;
  status: PatientStatus;
  priority: PatientPriority;
  consultationFee: number;
  appointmentDate: string;
  nextFollowUp: string;
  chiefComplaint: string;
  medicalHistory: string;
  vitals: PatientVitals;
  prescriptions: PrescriptionItem[];
}

export type PatientSortOption = 'name' | 'queue' | 'age-asc' | 'fee-desc' | 'priority';
export type StatusFilter = 'all' | 'waiting' | 'in_consultation' | 'completed' | 'critical';
export type PriorityFilter = 'all' | 'normal' | 'urgent' | 'emergency';
export type ViewMode = 'table' | 'grid';

export interface PatientFilters {
  searchTerm: string;
  specialtyId: number | null;
  status: StatusFilter;
  priority: PriorityFilter;
  sortBy: PatientSortOption;
}

export interface ChamberStats {
  totalPatients: number;
  waitingCount: number;
  inConsultationCount: number;
  completedCount: number;
  criticalCount: number;
  totalRevenue: number;
  totalPrescriptionsGiven: number;
  specialtiesCount: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}
