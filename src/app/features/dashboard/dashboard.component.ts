import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SHEET_CONFIGS, SheetConfig } from './sheet.config';
import { SheetListComponent } from './sheet-list/sheet-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    SheetListComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <mat-toolbar class="main-toolbar">
        <span class="spacer"></span>
        <span>Welcome to Dashboard </span>
        <button mat-icon-button (click)="onLogout()" matTooltip="Logout" class="logout-btn">
          <mat-icon color="warn">logout</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Menu Horizontal (Abas) -->
      <mat-tab-group (selectedIndexChange)="onTabChange($event)">
        <mat-tab *ngFor="let sheet of sheets; let i = index" [label]="sheet.name">
          <app-sheet-list [sheetConfig]="sheets[i]"></app-sheet-list>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #0f172a;
      color: white;
    }

    .main-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-tab-group {
      flex: 1;
      overflow: auto;
      background: #0f172a;
    }

    .logout-btn {
      margin-left: 8px;
    }

    /* Dark Mode Overrides for Tabs */
    :host ::ng-deep {
      .mat-mdc-tab-group {
        --mdc-tab-indicator-active-indicator-color: #60a5fa;
        --mat-tab-header-active-label-text-color: #60a5fa;
        --mat-tab-header-inactive-label-text-color: #94a3b8;
        --mat-tab-header-active-ripple-color: rgba(255, 255, 255, 0.1);
        --mat-tab-header-inactive-ripple-color: rgba(255, 255, 255, 0.05);
      }

      .mat-mdc-tab-labels {
        background: rgba(15, 23, 42, 0.9);
      }

      .mat-mdc-tab .mdc-tab__text-label {
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .mat-mdc-tab-body-wrapper {
        background: #0f172a;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  sheets = SHEET_CONFIGS;
  selectedSheetIndex = signal(0);

  authService = inject(AuthService);
  private router = inject(Router);

  currentUser = () => this.authService.currentUser();

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onTabChange(index: number): void {
    this.selectedSheetIndex.set(index);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
