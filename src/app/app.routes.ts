import { Routes } from '@angular/router';
import { PatientDashboardComponent } from './components/dashboard/patient-dashboard';

export const routes: Routes = [
  { path: '', component: PatientDashboardComponent },
  { path: 'patients', component: PatientDashboardComponent },
  { path: '**', redirectTo: '' }
];
