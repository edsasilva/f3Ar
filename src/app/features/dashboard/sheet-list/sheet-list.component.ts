import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SheetConfig } from '../sheet.config';
import { GoogleSheetsService } from '../google-sheets.service';

@Component({
  selector: 'app-sheet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="sheet-list-container">
      <div class="sheet-header">
        <h2>{{ sheetConfig.name }}</h2>
        <button mat-flat-button color="primary" (click)="loadData()">
          <mat-icon>refresh</mat-icon>
          Reload
        </button>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner diameter="40" color="accent"></mat-spinner>
        <p>Syncing with Google Sheets...</p>
      </div>

      <div *ngIf="error()" class="error-box">
        <mat-icon>error_outline</mat-icon>
        <p>{{ error() }}</p>
      </div>

      <div *ngIf="!loading() && hasRows()" class="table-wrapper mat-elevation-z2">
        <table mat-table [dataSource]="rows()">
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let row"> {{ row.timestamp || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="playerName">
            <th mat-header-cell *matHeaderCellDef> Player </th>
            <td mat-cell *matCellDef="let row"> <strong>{{ row.playerName || '-' }}</strong> </td>
          </ng-container>

          <ng-container matColumnDef="mainTeam">
            <th mat-header-cell *matHeaderCellDef> Team </th>
            <td mat-cell *matCellDef="let row"> {{ row.mainTeam || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="mainTeamPower">
            <th mat-header-cell *matHeaderCellDef> Power </th>
            <td mat-cell *matCellDef="let row"> {{ row.mainTeamPower || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="bestTime">
            <th mat-header-cell *matHeaderCellDef> Best Time </th>
            <td mat-cell *matCellDef="let row"> {{ row.bestTime || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="thp">
            <th mat-header-cell *matHeaderCellDef> THP </th>
            <td mat-cell *matCellDef="let row"> {{ row.thp || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="professionLevel">
            <th mat-header-cell *matHeaderCellDef> Profession Level </th>
            <td mat-cell *matCellDef="let row"> {{ row.professionLevel || '-' }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div *ngIf="!loading() && !hasRows() && !error()" class="empty">
        <mat-icon>info_outline</mat-icon>
        <p>No data found. Click "Reload" to fetch data from the spreadsheet.</p>
      </div>
    </div>
  `,
  styles: [`
    .sheet-list-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #0f172a;
      min-height: 100%;
      color: white;
    }

    .sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .sheet-header h2 {
      margin: 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      min-height: 200px;
      color: #94a3b8;
    }

    .error-box {
      background-color: rgba(220, 38, 38, 0.1);
      color: #fca5a5;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid rgba(220, 38, 38, 0.2);
    }

    .empty {
      background-color: rgba(255, 255, 255, 0.03);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      border-radius: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.1);
    }

    .table-wrapper {
      flex: 1;
      overflow: auto;
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    table {
      width: 100%;
      background: transparent !important;
    }

    /* Dark Table Overrides */
    :host ::ng-deep {
      .mat-mdc-header-cell {
        color: #94a3b8 !important;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        padding: 16px !important;
      }

      .mat-mdc-cell {
        color: #e2e8f0 !important;
        border-bottom-color: rgba(255, 255, 255, 0.05) !important;
        padding: 16px !important;
      }

      .mat-mdc-row:hover {
        background-color: rgba(255, 255, 255, 0.03) !important;
      }

      strong {
        color: white;
      }
    }

    button[mat-flat-button] {
      border-radius: 8px;
      font-weight: 600;
    }
  `]
})
export class SheetListComponent implements OnInit {
  @Input() sheetConfig!: SheetConfig;

  private sheetsService: GoogleSheetsService = inject(GoogleSheetsService);

  displayedColumns: string[] = [
    'timestamp',
    'playerName',
    'mainTeam',
    'mainTeamPower',
    'bestTime',
    'thp',
    'professionLevel'
  ];

  loading = () => this.sheetsService.loading();
  hasRows = () => this.sheetsService.hasRows();
  error = () => this.sheetsService.error();
  rows = () => this.sheetsService.rows();

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.sheetConfig) {
      this.sheetsService.loadFromPublicGoogleSheetId(this.sheetConfig.sheetId);
    }
  }
}
