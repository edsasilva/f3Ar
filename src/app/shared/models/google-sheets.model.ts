export interface GoogleSheetRow {
  timestamp?: string;
  playerName?: string;
  mainTeam?: string;
  mainTeamPower?: string;
  bestTime?: string;
  thp?: string;
  professionLevel?: string;
  [key: string]: string | undefined;
}
