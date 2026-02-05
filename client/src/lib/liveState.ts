import { useEffect, useRef, useState } from 'react';
import {
  BpPayload,
  ResultPayload,
  StatePublishedResponse,
  TeamInfo,
  WsMessage
} from '../types';

declare global {
  interface Window {
    __API_BASE__?: string;
  }
}

const API_BASE = window.__API_BASE__ ?? import.meta.env.VITE_API_BASE;

export async function fetchState(): Promise<StatePublishedResponse> {
  if (!API_BASE) {
    throw new Error('API_BASE 未配置（请设置 window.__API_BASE__ 或 VITE_API_BASE）');
  }
  const res = await fetch(`${API_BASE}/api/state`);
  if (!res.ok) {
    throw new Error('无法获取状态');
  }
  return res.json();
}

function getWsUrl() {
  if (!API_BASE) {
    throw new Error('API_BASE 未配置（请设置 window.__API_BASE__ 或 VITE_API_BASE）');
  }
  const base = new URL(API_BASE);
  const protocol = base.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${base.host}/ws`;
}

export function applyMessage(
  state: StatePublishedResponse,
  message: WsMessage
): StatePublishedResponse {
  if (message.type === 'init' && message.payload) {
    return message.payload as StatePublishedResponse;
  }

  if (!state) return state;

  if (message.type === 'bp_update' && message.payload) {
    const payload = message.payload as {
      game_no: number;
      teamA: BpPayload['teamA'];
      teamB: BpPayload['teamB'];
      locked?: boolean;
    };
    const gameKey = String(payload.game_no);
    const current = state.games[gameKey] ?? { bp: null, bp_locked: false, result: null };
    return {
      ...state,
      games: {
        ...state.games,
        [gameKey]: {
          ...current,
          bp: { teamA: payload.teamA, teamB: payload.teamB },
          bp_locked: payload.locked ?? current.bp_locked
        }
      }
    };
  }

  if (message.type === 'result_update' && message.payload) {
    const payload = message.payload as ResultPayload & { game_no: number };
    const gameKey = String(payload.game_no);
    const current = state.games[gameKey] ?? { bp: null, bp_locked: false, result: null };
    return {
      ...state,
      games: {
        ...state.games,
        [gameKey]: {
          ...current,
          result: {
            winner: payload.winner,
            mvp: payload.mvp,
            key_stats: payload.key_stats,
            highlight_text: payload.highlight_text
          }
        }
      }
    };
  }

  if (message.type === 'score_update' && message.payload) {
    const payload = message.payload as { score_a: number; score_b: number };
    return {
      ...state,
      match: {
        ...state.match,
        score_a: payload.score_a,
        score_b: payload.score_b
      }
    };
  }

  if (message.type === 'match_update' && message.payload) {
    const payload = message.payload as StatePublishedResponse & {
      match?: StatePublishedResponse['match'];
      teams?: Record<'A' | 'B', TeamInfo>;
    };
    if ((payload as StatePublishedResponse).games) {
      return payload as StatePublishedResponse;
    }
    return {
      ...state,
      match: payload.match ?? state.match,
      teams: payload.teams ?? state.teams
    };
  }

  return state;
}

export function useLiveState() {
  const [state, setState] = useState<StatePublishedResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);

  const connect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    const ws = new WebSocket(getWsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WsMessage;
        setState((prev) => {
          if (!prev) {
            return message.type === 'init' && message.payload ? (message.payload as StatePublishedResponse) : prev;
          }
          return applyMessage(prev, message);
        });
      } catch (err) {
        console.error(err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
      }
      reconnectTimer.current = window.setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      setError('连接中断');
      ws.close();
    };
  };

  useEffect(() => {
    if (!API_BASE) {
      setError('VITE_API_BASE 未配置');
      return;
    }
    fetchState()
      .then((data) => {
        setState(data);
        setError(null);
      })
      .catch(() => {
        setError('无法获取初始数据');
      });
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
      }
    };
  }, []);

  return { state, connected, error };
}
