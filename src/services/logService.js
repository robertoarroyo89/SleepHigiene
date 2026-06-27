import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, query, where, orderBy, getDocs,
} from 'firebase/firestore';
import { db, serverTimestamp } from './firebase';

const logRef = (uid, dateKey) => doc(db, 'users', uid, 'daily_logs', dateKey);

export const ensureDailyLog = async (uid, dateKey) => {
  const ref = logRef(uid, dateKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      date: dateKey,
      habits: {},
      supplements: [],
      sleep: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return ref;
};

export const toggleHabit = async (uid, dateKey, habitId, value) => {
  await ensureDailyLog(uid, dateKey);
  await updateDoc(logRef(uid, dateKey), {
    [`habits.${habitId}`]: value,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeDailyLog = (uid, dateKey, cb) =>
  onSnapshot(logRef(uid, dateKey), (snap) => cb(snap.exists() ? snap.data() : null));

export const saveSleepEntry = async (uid, dateKey, sleep) => {
  await ensureDailyLog(uid, dateKey);
  await updateDoc(logRef(uid, dateKey), {
    sleep,
    updatedAt: serverTimestamp(),
  });
};

export const getLogsInRange = async (uid, startKey, endKey) => {
  const q = query(
    collection(db, 'users', uid, 'daily_logs'),
    where('date', '>=', startKey),
    where('date', '<=', endKey),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
};
