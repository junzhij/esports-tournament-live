import { useEffect, useState } from 'react';
import { MatchInfo } from '../types';

export function useMatchTimer(match?: MatchInfo | null) {
  const [text, setText] = useState('00:00');

  useEffect(() => {
    if (!match) return;
    const tick = () => {
      const base = match.timer_base_seconds ?? 0;
      const startedAt = match.timer_started_at ? Date.parse(match.timer_started_at) : null;
      const elapsed = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
      const total = base + elapsed;
      const minutes = String(Math.floor(total / 60)).padStart(2, '0');
      const seconds = String(total % 60).padStart(2, '0');
      setText(`${minutes}:${seconds}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [match?.timer_base_seconds, match?.timer_started_at]);

  return text;
}
