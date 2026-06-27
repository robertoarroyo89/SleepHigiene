import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { completeOnboarding } from '../services/userService';

const stepVariants = {
  enter:  { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -60 },
};
const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState({
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
    targetSleepHours: 8,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    setSaving(true);
    setError('');
    try {
      await completeOnboarding(user.uid, goals);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Onboarding error:', err.code, err.message, err);
      setError(`No se pudo guardar: ${err.code || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <GlassCard className="w-full max-w-md p-8 md:p-10">
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 28 : 8,
                backgroundColor: i <= step ? '#a78bfa' : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.4 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" variants={stepVariants} initial="enter" animate="center" exit="exit"
                        transition={transition} className="flex flex-col items-center text-center">
              <FoxMascot size={160} />
              <h2 className="mt-4 text-3xl font-light text-white">
                Hola, soy <span className="text-dimgold-300">Lilo</span>
              </h2>
              <p className="mt-1 text-sm uppercase tracking-[0.3em] text-lavender-300">Tu guía nocturno</p>
              <p className="mt-6 text-white/70 leading-relaxed">
                Te acompañaré cada noche para ayudarte a recuperar un sueño
                profundo y reparador. Comencemos por conocerte un poco.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit"
                        transition={transition}>
              <div className="flex items-center gap-3 mb-6">
                <FoxMascot size={64} />
                <div>
                  <h3 className="text-xl text-white">Tus objetivos</h3>
                  <p className="text-sm text-white/60">Define a qué hora quieres dormir y despertar.</p>
                </div>
              </div>

              <div className="space-y-4">
                <TimeField icon={<Moon className="w-4 h-4 text-lavender-300" />}
                           label="Hora ideal para acostarte"
                           value={goals.targetBedtime}
                           onChange={(v) => setGoals({ ...goals, targetBedtime: v })} />
                <TimeField icon={<Sun className="w-4 h-4 text-dimgold-300" />}
                           label="Hora ideal para despertar"
                           value={goals.targetWakeTime}
                           onChange={(v) => setGoals({ ...goals, targetWakeTime: v })} />

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <label className="text-sm text-white/70">
                    Horas de sueño objetivo: <span className="text-dimgold-300">{goals.targetSleepHours}h</span>
                  </label>
                  <input
                    type="range" min="6" max="10" step="0.5"
                    value={goals.targetSleepHours}
                    onChange={(e) => setGoals({ ...goals, targetSleepHours: parseFloat(e.target.value) })}
                    className="w-full mt-3 accent-lavender-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit"
                        transition={transition} className="text-center">
              <FoxMascot size={120} className="mx-auto" />
              <h3 className="mt-4 text-2xl font-light text-white">Todo listo</h3>
              <p className="mt-2 text-white/70">Esto es lo que haremos juntos cada día:</p>
              <ul className="mt-6 space-y-3 text-left">
                <FeatureRow icon={<Check className="w-4 h-4" />} text="Seguimiento de hábitos de higiene del sueño" />
                <FeatureRow icon={<Moon className="w-4 h-4" />} text="Educación sobre el descanso reparador" />
                <FeatureRow icon={<Sparkles className="w-4 h-4" />} text="Suplementación estratégica basada en evidencia" />
              </ul>

              {error && (
                <p className="mt-4 text-sm text-rose-300 text-center break-words">
                  {error}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <button onClick={back} disabled={step === 0}
                  className="text-sm text-white/50 hover:text-white/80 disabled:opacity-0 transition">
            Atrás
          </button>

          {step < 2 ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={next}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         bg-gradient-to-r from-lavender-400 to-violet-500
                         text-white font-medium shadow-glow"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         bg-gradient-to-r from-dimgold-300 to-amber-500
                         text-night-950 font-semibold shadow-glow disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Empezar'} <Sparkles className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function TimeField({ icon, label, value, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="flex items-center gap-2 text-sm text-white/70">{icon} {label}</span>
      <input
        type="time" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent text-2xl font-light text-white outline-none"
      />
    </label>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="grid place-items-center w-7 h-7 rounded-full bg-lavender-400/20 text-lavender-300">
        {icon}
      </span>
      <span className="text-sm text-white/80">{text}</span>
    </li>
  );
}
