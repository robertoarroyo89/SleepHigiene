import { useEffect, useState } from 'react';
import {
  subscribeDailyLog, ensureDailyLog, toggleHabit as toggleHabitSvc,
} from '../services/logService';
import { todayKey } from '../utils/dates';

export function useDailyLog(uid, dateKey = todayKey()) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLog(null);
      setLoading(false);
      return;
    }
    let unsub = () => {};
    (async () => {
      await ensureDailyLog(uid, dateKey);
      unsub = subscribeDailyLog(uid, dateKey, (data) => {
        setLog(data);
        setLoading(false);
      });
    })();
    return () => unsub();
  }, [uid, dateKey]);

  const toggleHabit = (habitId, value) => toggleHabitSvc(uid, dateKey, habitId, value);

  return { log, loading, toggleHabit, dateKey };
}
