import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SheetConfig } from '../sheet.config';
import { GoogleSheetsService } from '../google-sheets.service';

@Component({
  selector: 'app-sheet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="sheet-list-container">
      <div class="sheet-header">
        <h2>{{ sheetConfig.name }}</h2>
        <button mat-raised-button color="primary" (click)="loadData()">
          <mat-icon>refresh</mat-icon>
          Recarregar
        </button>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
        <p>Carregando dados...</p>
      </div>

      <div *ngIf="error()" class="error">
        <p>{{ error() }}</p>
      </div>

      <div *ngIf="!loading() && hasRows()" class="list-wrapper">
        <mat-list>
          <mat-list-item *ngFor="let row of rows()">
            <div class="list-item-content">
              <div class="item-row">
                <span class="item-label">Nome:</span>
                <span class="item-value">{{ row.playerName || '-' }}</span>
              </div>
              <div class="item-row">
                <span class="item-label">Time:</span>
                <span class="item-value">{{ row.mainTeam || '-' }}</span>
              </div>
              <div class="item-row">
                <span class="item-label">Power:</span>
                <span class="item-value">{{ row.mainTeamPower || '-' }}</span>
              </div>
              <div class="item-row">
                <span class="item-label">Melhor Tempo:</span>
                <span class="item-value">{{ row.bestTime || '-' }}</span>
              </div>
            </div>
            <mat-divider></mat-divider>
          </mat-list-item>
        </mat-list>
      </div>

      <div *ngIf="!loading() && !hasRows() && !error()" class="empty">
        <p>Nenhum dado carregado. Clique em "Recarregar" para buscar dados.</p>
      </div>
    </div>
  `,
  styles: [`
    .sheet-list-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
    }

    .empty {
      background-color: #f5f5f5;
      padding: 2rem;
      text-align: center;
      color: #666;
      border-radius: 4px;
    }

    .list-wrapper {
      flex: 1;
      overflow: auto;
    }

    .list-item-content {
      width: 100%;
      padding: 0.5rem 0;
    }

    .item-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 1rem;
      padding: 0.5rem 0;
    }

    .item-label {
      font-weight: 600;
      color: #666;
    }

    .item-value {
      color: #333;
    }
  `]
})
export class SheetListComponent implements OnInit {
  @Input() sheetConfig!: SheetConfig;
  
  private sheetsService: GoogleSheetsService = inject(GoogleSheetsService);
  
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

