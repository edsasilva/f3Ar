import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SheetDatabaseViewerComponent } from './google-sheets/sheet-database-viewer.component';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, SheetDatabaseViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('f3ar');
}
