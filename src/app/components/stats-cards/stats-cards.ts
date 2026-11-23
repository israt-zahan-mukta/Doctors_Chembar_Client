import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChamberStats } from '../../models/patient';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-3 mb-4">

      <!-- 1. Total Patients (Classic Blue Panel) -->
      <div class="col-sm-6 col-xl">
        <div class="panel-box panel-blue shadow-sm">
          <div class="panel-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div class="panel-number">{{ stats().totalPatients }}</div>
              <div class="panel-label">Total Patients</div>
            </div>
            <i class="bi bi-people-fill panel-icon"></i>
          </div>
          <div class="panel-footer px-3 py-1.5 small">
            <span>{{ stats().specialtiesCount }} Doctor Departments</span>
          </div>
        </div>
      </div>

      <!-- 2. Waiting in Chamber (Classic Orange/Yellow Panel) -->
      <div class="col-sm-6 col-xl">
        <div class="panel-box panel-orange shadow-sm">
          <div class="panel-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div class="panel-number">{{ stats().waitingCount }}</div>
              <div class="panel-label">Waiting in Chamber</div>
            </div>
            <i class="bi bi-hourglass-split panel-icon"></i>
          </div>
          <div class="panel-footer px-3 py-1.5 small">
            <span>Waiting for Doctor</span>
          </div>
        </div>
      </div>

      <!-- 3. With Doctor (Classic Indigo Panel) -->
      <div class="col-sm-6 col-xl">
        <div class="panel-box panel-indigo shadow-sm">
          <div class="panel-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div class="panel-number">{{ stats().inConsultationCount }}</div>
              <div class="panel-label">With Doctor</div>
            </div>
            <i class="bi bi-stethoscope panel-icon"></i>
          </div>
          <div class="panel-footer px-3 py-1.5 small">
            <span>Inside Doctor's Room</span>
          </div>
        </div>
      </div>

      <!-- 4. Emergency / Critical (Classic Red Panel) -->
      <div class="col-sm-6 col-xl">
        <div class="panel-box panel-red shadow-sm">
          <div class="panel-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div class="panel-number">{{ stats().criticalCount }}</div>
              <div class="panel-label">Emergency</div>
            </div>
            <i class="bi bi-heart-pulse-fill panel-icon"></i>
          </div>
          <div class="panel-footer px-3 py-1.5 small">
            <span>Needs Urgent Care</span>
          </div>
        </div>
      </div>

      <!-- 5. Total Fees Collected (Classic Green Panel) -->
      <div class="col-sm-6 col-xl">
        <div class="panel-box panel-green shadow-sm">
          <div class="panel-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div class="panel-number">৳ {{ stats().totalRevenue | number:'1.0-0' }}</div>
              <div class="panel-label">Fees Collected</div>
            </div>
            <i class="bi bi-cash-stack panel-icon"></i>
          </div>
          <div class="panel-footer px-3 py-1.5 small">
            <span>{{ stats().totalPrescriptionsGiven }} Prescriptions Issued</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .panel-box {
      border-radius: 6px;
      color: #ffffff;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .panel-blue { background-color: #0284c7; }
    .panel-blue .panel-footer { background-color: #0369a1; color: #e0f2fe; }

    .panel-orange { background-color: #f59e0b; }
    .panel-orange .panel-footer { background-color: #d97706; color: #fef3c7; }

    .panel-indigo { background-color: #4f46e5; }
    .panel-indigo .panel-footer { background-color: #4338ca; color: #e0e7ff; }

    .panel-red { background-color: #e11d48; }
    .panel-red .panel-footer { background-color: #be123c; color: #ffe4e6; }

    .panel-green { background-color: #16a34a; }
    .panel-green .panel-footer { background-color: #15803d; color: #dcfce7; }

    .panel-number {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1.1;
      font-family: var(--font-mono);
    }

    .panel-label {
      font-size: 0.85rem;
      font-weight: 600;
      opacity: 0.95;
    }

    .panel-icon {
      font-size: 2.25rem;
      opacity: 0.4;
    }

    .panel-footer {
      font-weight: 500;
      font-size: 0.75rem;
    }
  `]
})
export class StatsCardsComponent {
  readonly stats = input.required<ChamberStats>();
}
