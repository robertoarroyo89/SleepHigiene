export const formatKey = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const todayKey = () => formatKey(new Date());

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const lastNDays = (n) => {
  const end = new Date();
  const start = addDays(end, -(n - 1));
  return {
    startKey: formatKey(start),
    endKey: formatKey(end),
    days: Array.from({ length: n }, (_, i) => formatKey(addDays(start, i))),
  };
};

export const dayLabel = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()];
};
