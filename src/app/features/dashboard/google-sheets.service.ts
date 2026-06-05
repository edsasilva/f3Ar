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

      return data.table.rows.map((row: { c: { v?: string | number | boolean | null }[] }) => {
        const record: Record<string, string> = {};
        row.c.forEach((cell: { v?: string | number | boolean | null }, idx: number) => {
          const key = this.mapColumnIdToKey(headers[idx] || String.fromCharCode(65 + idx));
          record[key] = this.parseCellValue(cell.v ?? null);
        });
        return record as GoogleSheetRow;
      });
    } catch (err) {
      console.error('Error parsing Google Sheet:', err);
      return [];
    }
  }

  loadFromPublicGoogleSheetId(sheetId: string): void {
    this.loading.set(true);
    this.error.set(null);

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/query?tqx=out:json`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (responseText: string) => {
        const parsedRows = this.parseGoogleSheetResponse(responseText);
        this.rows.set(parsedRows);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading sheet:', err);
        this.error.set('Erro ao carregar planilha');
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
