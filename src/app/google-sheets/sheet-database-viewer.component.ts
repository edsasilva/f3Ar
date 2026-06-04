import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { GoogleSheetsService } from './google-sheets.service';

@Component({
  selector: 'sheet-database-viewer',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf],
  templateUrl: './sheet-database-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetDatabaseViewerComponent {
  private readonly googleSheetsService = inject(GoogleSheetsService);

  readonly rows = this.googleSheetsService.rows;
  readonly loading = this.googleSheetsService.loading;
  readonly error = this.googleSheetsService.error;
  readonly hasRows = this.googleSheetsService.hasRows;

  readonly sheetId = signal('19jkKZ9AWh247e-TA8oXiTO9_cxhHMNMrwqPrCJGRzpM');
  readonly endpoint = computed(
    () =>
      `https://docs.google.com/spreadsheets/d/${this.sheetId()}/gviz/tq?tqx=out:json`,
  );

  async loadSheet(): Promise<void> {
    await this.googleSheetsService.loadFromPublicGoogleSheetId(
      this.sheetId(),
    );
  }
}
