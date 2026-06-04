export interface GoogleSheetRow {
  readonly timestamp: string | null;
  readonly playerName: string | null;
  readonly mainTeam: string | null;
  readonly mainTeamPower: string | null;
  readonly bestTime: string | null;
  readonly thp: string | null;
  readonly professionLevel: number | null;
}
