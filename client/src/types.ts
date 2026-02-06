export type TeamSide = 'A' | 'B';

export interface TeamInfo {
  name: string;
  logo_url: string;
  color: string;
}

export interface MatchInfo {
  id: number;
  title: string;
  rtmp_url: string;
  best_of: number;
  ban_count: number;
  current_game_no: number;
  status: 'running' | 'finished';
  score_a: number;
  score_b: number;
  timer_base_seconds: number;
  timer_started_at: string | null;
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

export interface GameStatePublished {
  bp: BpPayload | null;
  bp_locked: boolean;
  result: ResultPayload | null;
}

export interface StatePublishedResponse {
  match: MatchInfo;
  teams: Record<TeamSide, TeamInfo>;
  games: Record<string, GameStatePublished>;
}

export interface WsMessage<T = unknown> {
  type: string;
  payload?: T;
}
