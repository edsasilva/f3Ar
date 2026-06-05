export interface SheetConfig {
  id: string;
  name: string;
  sheetId: string;
  description?: string;
}

export const SHEET_CONFIGS: SheetConfig[] = [
  {
    id: 'players',
    name: 'Jogadores',
    sheetId: 'SEU_SHEET_ID_AQUI', // Substitua com o ID da sua planilha pública
    description: 'Lista de jogadores do sistema'
  },
  {
    id: 'teams',
    name: 'Times',
    sheetId: 'SEU_SHEET_ID_AQUI', // Substitua com o ID da sua planilha pública
    description: 'Lista de times registrados'
  },
  {
    id: 'events',
    name: 'Eventos',
    sheetId: 'SEU_SHEET_ID_AQUI', // Substitua com o ID da sua planilha pública
    description: 'Eventos e competições'
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
 */

