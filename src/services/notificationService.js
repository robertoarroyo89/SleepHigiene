const SCHEDULE_KEY = 'lilo_notification_schedule';

export const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

export const getPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported';
  const result = await Notification.requestPermission();
  return result;
};

export const showNotification = (title, options = {}) => {
  if (getPermission() !== 'granted') return;
  const defaults = {
    body: '',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'lilo',
    silent: false,
    vibrate: [120, 60, 120],
  };
  try {
    return new Notification(title, { ...defaults, ...options });
  } catch (e) {
    // En algunos navegadores (iOS) hay que pasar por service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, { ...defaults, ...options });
      });
    }
  }
};

const defaultSchedule = () => ({
  windDown: '21:30',
  bedtime: '22:45',
  morning: '07:30',
  enabled: { windDown: true, bedtime: true, morning: false },
});

export const getSchedule = () => {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : defaultSchedule();
  } catch {
    return defaultSchedule();
  }
};

export const saveSchedule = (schedule) => {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  rescheduleAll(schedule);
};

const timers = new Map();

const msUntil = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
};

const NOTIFICATIONS = {
  windDown: {
    title: '🌙 Lilo te susurra',
    body: 'Empieza tu ritual de transición. Apaga pantallas en 30 minutos.',
  },
  bedtime: {
    title: '✨ Hora de descansar',
    body: 'Tu cama te espera. Mañana tu yo del futuro te lo agradecerá.',
  },
  morning: {
    title: '☀️ Buenos días',
    body: 'No olvides registrar cómo dormiste y exponerte a la luz natural.',
  },
};

const scheduleOne = (key, hhmm) => {
  const delay = msUntil(hhmm);
  const t = setTimeout(() => {
    showNotification(NOTIFICATIONS[key].title, { body: NOTIFICATIONS[key].body });
    scheduleOne(key, hhmm); // reprograma para mañana
  }, delay);
  timers.set(key, t);
};

const clearOne = (key) => {
  const t = timers.get(key);
  if (t) {
    clearTimeout(t);
    timers.delete(key);
  }
};

export const rescheduleAll = (schedule = getSchedule()) => {
  if (getPermission() !== 'granted') return;
  ['windDown', 'bedtime', 'morning'].forEach((key) => {
    clearOne(key);
    if (schedule.enabled[key]) scheduleOne(key, schedule[key]);
  });
};

export const cancelAll = () => {
  ['windDown', 'bedtime', 'morning'].forEach(clearOne);
};
