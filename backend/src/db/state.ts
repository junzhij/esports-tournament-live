import { Db } from './index';
import {
  GameStateAdmin,
  GameStatePublished,
  MatchInfo,
  StateAdminResponse,
  StatePublishedResponse,
  TeamInfo,
  TeamSide
} from '../types/state';

interface DbMatchRow {
  id: number;
  title: string;
  rtmp_url?: string;
  best_of: number;
  ban_count: number;
  current_game_no: number;
  status: 'running' | 'finished';
  score_a: number;
  score_b: number;
  timer_base_seconds?: number;
  timer_started_at?: string | null;
}

interface DbTeamRow {
  side: TeamSide;
  name: string;
  logo_url: string;
  color: string;
}

interface DbGameRow {
  game_no: number;
  bp_draft_json: string | null;
  bp_published_json: string | null;
  bp_published_at: string | null;
  bp_locked: number;
  result_draft_json: string | null;
  result_published_json: string | null;
  result_published_at: string | null;
}

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadMatch(db: Db): DbMatchRow {
  const row = db.prepare('SELECT * FROM match WHERE id = 1').get() as DbMatchRow | undefined;
  if (!row) throw new Error('Match not found');
  return row;
}

export function loadTeams(db: Db): Record<TeamSide, TeamInfo> {
  const rows = db.prepare('SELECT side, name, logo_url, color FROM team').all() as DbTeamRow[];
  const teams: Record<TeamSide, TeamInfo> = {
    A: { name: '', logo_url: '', color: '' },
    B: { name: '', logo_url: '', color: '' }
  };
  rows.forEach((row) => {
    teams[row.side] = {
      name: row.name,
      logo_url: row.logo_url,
      color: row.color
    };
  });
  return teams;
}

export function loadGames(db: Db): DbGameRow[] {
  return db
    .prepare(
      'SELECT game_no, bp_draft_json, bp_published_json, bp_published_at, bp_locked, result_draft_json, result_published_json, result_published_at FROM game WHERE match_id = 1 ORDER BY game_no ASC'
    )
    .all() as DbGameRow[];
}

export function buildState(db: Db, includeDrafts: boolean): StatePublishedResponse | StateAdminResponse {
  const matchRow = loadMatch(db);
  const teams = loadTeams(db);
  const gamesRows = loadGames(db);

  const match: MatchInfo = {
    id: matchRow.id,
    title: matchRow.title,
    rtmp_url: matchRow.rtmp_url ?? '',
    best_of: matchRow.best_of,
    ban_count: matchRow.ban_count,
    current_game_no: matchRow.current_game_no,
    status: matchRow.status,
    score_a: matchRow.score_a,
    score_b: matchRow.score_b,
    timer_base_seconds: matchRow.timer_base_seconds ?? 0,
    timer_started_at: matchRow.timer_started_at ?? null
  };

  const games: Record<string, GameStatePublished | GameStateAdmin> = {};

  for (const row of gamesRows) {
    const published: GameStatePublished = {
      bp: parseJson(row.bp_published_json),
      bp_locked: row.bp_locked === 1,
      result: parseJson(row.result_published_json)
    };

    if (includeDrafts) {
      const admin: GameStateAdmin = {
        ...published,
        bp_draft: parseJson(row.bp_draft_json),
        result_draft: parseJson(row.result_draft_json)
      };
      games[String(row.game_no)] = admin;
    } else {
      games[String(row.game_no)] = published;
    }
  }

  if (includeDrafts) {
    const response: StateAdminResponse = {
      match,
      teams,
      games: games as Record<string, GameStateAdmin>
    };
    return response;
  }

  const response: StatePublishedResponse = {
    match,
    teams,
    games: games as Record<string, GameStatePublished>
  };
  return response;
}
