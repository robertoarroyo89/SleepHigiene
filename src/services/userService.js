import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, serverTimestamp } from './firebase';
import { DEFAULT_ACTIVE_HABITS } from '../data/habits';

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const initUserProfile = async (uid, { email, displayName }) => {
  await setDoc(
    doc(db, 'users', uid),
    {
      email,
      displayName: displayName ?? '',
      createdAt: serverTimestamp(),
      onboardingComplete: false,
      activeHabits: [],
      goals: {
        targetBedtime: '23:00',
        targetWakeTime: '07:00',
        targetSleepHours: 8,
      },
      preferences: { theme: 'dark', notifications: true },
    },
    { merge: true }
  );
};

export const completeOnboarding = async (uid, goals) => {
  await updateDoc(doc(db, 'users', uid), {
    goals,
    activeHabits: DEFAULT_ACTIVE_HABITS,
    onboardingComplete: true,
    onboardingCompletedAt: serverTimestamp(),
  });
};

export const updateActiveHabits = async (uid, habitIds) => {
  await updateDoc(doc(db, 'users', uid), { activeHabits: habitIds });
};

export const updateGoals = async (uid, goals) => {
  await updateDoc(doc(db, 'users', uid), { goals });
};

export const updateDisplayName = async (uid, displayName) => {
  await updateDoc(doc(db, 'users', uid), { displayName });
};
