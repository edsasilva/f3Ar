import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { GoogleSheetRow } from '../../shared/models/google-sheets.model';

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

  private parseCellValue(cell: any): string {
    if (!cell || (cell.v === null && !cell.f)) {
      return '';
    }

    // Prioriza o valor formatado (f) fornecido pelo Google,
    // que respeita a formatação visual da própria planilha.
    if (cell.f) {
      return cell.f;
    }

    const value = cell.v;
    // Fallback: Tenta parsear strings do tipo Date(2023,10,15)
    if (typeof value === 'string' && value.startsWith('Date(')) {
      const numbers = value.match(/\d+/g);
      if (numbers && numbers.length >= 3) {
        const [y, m, d] = numbers.map(Number);
        // Mês no Google Sheets JSON e no JS Date é indexado em 0
        const date = new Date(y, m, d);
        return date.toLocaleDateString('en-US');
      }
    }

    return value !== null && value !== undefined ? String(value) : '';
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
        row.c.forEach((cell: any, idx: number) => {
          const key = this.mapColumnIdToKey(headers[idx] || String.fromCharCode(65 + idx));
          // Passamos o objeto cell inteiro para acessar cell.f
          record[key] = this.parseCellValue(cell);
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
        this.error.set('Error loading spreadsheet');
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
