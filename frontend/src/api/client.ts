import { AdminState, BpPayload, ResultPayload, TeamSide } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const body = await parseBody(response);
  if (!response.ok) {
    const message = typeof body === 'object' && body && 'error' in body ? String((body as any).error) : response.statusText;
    throw new ApiError(message, response.status, body);
  }

  return body as T;
}

export const api = {
  getAdminState: () => fetchJson<AdminState>('/api/admin/state'),
  updateMatch: (payload: Partial<{ title: string; best_of: number; ban_count: number; current_game_no: number; status: 'running' | 'finished' }>) =>
    fetchJson<{ ok: boolean }>('/api/match', { method: 'PATCH', body: JSON.stringify(payload) }),
  updateTeam: (side: TeamSide, payload: Partial<{ name: string; logo_url: string; color: string }>) =>
    fetchJson<{ ok: boolean }>(`/api/team/${side}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  saveBpDraft: (gameNo: number, payload: BpPayload) =>
    fetchJson<{ ok: boolean }>(`/api/game/${gameNo}/bp`, { method: 'POST', body: JSON.stringify(payload) }),
  publishBp: (gameNo: number) => fetchJson<{ ok: boolean }>(`/api/game/${gameNo}/publish`, { method: 'POST', body: '{}' }),
  lockBp: (gameNo: number) => fetchJson<{ ok: boolean }>(`/api/game/${gameNo}/lock`, { method: 'POST', body: '{}' }),
  publishResult: (gameNo: number, payload: ResultPayload) =>
    fetchJson<{ ok: boolean }>(`/api/game/${gameNo}/result`, { method: 'POST', body: JSON.stringify(payload) }),
  rollback: (gameNo: number, type: 'bp' | 'result') =>
    fetchJson<{ ok: boolean }>(`/api/game/${gameNo}/rollback`, { method: 'POST', body: JSON.stringify({ type }) })
};
