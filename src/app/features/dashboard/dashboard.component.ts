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
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <span>Bem-vindo!</span>
        <button mat-icon-button (click)="onLogout()" matTooltip="Sair">
          <mat-icon>logout</mat-icon>
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
    }

    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-tab-group {
      flex: 1;
      overflow: auto;
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
