import { motion } from 'framer-motion';
import {
  Sparkles, Moon, Sun, ListChecks, Pill, ArrowRight,
  BarChart3, Settings as SettingsIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import ProgressRing from './ui/ProgressRing';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDailyLog } from '../hooks/useDailyLog';
import { HABITS, DEFAULT_ACTIVE_HABITS } from '../data/habits';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6)  return { text: 'Aún es de madrugada', icon: <Moon className="w-4 h-4" /> };
  if (h < 13) return { text: 'Buenos días',         icon: <Sun  className="w-4 h-4" /> };
  if (h < 20) return { text: 'Buenas tardes',       icon: <Sun  className="w-4 h-4" /> };
  return       { text: 'Buenas noches',             icon: <Moon className="w-4 h-4" /> };
};

const TIPS = [
  'Mantén tu habitación entre 18 y 19 °C para favorecer el descenso natural de tu temperatura corporal.',
  'Evita la luz azul una hora antes de dormir: tu cerebro confunde las pantallas con la luz del sol.',
  '10 minutos de sol al despertar regulan tu ritmo circadiano mejor que cualquier suplemento.',
  'La cafeína tiene una vida media de 5-6 horas. Tu último café debería ser antes de las 14:00.',
  'Si llevas más de 20 minutos sin dormirte, levántate. Quedarte en la cama refuerza el insomnio.',
  'El alcohol te duerme antes, pero destroza tu sueño REM y multiplica los despertares.',
  'Una ducha tibia 60-90 min antes de dormir provoca un descenso térmico que invita al sueño.',
  'No mires el reloj si te desvelas. Calcular las horas que te quedan dispara ansiedad.',
];
const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length];

export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const { log } = useDailyLog(user?.uid);

  const greeting = getGreeting();
  const activeIds = profile?.activeHabits ?? DEFAULT_ACTIVE_HABITS;
  const activeHabits = HABITS.filter((h) => activeIds.includes(h.id));
  const total = activeHabits.length;
  const done = log?.habits ? activeHabits.filter((h) => log.habits[h.id]).length : 0;
  const progress = total ? (done / total) * 100 : 0;

  const name = profile?.displayName?.split(' ')[0] ?? '';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden px-4 py-10 md:py-16">
      <div className="absolute top-0 left-1/3 w-[40rem] h-[40rem] rounded-full
                      bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full
                      bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-lavender-300/80">
              {greeting.icon} {greeting.text}
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-light text-white">
              {name ? `Hola, ${name}` : 'Bienvenido de nuevo'}
            </h1>
            <p className="mt-1 text-sm text-white/50">Tu rutina nocturna empieza ahora.</p>
          </div>
          <FoxMascot size={96} />
        </motion.header>

        <GlassCard className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <ProgressRing progress={progress} />
            <div className="flex-1 w-full space-y-3 text-center md:text-left">
              <h2 className="text-xl text-white font-light">
                {done} de {total} hábitos completados
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Cada pequeño hábito es un ladrillo en la arquitectura de tu sueño.
              </p>
              <div className="flex gap-3 text-xs justify-center md:justify-start">
                <StatPill icon={<Moon className="w-3.5 h-3.5" />}
                          label="Objetivo" value={profile?.goals?.targetBedtime ?? '23:00'} />
                <StatPill icon={<Sun  className="w-3.5 h-3.5" />}
                          label="Despertar" value={profile?.goals?.targetWakeTime ?? '07:00'} />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="shrink-0"><FoxMascot size={72} /></div>
            <div className="flex-1">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-dimgold-300">
                <Sparkles className="w-3.5 h-3.5" /> Consejo de Lilo
              </p>
              <p className="mt-2 text-white/85 leading-relaxed">{tipOfTheDay}</p>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAccess to="/habitos" icon={<ListChecks className="w-5 h-5" />}
                       title="Hábitos de hoy" subtitle="Marca tu checklist"
                       gradient="from-violet-500/30 to-indigo-500/10" />
          <QuickAccess to="/registro" icon={<Moon className="w-5 h-5" />}
                       title="Registrar mi sueño" subtitle="¿Cómo dormiste anoche?"
                       gradient="from-sky-400/25 to-blue-500/10" />
          <QuickAccess to="/suplementos" icon={<Pill className="w-5 h-5" />}
                       title="Suplementación" subtitle="Magnesio, L-Teanina y más"
                       gradient="from-amber-400/25 to-rose-500/10" />
          <QuickAccess to="/estadisticas" icon={<BarChart3 className="w-5 h-5" />}
                       title="Estadísticas" subtitle="Tus patrones de sueño"
                       gradient="from-emerald-400/25 to-teal-500/10" />
          <QuickAccess to="/ajustes" icon={<SettingsIcon className="w-5 h-5" />}
                       title="Ajustes" subtitle="Objetivos y recordatorios"
                       gradient="from-slate-400/20 to-indigo-500/10" />
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full
                     border border-white/10 bg-white/5 px-3 py-1 text-white/70">
      {icon} <span className="text-white/50">{label}</span>
      <span className="text-white">{value}</span>
    </span>
  );
}

function QuickAccess({ to, icon, title, subtitle, gradient }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
      <Link
        to={to}
        className={`group block rounded-3xl p-6 border border-white/10
                    bg-gradient-to-br ${gradient} backdrop-blur-2xl
                    hover:border-white/20 transition`}
      >
        <div className="flex items-center justify-between">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-white/10 text-white">
            {icon}
          </span>
          <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition" />
        </div>
        <h3 className="mt-4 text-lg text-white font-light">{title}</h3>
        <p className="text-sm text-white/60">{subtitle}</p>
      </Link>
    </motion.div>
  );
}
