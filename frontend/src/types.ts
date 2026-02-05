export type TeamSide = 'A' | 'B';

export interface TeamInfo {
  name: string;
  logo_url: string;
  color: string;
}

export interface MatchInfo {
  id: number;
  title: string;
  best_of: number;
  ban_count: number;
  current_game_no: number;
  status: 'running' | 'finished';
  score_a: number;
  score_b: number;
}

export interface BpPick {
  pos: string;
  hero: string;
  player: string;
}

export interface BpTeamPayload {
  bans: string[];
  picks: BpPick[];
}

export interface BpPayload {
  teamA: BpTeamPayload;
  teamB: BpTeamPayload;
}

export interface ResultPayload {
  winner: TeamSide;
  mvp: {
    player: string;
    hero: string;
    kda: string;
  };
  key_stats: {
    damage_share: string;
    damage_taken_share: string;
    participation: string;
  };
  highlight_text?: string;
}

export interface GameStateAdmin {
  bp: BpPayload | null;
  bp_locked: boolean;
  result: ResultPayload | null;
  bp_draft: BpPayload | null;
  result_draft: ResultPayload | null;
}

export interface AdminState {
  match: MatchInfo;
  teams: Record<TeamSide, TeamInfo>;
  games: Record<string, GameStateAdmin>;
}
