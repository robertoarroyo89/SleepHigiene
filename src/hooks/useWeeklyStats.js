import { useEffect, useMemo, useState } from 'react';
import { getLogsInRange } from '../services/logService';
import { lastNDays } from '../utils/dates';

export function useWeeklyStats(uid, nDays = 7) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => lastNDays(nDays), [nDays]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await getLogsInRange(uid, range.startKey, range.endKey);
        if (active) setLogs(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [uid, range.startKey, range.endKey]);

  const byDate = useMemo(() => {
    const m = {};
    logs.forEach((l) => { m[l.date] = l; });
    return m;
  }, [logs]);

  const stats = useMemo(() => {
    const sleepHours = [];
    const qualities = [];
    const habitsCompleted = [];
    let totalAwakenings = 0;
    let nightsLogged = 0;

    range.days.forEach((day) => {
      const log = byDate[day];
      const hours = log?.sleep?.totalHours ?? null;
      const quality = log?.sleep?.quality ?? null;
      const habits = log?.habits ? Object.values(log.habits).filter(Boolean).length : 0;

      sleepHours.push({ day, value: hours });
      qualities.push({ day, value: quality });
      habitsCompleted.push({ day, value: habits });

      if (log?.sleep) {
        nightsLogged++;
        totalAwakenings += log.sleep.awakenings ?? 0;
      }
    });

    const validHours = sleepHours.filter((x) => x.value != null).map((x) => x.value);
    const validQuality = qualities.filter((x) => x.value != null).map((x) => x.value);
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      sleepHours,
      qualities,
      habitsCompleted,
      avgHours: avg(validHours),
      avgQuality: avg(validQuality),
      avgAwakenings: nightsLogged ? totalAwakenings / nightsLogged : 0,
      nightsLogged,
      consistency: nightsLogged / range.days.length,
    };
  }, [byDate, range.days]);

  return { stats, loading, range };
}
