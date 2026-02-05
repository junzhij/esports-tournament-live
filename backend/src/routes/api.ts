import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { buildState, loadMatch } from '../db/state';
import { ensureGamesForBestOf, initDb } from '../db';
import { broadcast } from '../ws/bus';
import { BpPayload, ResultPayload, TeamSide } from '../types/state';

const db = initDb();

function nowIso() {
  return new Date().toISOString();
}

function parseGameNo(param: string): number | null {
  const num = Number(param);
  if (!Number.isInteger(num) || num < 1) return null;
  return num;
}

function ensureGameExists(gameNo: number) {
  const match = loadMatch(db);
  if (gameNo > match.best_of) {
    return { error: `gameNo exceeds best_of (${match.best_of})` };
  }
  ensureGamesForBestOf(db, match.id, match.best_of);
  return { match };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateBpForPublish(payload: BpPayload, banCount: number): string[] {
  const errors: string[] = [];
  if (!payload || !payload.teamA || !payload.teamB) {
    return ['Invalid payload'];
  }
  const teams = [payload.teamA, payload.teamB];
  for (const [idx, team] of teams.entries()) {
    if (!Array.isArray(team.bans) || team.bans.length !== banCount) {
      errors.push(`team${idx === 0 ? 'A' : 'B'} bans length must be ${banCount}`);
    }
    if (!Array.isArray(team.picks) || team.picks.length !== 5) {
      errors.push(`team${idx === 0 ? 'A' : 'B'} picks length must be 5`);
    }
    if (Array.isArray(team.picks)) {
      team.picks.forEach((pick, pickIdx) => {
        if (!isNonEmptyString(pick.pos) || !isNonEmptyString(pick.hero) || !isNonEmptyString(pick.player)) {
          errors.push(`team${idx === 0 ? 'A' : 'B'} picks[${pickIdx}] must include pos/hero/player`);
        }
      });
    }
  }
  return errors;
}

function validateResult(payload: ResultPayload): string[] {
  const errors: string[] = [];
  if (!payload) return ['Invalid payload'];
  if (payload.winner !== 'A' && payload.winner !== 'B') {
    errors.push('winner must be A or B');
  }
  if (!payload.mvp || !isNonEmptyString(payload.mvp.player) || !isNonEmptyString(payload.mvp.hero) || !isNonEmptyString(payload.mvp.kda)) {
    errors.push('mvp fields are required');
  }
  if (!payload.key_stats || !isNonEmptyString(payload.key_stats.damage_share) || !isNonEmptyString(payload.key_stats.damage_taken_share) || !isNonEmptyString(payload.key_stats.participation)) {
    errors.push('key_stats fields are required');
  }
  return errors;
}

function recalcScore(bestOf: number) {
  const rows = db.prepare('SELECT result_published_json FROM game WHERE match_id = 1').all() as { result_published_json: string | null }[];
  let scoreA = 0;
  let scoreB = 0;
  for (const row of rows) {
    if (!row.result_published_json) continue;
    try {
      const parsed = JSON.parse(row.result_published_json) as ResultPayload;
      if (parsed.winner === 'A') scoreA += 1;
      if (parsed.winner === 'B') scoreB += 1;
    } catch {
      continue;
    }
  }
  const winTarget = Math.ceil(bestOf / 2);
  const status = scoreA >= winTarget || scoreB >= winTarget ? 'finished' : 'running';
  return { scoreA, scoreB, status };
}

function deriveStatusFromScore(bestOf: number, scoreA: number, scoreB: number) {
  const winTarget = Math.ceil(bestOf / 2);
  return scoreA >= winTarget || scoreB >= winTarget ? 'finished' : 'running';
}

export async function registerApiRoutes(fastify: FastifyInstance) {
  fastify.get('/api/health', async () => {
    return { status: 'ok', time: nowIso() };
  });

  fastify.get('/api/state', async () => {
    return buildState(db, false);
  });

  fastify.get('/api/admin/state', async () => {
    return buildState(db, true);
  });

  fastify.patch('/api/match', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as Partial<{
      title: string;
      best_of: number;
      ban_count: number;
      current_game_no: number;
      status: 'running' | 'finished';
    }>;

    if (body.best_of !== undefined && (!Number.isInteger(body.best_of) || body.best_of < 1)) {
      return reply.code(400).send({ error: 'best_of must be a positive integer' });
    }
    if (body.ban_count !== undefined && (!Number.isInteger(body.ban_count) || body.ban_count < 1)) {
      return reply.code(400).send({ error: 'ban_count must be a positive integer' });
    }
    if (body.current_game_no !== undefined && (!Number.isInteger(body.current_game_no) || body.current_game_no < 1)) {
      return reply.code(400).send({ error: 'current_game_no must be a positive integer' });
    }
    if (body.status !== undefined && body.status !== 'running' && body.status !== 'finished') {
      return reply.code(400).send({ error: 'status must be running or finished' });
    }

    const updates: string[] = [];
    const params: unknown[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      params.push(body.title);
    }
    if (body.best_of !== undefined) {
      updates.push('best_of = ?');
      params.push(body.best_of);
    }
    if (body.ban_count !== undefined) {
      updates.push('ban_count = ?');
      params.push(body.ban_count);
    }
    if (body.current_game_no !== undefined) {
      updates.push('current_game_no = ?');
      params.push(body.current_game_no);
    }
    if (body.status !== undefined) {
      updates.push('status = ?');
      params.push(body.status);
    }

    if (updates.length === 0) {
      return reply.code(400).send({ error: 'No fields to update' });
    }

    updates.push('updated_at = ?');
    params.push(nowIso());

    const stmt = `UPDATE match SET ${updates.join(', ')} WHERE id = 1`;
    db.prepare(stmt).run(...params);

    const match = loadMatch(db);
    ensureGamesForBestOf(db, match.id, match.best_of);

    const teams = buildState(db, false).teams;
    broadcast({ type: 'match_update', payload: { match, teams } });

    return { ok: true };
  });

  fastify.post('/api/match/score', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { score_a?: number; score_b?: number };
    if (!Number.isInteger(body.score_a) || !Number.isInteger(body.score_b) || (body.score_a ?? 0) < 0 || (body.score_b ?? 0) < 0) {
      return reply.code(400).send({ error: 'score_a/score_b 必须为非负整数' });
    }

    const match = loadMatch(db);
    const status = deriveStatusFromScore(match.best_of, body.score_a!, body.score_b!);
    const now = nowIso();
    db.prepare('UPDATE match SET score_a = ?, score_b = ?, status = ?, updated_at = ? WHERE id = 1').run(
      body.score_a,
      body.score_b,
      status,
      now
    );

    const updatedMatch = loadMatch(db);
    const teams = buildState(db, false).teams;
    broadcast({ type: 'score_update', payload: { score_a: updatedMatch.score_a, score_b: updatedMatch.score_b } });
    broadcast({ type: 'match_update', payload: { match: updatedMatch, teams } });
    return { ok: true };
  });

  fastify.post('/api/match/timer/reset', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { base_seconds?: number } | undefined;
    const baseSeconds = body?.base_seconds ?? 0;
    if (!Number.isInteger(baseSeconds) || baseSeconds < 0) {
      return reply.code(400).send({ error: 'base_seconds 必须为非负整数' });
    }

    const now = nowIso();
    db.prepare('UPDATE match SET timer_base_seconds = ?, timer_started_at = ?, updated_at = ? WHERE id = 1').run(
      baseSeconds,
      now,
      now
    );
    const match = loadMatch(db);
    const teams = buildState(db, false).teams;
    broadcast({ type: 'timer_update', payload: { timer_base_seconds: match.timer_base_seconds, timer_started_at: match.timer_started_at } });
    broadcast({ type: 'match_update', payload: { match, teams } });
    return { ok: true };
  });

  fastify.patch('/api/team/:side', async (request: FastifyRequest, reply: FastifyReply) => {
    const side = (request.params as { side: TeamSide }).side;
    if (side !== 'A' && side !== 'B') {
      return reply.code(400).send({ error: 'side must be A or B' });
    }

    const body = request.body as Partial<{
      name: string;
      logo_url: string;
      color: string;
    }>;

    const updates: string[] = [];
    const params: unknown[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      params.push(body.name);
    }
    if (body.logo_url !== undefined) {
      updates.push('logo_url = ?');
      params.push(body.logo_url);
    }
    if (body.color !== undefined) {
      updates.push('color = ?');
      params.push(body.color);
    }

    if (updates.length === 0) {
      return reply.code(400).send({ error: 'No fields to update' });
    }

    const stmt = `UPDATE team SET ${updates.join(', ')} WHERE side = ?`;
    db.prepare(stmt).run(...params, side);

    const match = loadMatch(db);
    const teams = buildState(db, false).teams;
    broadcast({ type: 'match_update', payload: { match, teams } });

    return { ok: true };
  });

  fastify.post('/api/game/:gameNo/bp', async (request: FastifyRequest, reply: FastifyReply) => {
    const gameNoParam = (request.params as { gameNo: string }).gameNo;
    const gameNo = parseGameNo(gameNoParam);
    if (!gameNo) return reply.code(400).send({ error: 'Invalid gameNo' });

    const { match, error } = ensureGameExists(gameNo) as { match?: ReturnType<typeof loadMatch>; error?: string };
    if (error) return reply.code(400).send({ error });

    const body = request.body as BpPayload;
    if (!body || !body.teamA || !body.teamB) {
      return reply.code(400).send({ error: 'Invalid payload' });
    }

    const game = db.prepare('SELECT bp_locked FROM game WHERE match_id = 1 AND game_no = ?').get(gameNo) as { bp_locked: number };
    if (game.bp_locked === 1) {
      return reply.code(409).send({ error: 'BP is locked' });
    }

    db.prepare('UPDATE game SET bp_draft_json = ? WHERE match_id = 1 AND game_no = ?').run(JSON.stringify(body), gameNo);

    return { ok: true };
  });

  fastify.post('/api/game/:gameNo/publish', async (request: FastifyRequest, reply: FastifyReply) => {
    const gameNoParam = (request.params as { gameNo: string }).gameNo;
    const gameNo = parseGameNo(gameNoParam);
    if (!gameNo) return reply.code(400).send({ error: 'Invalid gameNo' });

    const { match, error } = ensureGameExists(gameNo) as { match?: ReturnType<typeof loadMatch>; error?: string };
    if (error || !match) return reply.code(400).send({ error });

    const row = db.prepare('SELECT bp_draft_json, bp_locked FROM game WHERE match_id = 1 AND game_no = ?').get(gameNo) as {
      bp_draft_json: string | null;
      bp_locked: number;
    };

    if (row.bp_locked === 1) {
      return reply.code(409).send({ error: 'BP is locked' });
    }

    if (!row.bp_draft_json) {
      return reply.code(400).send({ error: 'No BP draft to publish' });
    }

    const payload = JSON.parse(row.bp_draft_json) as BpPayload;
    const errors = validateBpForPublish(payload, match.ban_count);
    if (errors.length > 0) {
      return reply.code(400).send({ error: 'Validation failed', details: errors });
    }

    const publishedAt = nowIso();

    const tx = db.transaction(() => {
      db.prepare('UPDATE game SET bp_published_json = ?, bp_published_at = ? WHERE match_id = 1 AND game_no = ?').run(
        JSON.stringify(payload),
        publishedAt,
        gameNo
      );
      db.prepare('INSERT INTO publish_history (match_id, game_no, type, payload_json, created_at) VALUES (1, ?, ?, ?, ?)').run(
        gameNo,
        'bp',
        JSON.stringify(payload),
        publishedAt
      );
    });

    tx();

    broadcast({
      type: 'bp_update',
      payload: {
        game_no: gameNo,
        teamA: payload.teamA,
        teamB: payload.teamB,
        locked: false,
        published_at: publishedAt
      }
    });

    return { ok: true };
  });

  fastify.post('/api/game/:gameNo/lock', async (request: FastifyRequest, reply: FastifyReply) => {
    const gameNoParam = (request.params as { gameNo: string }).gameNo;
    const gameNo = parseGameNo(gameNoParam);
    if (!gameNo) return reply.code(400).send({ error: 'Invalid gameNo' });

    const { error } = ensureGameExists(gameNo) as { error?: string };
    if (error) return reply.code(400).send({ error });

    db.prepare('UPDATE game SET bp_locked = 1 WHERE match_id = 1 AND game_no = ?').run(gameNo);

    const row = db
      .prepare('SELECT bp_published_json, bp_published_at FROM game WHERE match_id = 1 AND game_no = ?')
      .get(gameNo) as {
        bp_published_json: string | null;
        bp_published_at: string | null;
      };

    if (row.bp_published_json) {
      const payload = JSON.parse(row.bp_published_json) as BpPayload;
      broadcast({
        type: 'bp_update',
        payload: {
          game_no: gameNo,
          teamA: payload.teamA,
          teamB: payload.teamB,
          locked: true,
          published_at: row.bp_published_at ?? nowIso()
        }
      });
    }

    return { ok: true };
  });

  fastify.post('/api/game/:gameNo/result', async (request: FastifyRequest, reply: FastifyReply) => {
    const gameNoParam = (request.params as { gameNo: string }).gameNo;
    const gameNo = parseGameNo(gameNoParam);
    if (!gameNo) return reply.code(400).send({ error: 'Invalid gameNo' });

    const { match, error } = ensureGameExists(gameNo) as { match?: ReturnType<typeof loadMatch>; error?: string };
    if (error || !match) return reply.code(400).send({ error });

    const payload = request.body as ResultPayload;
    const errors = validateResult(payload);
    if (errors.length > 0) {
      return reply.code(400).send({ error: 'Validation failed', details: errors });
    }

    const publishedAt = nowIso();

    const tx = db.transaction(() => {
      db.prepare('UPDATE game SET result_draft_json = ?, result_published_json = ?, result_published_at = ? WHERE match_id = 1 AND game_no = ?').run(
        JSON.stringify(payload),
        JSON.stringify(payload),
        publishedAt,
        gameNo
      );

      db.prepare('INSERT INTO publish_history (match_id, game_no, type, payload_json, created_at) VALUES (1, ?, ?, ?, ?)').run(
        gameNo,
        'result',
        JSON.stringify(payload),
        publishedAt
      );

      const score = recalcScore(match.best_of);
      db.prepare('UPDATE match SET score_a = ?, score_b = ?, status = ?, updated_at = ? WHERE id = 1').run(
        score.scoreA,
        score.scoreB,
        score.status,
        publishedAt
      );
    });

    tx();

    const score = recalcScore(match.best_of);
    broadcast({ type: 'result_update', payload: { game_no: gameNo, ...payload } });
    broadcast({ type: 'score_update', payload: { score_a: score.scoreA, score_b: score.scoreB } });

    return { ok: true };
  });

  fastify.post('/api/game/:gameNo/rollback', async (request: FastifyRequest, reply: FastifyReply) => {
    const gameNoParam = (request.params as { gameNo: string }).gameNo;
    const gameNo = parseGameNo(gameNoParam);
    if (!gameNo) return reply.code(400).send({ error: 'Invalid gameNo' });

    const { match, error } = ensureGameExists(gameNo) as { match?: ReturnType<typeof loadMatch>; error?: string };
    if (error || !match) return reply.code(400).send({ error });

    const body = request.body as { type?: 'bp' | 'result' };
    if (body.type !== 'bp' && body.type !== 'result') {
      return reply.code(400).send({ error: 'type must be bp or result' });
    }

    const row = db.prepare('SELECT bp_published_json, result_published_json FROM game WHERE match_id = 1 AND game_no = ?').get(gameNo) as {
      bp_published_json: string | null;
      result_published_json: string | null;
    };

    const currentPayload = body.type === 'bp' ? row.bp_published_json : row.result_published_json;
    if (!currentPayload) {
      return reply.code(409).send({ error: 'No published data to rollback' });
    }

    const history = db
      .prepare('SELECT payload_json, created_at FROM publish_history WHERE match_id = 1 AND game_no = ? AND type = ? ORDER BY created_at DESC')
      .all(gameNo, body.type) as { payload_json: string; created_at: string }[];

    const currentIndex = history.findIndex((item) => item.payload_json === currentPayload);
    if (currentIndex === -1 || currentIndex === history.length - 1) {
      return reply.code(409).send({ error: 'No previous snapshot to rollback' });
    }

    const previous = history[currentIndex + 1];
    const publishedAt = nowIso();

    const tx = db.transaction(() => {
      if (body.type === 'bp') {
        db.prepare('UPDATE game SET bp_published_json = ?, bp_published_at = ? WHERE match_id = 1 AND game_no = ?').run(
          previous.payload_json,
          publishedAt,
          gameNo
        );
      } else {
        db.prepare('UPDATE game SET result_published_json = ?, result_published_at = ? WHERE match_id = 1 AND game_no = ?').run(
          previous.payload_json,
          publishedAt,
          gameNo
        );

        const score = recalcScore(match.best_of);
        db.prepare('UPDATE match SET score_a = ?, score_b = ?, status = ?, updated_at = ? WHERE id = 1').run(
          score.scoreA,
          score.scoreB,
          score.status,
          publishedAt
        );
      }
    });

    tx();

    if (body.type === 'bp') {
      const payload = JSON.parse(previous.payload_json) as BpPayload;
      broadcast({
        type: 'bp_update',
        payload: {
          game_no: gameNo,
          teamA: payload.teamA,
          teamB: payload.teamB,
          locked: false,
          published_at: publishedAt
        }
      });
    } else {
      const payload = JSON.parse(previous.payload_json) as ResultPayload;
      const score = recalcScore(match.best_of);
      broadcast({ type: 'result_update', payload: { game_no: gameNo, ...payload } });
      broadcast({ type: 'score_update', payload: { score_a: score.scoreA, score_b: score.scoreB } });
    }

    return { ok: true };
  });
}
