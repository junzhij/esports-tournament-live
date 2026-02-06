import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let dbInstance: any | null = null;

export type Db = any;

export function initDb(): Db {
  if (dbInstance) return dbInstance;

  const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'app.db');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS match (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      rtmp_url TEXT NOT NULL DEFAULT '',
      best_of INTEGER NOT NULL,
      ban_count INTEGER NOT NULL,
      current_game_no INTEGER NOT NULL,
      status TEXT NOT NULL,
      score_a INTEGER NOT NULL,
      score_b INTEGER NOT NULL,
      timer_base_seconds INTEGER NOT NULL DEFAULT 0,
      timer_started_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY,
      side TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game (
      id INTEGER PRIMARY KEY,
      match_id INTEGER NOT NULL,
      game_no INTEGER NOT NULL,
      bp_draft_json TEXT,
      bp_published_json TEXT,
      bp_published_at TEXT,
      bp_locked INTEGER NOT NULL DEFAULT 0,
      result_draft_json TEXT,
      result_published_json TEXT,
      result_published_at TEXT,
      UNIQUE(match_id, game_no)
    );

    CREATE TABLE IF NOT EXISTS publish_history (
      id INTEGER PRIMARY KEY,
      match_id INTEGER NOT NULL,
      game_no INTEGER NOT NULL,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_game_match_no ON game(match_id, game_no);
    CREATE INDEX IF NOT EXISTS idx_history_match_game_type ON publish_history(match_id, game_no, type, created_at);
  `);

  ensureMatchColumns(db);
  seedIfNeeded(db);

  dbInstance = db;
  return db;
}

function ensureMatchColumns(db: Db) {
  const columns = db.prepare('PRAGMA table_info(match)').all() as { name: string }[];
  const names = new Set(columns.map((col) => col.name));
  if (!names.has('rtmp_url')) {
    db.exec("ALTER TABLE match ADD COLUMN rtmp_url TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has('timer_base_seconds')) {
    db.exec('ALTER TABLE match ADD COLUMN timer_base_seconds INTEGER NOT NULL DEFAULT 0');
  }
  if (!names.has('timer_started_at')) {
    db.exec('ALTER TABLE match ADD COLUMN timer_started_at TEXT');
  }
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE match SET rtmp_url = COALESCE(rtmp_url, ''), timer_base_seconds = COALESCE(timer_base_seconds, 0), timer_started_at = COALESCE(timer_started_at, ?) WHERE id = 1"
  ).run(now);
}

function seedIfNeeded(db: Db) {
  const matchCount = db.prepare('SELECT COUNT(*) as cnt FROM match').get() as { cnt: number };
  if (matchCount.cnt > 0) return;

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO match (id, title, rtmp_url, best_of, ban_count, current_game_no, status, score_a, score_b, created_at, updated_at)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run('班赛 5v5', '', 3, 3, 1, 'running', 0, 0, now, now);

  db.prepare('UPDATE match SET timer_base_seconds = 0, timer_started_at = ? WHERE id = 1').run(now);

  db.prepare(
    `INSERT INTO team (side, name, logo_url, color)
     VALUES (?, ?, ?, ?)`
  ).run('A', '红队', '', '#E53935');
  db.prepare(
    `INSERT INTO team (side, name, logo_url, color)
     VALUES (?, ?, ?, ?)`
  ).run('B', '蓝队', '', '#1E88E5');

  ensureGamesForBestOf(db, 1, 3);
}

export function ensureGamesForBestOf(db: Db, matchId: number, bestOf: number) {
  const existing = db.prepare('SELECT game_no FROM game WHERE match_id = ?').all(matchId) as { game_no: number }[];
  const existingSet = new Set(existing.map((row) => row.game_no));
  const insert = db.prepare(
    `INSERT INTO game (match_id, game_no, bp_locked)
     VALUES (?, ?, 0)`
  );

  for (let i = 1; i <= bestOf; i += 1) {
    if (!existingSet.has(i)) {
      insert.run(matchId, i);
    }
  }
}
