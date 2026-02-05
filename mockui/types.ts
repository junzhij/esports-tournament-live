export interface Team {
  id: string;
  name: string;
  region: string;
  score: number;
  color: string;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
  role: string; // Top, Jungle, Mid, Bot, Support
  champion?: Champion;
  stats?: {
    kda: string;
    kdaRatio: string;
    damagePercent: string;
    kp: string;
    csMin: string;
  };
}

export interface Champion {
  name: string;
  image: string;
}

export enum PickState {
  LOCKED = 'LOCKED',
  PICKING = 'PICKING',
  WAITING = 'WAITING',
  EMPTY = 'EMPTY'
}

export interface MatchState {
  seriesScore: string;
  gameNumber: number;
  patch: string;
  timer: number;
}
