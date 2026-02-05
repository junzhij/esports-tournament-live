import { useEffect, useRef, useState } from 'react';
import {
  BpPayload,
  ResultPayload,
  StatePublishedResponse,
  TeamInfo,
  WsMessage
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

export async function fetchState(): Promise<StatePublishedResponse> {
  const base = API_BASE ?? '';
  const res = await fetch(`${base}/api/state`);
  if (!res.ok) {
    throw new Error('无法获取状态');
  }
  return res.json();
}

function getWsUrl() {
  if (API_BASE) {
    const base = new URL(API_BASE);
    const protocol = base.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${base.host}/ws`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws`;
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

  if (message.type === 'timer_update' && message.payload) {
    const payload = message.payload as { timer_base_seconds: number; timer_started_at: string | null };
    return {
      ...state,
      match: {
        ...state.match,
        timer_base_seconds: payload.timer_base_seconds,
        timer_started_at: payload.timer_started_at
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
