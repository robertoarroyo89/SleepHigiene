import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Info, Plus, Settings2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import ProgressRing from './ui/ProgressRing';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDailyLog } from '../hooks/useDailyLog';
import { HABITS, HABIT_CATEGORIES, DEFAULT_ACTIVE_HABITS } from '../data/habits';
import { updateActiveHabits } from '../services/userService';

export default function HabitTracker() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const { log, toggleHabit } = useDailyLog(user?.uid);
  const [view, setView] = useState('today');

  const activeIds = profile?.activeHabits ?? DEFAULT_ACTIVE_HABITS;
  const activeHabits = HABITS.filter((h) => activeIds.includes(h.id));

  const checked = log?.habits ?? {};
  const done = activeHabits.filter((h) => checked[h.id]).length;
  const progress = activeHabits.length ? (done / activeHabits.length) * 100 : 0;

  return (
    <div className="min-h-screen w-full px-4 py-10 md:py-14
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem]
                      rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
          <FoxMascot size={64} />
        </header>

        <div className="flex gap-2">
          <TabButton active={view === 'today'} onClick={() => setView('today')}>
            <Star className="w-4 h-4" /> Mis hábitos
          </TabButton>
          <TabButton active={view === 'catalog'} onClick={() => setView('catalog')}>
            <Settings2 className="w-4 h-4" /> Catálogo
          </TabButton>
        </div>

        <AnimatePresence mode="wait">
          {view === 'today' ? (
            <motion.div key="today"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <TodayView progress={progress} done={done} total={activeHabits.length}
                         habits={activeHabits} checked={checked} onToggle={toggleHabit}
                         onGoCatalog={() => setView('catalog')} />
            </motion.div>
          ) : (
            <motion.div key="catalog"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <CatalogView uid={user?.uid} activeIds={activeIds} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition
        ${active ? 'bg-white/10 border-white/30 text-white'
                 : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'}`}>
      {children}
    </button>
  );
}

function TodayView({ progress, done, total, habits, checked, onToggle, onGoCatalog }) {
  const grouped = useMemo(() => {
    return Object.values(HABIT_CATEGORIES)
      .map((cat) => ({ ...cat, items: habits.filter((h) => h.category === cat.id) }))
      .filter((cat) => cat.items.length > 0);
  }, [habits]);

  return (
    <>
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ProgressRing progress={progress} />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-light text-white">Hábitos de hoy</h1>
            <p className="text-sm text-white/60 mt-1">
              {done} de {total} completados — sigue así.
            </p>
            <p className="mt-4 text-sm text-lavender-300/80 italic">
              "No los hagas todos. Domina 3-5 y conviértelos en automáticos." — Lilo
            </p>
            <button onClick={onGoCatalog}
              className="mt-4 inline-flex items-center gap-2 text-xs text-dimgold-300 hover:text-dimgold-300/80">
              <Plus className="w-3.5 h-3.5" /> Añadir más hábitos del catálogo
            </button>
          </div>
        </div>
      </GlassCard>

      {habits.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-white/70">
            Aún no has activado ningún hábito. Ve al <strong>Catálogo</strong> y elige los que quieras seguir.
          </p>
        </GlassCard>
      ) : (
        grouped.map((cat) => (
          <section key={cat.id} className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50 px-2">{cat.label}</h2>
            <div className="space-y-2">
              {cat.items.map((habit) => (
                <HabitRow key={habit.id} habit={habit}
                          checked={!!checked[habit.id]}
                          onToggle={() => onToggle(habit.id, !checked[habit.id])} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

function CatalogView({ uid, activeIds }) {
  const [localActive, setLocalActive] = useState(new Set(activeIds));
  const [saving, setSaving] = useState(false);

  const toggle = async (habitId) => {
    const next = new Set(localActive);
    next.has(habitId) ? next.delete(habitId) : next.add(habitId);
    setLocalActive(next);
    setSaving(true);
    try { await updateActiveHabits(uid, Array.from(next)); }
    finally { setSaving(false); }
  };

  const grouped = Object.values(HABIT_CATEGORIES).map((cat) => ({
    ...cat,
    items: HABITS.filter((h) => h.category === cat.id),
  }));

  return (
    <>
      <GlassCard className="p-6">
        <h2 className="text-xl text-white font-light">Catálogo de hábitos</h2>
        <p className="text-sm text-white/60 mt-1">
          Activa solo los que quieras seguir. Los marcados con ⭐ son los recomendados para empezar.
        </p>
        <p className="text-xs text-lavender-300/70 mt-3">
          {localActive.size} hábitos activos {saving && '• guardando...'}
        </p>
      </GlassCard>

      {grouped.map((cat) => (
        <section key={cat.id} className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 px-2">
            {cat.label} <span className="text-white/30">({cat.items.length})</span>
          </h3>
          <div className="space-y-2">
            {cat.items.map((habit) => {
              const Icon = habit.icon;
              const isActive = localActive.has(habit.id);
              return (
                <button
                  key={habit.id} onClick={() => toggle(habit.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition
                    ${isActive ? 'bg-white/10 border-white/25'
                               : 'bg-white/[0.03] border-white/10 hover:bg-white/5'}`}
                >
                  <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl
                                  bg-white/5 text-lavender-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-light truncate">{habit.title}</p>
                      {habit.recommended && (
                        <Star className="w-3.5 h-3.5 text-dimgold-300 shrink-0" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 truncate">{habit.short}</p>
                  </div>
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? '#a78bfa' : 'rgba(255,255,255,0.05)',
                      borderColor:     isActive ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                    }}
                    className="shrink-0 grid place-items-center w-7 h-7 rounded-full border-2"
                  >
                    {isActive && <Check className="w-4 h-4 text-night-950" strokeWidth={3} />}
                  </motion.div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function HabitRow({ habit, checked, onToggle }) {
  const Icon = habit.icon;
  return (
    <motion.div layout whileTap={{ scale: 0.99 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition">
        <motion.div
          animate={{
            backgroundColor: checked ? '#a78bfa' : 'rgba(255,255,255,0.05)',
            borderColor:     checked ? '#a78bfa' : 'rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.3 }}
          className="shrink-0 grid place-items-center w-7 h-7 rounded-full border-2"
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Check className="w-4 h-4 text-night-950" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl
                        bg-white/5 text-lavender-300">
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <motion.p animate={{ opacity: checked ? 0.5 : 1 }}
                    className="text-white font-light truncate">
            {habit.title}
          </motion.p>
          <p className="text-xs text-white/50 truncate">{habit.short}</p>
        </div>
      </button>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 pl-16 space-y-2">
              <div className="flex items-start gap-2 text-xs text-white/60">
                <Info className="w-3.5 h-3.5 mt-0.5 text-dimgold-300 shrink-0" />
                <p className="leading-relaxed">{habit.why}</p>
              </div>
              <p className="text-xs text-lavender-300/70 pl-5">⏱ {habit.ideal}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
