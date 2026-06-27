import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Moon, Star, BedDouble, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { useWeeklyStats } from '../hooks/useWeeklyStats';
import { useUserProfile } from '../hooks/useUserProfile';
import { dayLabel } from '../utils/dates';
import { DEFAULT_ACTIVE_HABITS } from '../data/habits';

export default function Stats() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const [range, setRange] = useState(7);
  const { stats, loading } = useWeeklyStats(user?.uid, range);

  const activeCount = (profile?.activeHabits ?? DEFAULT_ACTIVE_HABITS).length;
  const targetHours = profile?.goals?.targetSleepHours ?? 8;

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

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-300">Estadísticas</p>
          <h1 className="text-3xl md:text-4xl font-light text-white mt-1">Tu progreso</h1>
          <p className="text-sm text-white/60 mt-1">
            Los patrones se ven con perspectiva, no con un solo día.
          </p>
        </div>

        <div className="flex gap-2">
          {[7, 14, 30].map((n) => (
            <button key={n} onClick={() => setRange(n)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${range === n ? 'bg-white/10 border-white/30 text-white'
                              : 'bg-white/[0.03] border-white/10 text-white/60'}`}>
              {n} días
            </button>
          ))}
        </div>

        {loading ? (
          <GlassCard className="p-8 text-center text-white/50">Cargando...</GlassCard>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiCard icon={<Moon className="w-4 h-4" />} label="Media horas"
                       value={stats.avgHours ? `${stats.avgHours.toFixed(1)}h` : '—'}
                       hint={`Objetivo ${targetHours}h`} />
              <KpiCard icon={<Star className="w-4 h-4" />} label="Calidad media"
                       value={stats.avgQuality ? `${stats.avgQuality.toFixed(1)}/5` : '—'} />
              <KpiCard icon={<BedDouble className="w-4 h-4" />} label="Despertares"
                       value={stats.avgAwakenings.toFixed(1)} hint="por noche" />
              <KpiCard icon={<Calendar className="w-4 h-4" />} label="Constancia"
                       value={`${Math.round(stats.consistency * 100)}%`}
                       hint={`${stats.nightsLogged}/${range} noches`} />
            </div>

            <GlassCard className="p-6">
              <ChartHeader icon={<Moon className="w-4 h-4 text-lavender-300" />}
                           title="Horas dormidas" subtitle={`Objetivo: ${targetHours}h`} />
              <BarChart data={stats.sleepHours} targetValue={targetHours}
                        maxValue={12} unit="h" color="lavender" />
            </GlassCard>

            <GlassCard className="p-6">
              <ChartHeader icon={<Star className="w-4 h-4 text-dimgold-300" />}
                           title="Calidad percibida" subtitle="De 1 a 5" />
              <BarChart data={stats.qualities} maxValue={5} unit="" color="gold" />
            </GlassCard>

            <GlassCard className="p-6">
              <ChartHeader icon={<Activity className="w-4 h-4 text-emerald-300" />}
                           title="Hábitos completados" subtitle={`De ${activeCount} activos`} />
              <BarChart data={stats.habitsCompleted} maxValue={activeCount || 1}
                        unit="" color="emerald" />
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <FoxMascot size={64} />
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-dimgold-300">Lilo observa</p>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">
                    {generateInsight(stats, targetHours, range)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, hint }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 text-white/50 text-xs">{icon} {label}</div>
      <p className="text-2xl font-light text-white mt-2">{value}</p>
      {hint && <p className="text-[11px] text-white/40 mt-0.5">{hint}</p>}
    </GlassCard>
  );
}

function ChartHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">{icon}<h3 className="text-white font-light">{title}</h3></div>
      <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
    </div>
  );
}

function BarChart({ data, maxValue, targetValue, color = 'lavender', unit = '' }) {
  const colors = {
    lavender: 'from-lavender-400 to-violet-500',
    gold:     'from-dimgold-300 to-amber-500',
    emerald:  'from-emerald-400 to-teal-500',
  }[color];

  return (
    <div>
      <div className="flex items-end justify-between gap-2 h-40 relative">
        {targetValue && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-dimgold-300/40 z-10 pointer-events-none"
            style={{ bottom: `${(targetValue / maxValue) * 100}%` }}
          />
        )}

        {data.map((d, i) => {
          const pct = d.value != null ? Math.min((d.value / maxValue) * 100, 100) : 0;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[10px] text-white/40">
                {d.value != null ? `${d.value}${unit}` : ''}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t ${colors}`}
                style={{ minHeight: d.value != null ? '4px' : '0' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {data.map((d) => (
          <span key={d.day} className="flex-1 text-center text-[10px] text-white/40">
            {dayLabel(d.day)}
          </span>
        ))}
      </div>
    </div>
  );
}

function generateInsight(stats, targetHours, range) {
  if (stats.nightsLogged === 0) {
    return 'Aún no tengo datos de sueño. Empieza registrando esta noche y en unos días veremos patrones interesantes.';
  }
  if (stats.consistency < 0.5) {
    return `Solo has registrado ${stats.nightsLogged} de ${range} noches. La constancia en el registro es el primer hábito: te permite ver qué funciona.`;
  }
  if (stats.avgHours < targetHours - 1) {
    return `Estás durmiendo de media ${stats.avgHours.toFixed(1)}h, por debajo de tu objetivo de ${targetHours}h. Adelantar la hora de acostarte 30 min sería un buen primer paso.`;
  }
  if (stats.avgQuality < 3) {
    return `Tu calidad media es ${stats.avgQuality.toFixed(1)}/5. Revisa hábitos básicos: cafeína después de las 14h, pantallas antes de dormir y temperatura del dormitorio.`;
  }
  if (stats.avgAwakenings > 2) {
    return `Te despiertas una media de ${stats.avgAwakenings.toFixed(1)} veces por noche. Revisa hidratación nocturna, alcohol y ruido ambiental.`;
  }
  return `Buen trabajo. Llevas ${stats.nightsLogged} noches registradas con una calidad media de ${stats.avgQuality.toFixed(1)}/5. La consistencia es lo que construye el sueño reparador.`;
}
