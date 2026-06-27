import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Moon, Sun, Star, Save, BedDouble, Coffee } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { useDailyLog } from '../hooks/useDailyLog';
import { saveSleepEntry } from '../services/logService';
import { todayKey } from '../utils/dates';

const FEELINGS = [
  { value: 1, label: 'Agotado', emoji: '😩' },
  { value: 2, label: 'Cansado', emoji: '😪' },
  { value: 3, label: 'Normal',  emoji: '😐' },
  { value: 4, label: 'Bien',    emoji: '🙂' },
  { value: 5, label: 'Genial',  emoji: '✨' },
];

export default function SleepLogger() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { log } = useDailyLog(user?.uid);

  const [bedtime, setBedtime]   = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality]   = useState(3);
  const [feeling, setFeeling]   = useState(3);
  const [awakenings, setAwakenings] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (log?.sleep) {
      setBedtime(log.sleep.bedtime ?? '23:00');
      setWakeTime(log.sleep.wakeTime ?? '07:00');
      setQuality(log.sleep.quality ?? 3);
      setFeeling(log.sleep.feeling ?? 3);
      setAwakenings(log.sleep.awakenings ?? 0);
      setNotes(log.sleep.notes ?? '');
    }
  }, [log]);

  const calculateHours = () => {
    if (!bedtime || !wakeTime) return 0;
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return (mins / 60).toFixed(1);
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await saveSleepEntry(user.uid, todayKey(), {
        bedtime,
        wakeTime,
        totalHours: parseFloat(calculateHours()),
        quality,
        feeling,
        awakenings,
        notes,
      });
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  const hours = calculateHours();

  return (
    <div className="min-h-screen w-full px-4 py-10 md:py-14
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-[40rem] h-[40rem]
                      rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
          <FoxMascot size={64} />
        </header>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-300">Registro de sueño</p>
          <h1 className="text-3xl md:text-4xl font-light text-white mt-1">¿Cómo dormiste?</h1>
          <p className="text-sm text-white/60 mt-1">
            Unos pocos datos cada mañana te dan un mapa enorme con el tiempo.
          </p>
        </div>

        <GlassCard className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <TimeField icon={<Moon className="w-4 h-4 text-lavender-300" />}
                       label="A qué hora te acostaste"
                       value={bedtime} onChange={setBedtime} />
            <TimeField icon={<Sun className="w-4 h-4 text-dimgold-300" />}
                       label="A qué hora despertaste"
                       value={wakeTime} onChange={setWakeTime} />
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-white/40">Total dormido</p>
            <p className="text-4xl font-light text-white mt-1">{hours}h</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <Star className="w-4 h-4 text-dimgold-300" /> Calidad del sueño
          </label>
          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setQuality(n)}>
                <motion.div animate={{ scale: quality === n ? 1.15 : 1 }}
                  className={`grid place-items-center w-10 h-10 rounded-full border-2 transition
                    ${quality >= n ? 'bg-dimgold-300 border-dimgold-300 text-night-950'
                                   : 'bg-white/5 border-white/15 text-white/40'}`}>
                  <Star className="w-4 h-4" fill={quality >= n ? 'currentColor' : 'none'} />
                </motion.div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <Coffee className="w-4 h-4 text-lavender-300" /> ¿Cómo te sientes al despertar?
          </label>
          <div className="flex justify-between mt-4">
            {FEELINGS.map((f) => (
              <button key={f.value} onClick={() => setFeeling(f.value)}>
                <motion.div
                  animate={{ scale: feeling === f.value ? 1.2 : 1, opacity: feeling === f.value ? 1 : 0.5 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">{f.emoji}</span>
                  <span className="text-[10px] text-white/60">{f.label}</span>
                </motion.div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <BedDouble className="w-4 h-4 text-lavender-300" />
            Despertares nocturnos: <span className="text-dimgold-300">{awakenings}</span>
          </label>
          <input
            type="range" min="0" max="10" step="1"
            value={awakenings}
            onChange={(e) => setAwakenings(parseInt(e.target.value))}
            className="w-full mt-3 accent-lavender-400"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-1">
            <span>Ninguno</span><span>10+</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <label className="text-sm text-white/70">Notas (opcional)</label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Cualquier cosa que quieras recordar de esta noche..."
            rows={3}
            className="w-full mt-2 bg-transparent border-b border-white/10
                       text-white placeholder:text-white/30 outline-none resize-none
                       focus:border-lavender-400/50 transition"
          />
        </GlassCard>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full
                     bg-gradient-to-r from-lavender-400 to-violet-500
                     text-white font-medium shadow-glow disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar registro'}
        </motion.button>
      </div>
    </div>
  );
}

function TimeField({ icon, label, value, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="flex items-center gap-2 text-xs text-white/70">{icon} {label}</span>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
             className="mt-2 w-full bg-transparent text-2xl font-light text-white outline-none" />
    </label>
  );
}
