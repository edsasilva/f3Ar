import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GoogleSheetRow } from './google-sheets.model';

interface GoogleSheetPayload {
  table?: {
    cols?: Array<{ id?: string; label?: string } | null>;
    rows?: Array<{ c?: Array<{ v?: unknown; f?: string } | null> | null } | null>;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private readonly http = inject(HttpClient);

  readonly rows = signal<GoogleSheetRow[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly hasRows = computed(() => this.rows().length > 0);
  readonly summary = computed(() => ({
    rows: this.rows(),
    loading: this.loading(),
    error: this.error(),
    hasRows: this.hasRows(),
  }));

  constructor() {
    effect(() => {
      if (this.error()) {
        console.warn('GoogleSheetsService error:', this.error());
      }
    });
  }

  private parseCellValue(cell: { v?: unknown; f?: string } | null | undefined): string | number | null {
    if (!cell) {
      return null;
    }

    if (cell.f != null) {
      return cell.f;
    }

    if (cell.v == null) {
      return null;
    }

    if (typeof cell.v === 'string' && cell.v.startsWith('Date(')) {
      return cell.v;
    }

    return typeof cell.v === 'string' || typeof cell.v === 'number'
      ? cell.v
      : null;
  }

  private mapColumnIdToKey(columnId: string | undefined): keyof GoogleSheetRow | null {
    switch (columnId) {
      case 'A':
        return 'timestamp';
      case 'B':
        return 'playerName';
      case 'C':
        return 'mainTeam';
      case 'D':
        return 'mainTeamPower';
      case 'E':
        return 'bestTime';
      case 'F':
        return 'thp';
      case 'G':
        return 'professionLevel';
      default:
        return null;
    }
  }

  private parseGoogleSheetResponse(responseText: string): GoogleSheetRow[] {
    const marker = 'google.visualization.Query.setResponse(';
    const startIndex = responseText.indexOf(marker);
    const endIndex = responseText.lastIndexOf(');');
    const jsonText =
      startIndex >= 0 && endIndex > startIndex
        ? responseText.slice(startIndex + marker.length, endIndex).trim()
        : responseText.slice(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);

    const payload = JSON.parse(jsonText) as GoogleSheetPayload;
    const cols = Array.isArray(payload.table?.cols) ? payload.table.cols : [];

    return Array.isArray(payload.table?.rows)
      ? payload.table.rows.map((row) => {
          const cells = Array.isArray(row?.c) ? row.c : [];
          const record: { -readonly [K in keyof GoogleSheetRow]: GoogleSheetRow[K] } = {
            timestamp: null,
            playerName: null,
            mainTeam: null,
            mainTeamPower: null,
            bestTime: null,
            thp: null,
            professionLevel: null,
          };

          cols.forEach((col, idx) => {
            const key = this.mapColumnIdToKey(col?.id);
            if (!key) {
              return;
            }

            const rawValue = this.parseCellValue(cells[idx]);

            if (key === 'professionLevel') {
              record[key] = typeof rawValue === 'number' ? rawValue : null;
              return;
            }

            record[key] = rawValue === null ? null : String(rawValue);
          });

          return record as GoogleSheetRow;
        })
      : [];
  }

  async loadFromPublicGoogleSheetId(sheetId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const endpoint = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
      const responseText = await firstValueFrom(
        this.http.get(endpoint, { responseType: 'text' as const }),
      );
      console.log('Google Sheets response:', responseText);

      this.rows.set(this.parseGoogleSheetResponse(responseText));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Falha ao carregar a planilha do Google.';
      this.error.set(message);
      this.rows.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
