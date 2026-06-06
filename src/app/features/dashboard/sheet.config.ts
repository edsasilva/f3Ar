export interface SheetConfig {
  id: string;
  name: string;
  sheetId: string;
  description?: string;
}

export const SHEET_CONFIGS: SheetConfig[] = [
  {
    id: 'players',
    name: 'Players',
    sheetId: '19jkKZ9AWh247e-TA8oXiTO9_cxhHMNMrwqPrCJGRzpM', // Substitua com o ID da sua planilha pública
    description: 'System players list'
  },
  {
    id: 'teams',
    name: 'Teams',
    sheetId: '19jkKZ9AWh247e-TA8oXiTO9_cxhHMNMrwqPrCJGRzpM', // Substitua com o ID da sua planilha pública
    description: 'Registered teams list'
  },
  {
    id: 'events',
    name: 'Events',
    sheetId: '19jkKZ9AWh247e-TA8oXiTO9_cxhHMNMrwqPrCJGRzpM', // Substitua com o ID da sua planilha pública
    description: 'Events and competitions'
  }
];

/**
 * Como usar:
 *
 * 1. Crie uma planilha no Google Sheets
 * 2. Compartilhe com "Qualquer pessoa com o link pode visualizar"
 * 3. Copie o ID da URL: docs.google.com/spreadsheets/d/[ID_AQUI]/edit
 * 4. Cole o ID no sheetId acima
 * 5. Certifique-se que a primeira linha tem headers (A, B, C, D, E, F, G)
 * https://docs.google.com/spreadsheets/d/19jkKZ9AWh247e-TA8oXiTO9_cxhHMNMrwqPrCJGRzpM/edit?usp=sharing
 */
