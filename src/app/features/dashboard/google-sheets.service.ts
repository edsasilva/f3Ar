import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { GoogleSheetRow } from './google-sheets.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  rows = signal<GoogleSheetRow[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  hasRows = computed(() => this.rows().length > 0);
  summary = computed(() => ({
    total: this.rows().length,
    loaded: this.hasRows()
  }));

  constructor(private http: HttpClient) {}

  private parseCellValue(value: string | number | boolean | null): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (typeof value === 'string' && value.startsWith('Date(')) {
      const dateMatch = value.match(/Date\((\d+),(\d+),(\d+)/);
      if (dateMatch) {
        const [_, year, month, day] = dateMatch;
        return `${day}/${parseInt(month) + 1}/${year}`;
      }
      return value;
    }
    return String(value);
  }

  private mapColumnIdToKey(columnId: string): keyof GoogleSheetRow {
    const mapping: Record<string, keyof GoogleSheetRow> = {
      A: 'timestamp',
      B: 'playerName',
      C: 'mainTeam',
      D: 'mainTeamPower',
      E: 'bestTime',
      F: 'thp',
      G: 'professionLevel'
    };
    return mapping[columnId] || 'timestamp';
  }

  private parseGoogleSheetResponse(responseText: string): GoogleSheetRow[] {
    try {
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid response format');
      }

      const jsonStr = responseText.substring(jsonStart, jsonEnd + 1);
      const data = JSON.parse(jsonStr);

      if (!data.table || !data.table.rows) {
        return [];
      }

      const headers: string[] = [];
      if (data.table.cols) {
        headers.push(
          ...data.table.cols.map(
            (_col: { label?: string }, idx: number) => String.fromCharCode(65 + idx)
          )
        );
      }

      return data.table.rows.map((row: { c: any[] }) => {
      const record: Record<string, string> = {};

      // Garantimos que row.c existe antes de iterar
      if (row && row.c) {
        row.c.forEach((cell: { v?: string | number | boolean | null } | null, idx: number) => {
          const key = this.mapColumnIdToKey(headers[idx] || String.fromCharCode(65 + idx));

          // Mudança crucial: cell?.v garante que se a célula inteira for null,
          // o código não quebra e passa null para o método parseCellValue
          record[key] = this.parseCellValue(cell?.v ?? null);
        });
      }

      return record as GoogleSheetRow;
    });
    } catch (err) {
      console.error('Error parsing Google Sheet:', err);
      return [];
    }
  }

  loadFromPublicGoogleSheetId(sheetId: string): void {
    // Verify sheetId is not placeholder
    if (sheetId === 'SEU_SHEET_ID_AQUI' || sheetId.length < 10) {
      this.error.set('❌ Configure a valid spreadsheet ID. See GOOGLE_SHEETS_SETUP.md');
      this.rows.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (responseText: string) => {
        const parsedRows = this.parseGoogleSheetResponse(responseText);
        this.rows.set(parsedRows);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading sheet:', err);

        // Check for specific error cases
        if (err.status === 404) {
          this.error.set('❌ Spreadsheet not found or not public. Verify ID and permissions.');
        } else if (err.status === 0) {
          this.error.set('❌ Network error. Check your connection.');
        } else {
          this.error.set(`❌ Error loading spreadsheet: ${err.statusText || 'Unknown error'}`);
        }

        this.rows.set([]);
        this.loading.set(false);
      }
    });
  }

  clearData(): void {
    this.rows.set([]);
    this.error.set(null);
  }
}
