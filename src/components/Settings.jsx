import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Bell, Moon, Sun, Target, User,
  LogOut, Check, AlertCircle, Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { updateGoals, updateDisplayName } from '../services/userService';
import {
  getPermission, requestPermission, getSchedule, saveSchedule,
  isNotificationSupported, showNotification, cancelAll,
} from '../services/notificationService';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useUserProfile(user?.uid);

  const [displayName, setDisplayName] = useState('');
  const [goals, setGoals] = useState({
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
    targetSleepHours: 8,
  });
  const [permission, setPermission] = useState(getPermission());
  const [schedule, setSchedule] = useState(getSchedule());
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
      if (profile.goals) setGoals(profile.goals);
    }
  }, [profile]);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleSaveProfile = async () => {
    await updateDisplayName(user.uid, displayName);
    flashSaved();
  };

  const handleSaveGoals = async () => {
    await updateGoals(user.uid, goals);
    flashSaved();
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    setPermission(result);
    if (result === 'granted') {
      showNotification('🦊 Lilo activado', { body: 'Te recordaré tus rutinas a las horas indicadas.' });
      saveSchedule(schedule);
    }
  };

  const handleScheduleChange = (next) => {
    setSchedule(next);
    saveSchedule(next);
    flashSaved();
  };

  const handleLogout = async () => {
    cancelAll();
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full px-4 py-10 md:py-14
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-[35rem] h-[35rem]
                      rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
          <FoxMascot size={64} />
        </header>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-300">Configuración</p>
          <h1 className="text-3xl md:text-4xl font-light text-white mt-1">Ajustes</h1>
        </div>

        <AnimatePresence>
          {savedFlash && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                         inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-lavender-400/90 text-night-950 text-sm shadow-glow"
            >
              <Check className="w-4 h-4" /> Guardado
            </motion.div>
          )}
        </AnimatePresence>

        <Section icon={<User className="w-4 h-4" />} title="Perfil">
          <Field label="Tu nombre" value={displayName} onChange={setDisplayName}
                 placeholder="Cómo te llamamos" />
          <p className="text-xs text-white/40 mt-2">{user?.email}</p>
          <SectionAction onClick={handleSaveProfile}>Guardar perfil</SectionAction>
        </Section>

        <Section icon={<Target className="w-4 h-4" />} title="Objetivos de sueño">
          <div className="grid grid-cols-2 gap-3">
            <TimeField icon={<Moon className="w-4 h-4 text-lavender-300" />}
                       label="Acostarte" value={goals.targetBedtime}
                       onChange={(v) => setGoals({ ...goals, targetBedtime: v })} />
            <TimeField icon={<Sun className="w-4 h-4 text-dimgold-300" />}
                       label="Despertar" value={goals.targetWakeTime}
                       onChange={(v) => setGoals({ ...goals, targetWakeTime: v })} />
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
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
          <SectionAction onClick={handleSaveGoals}>Guardar objetivos</SectionAction>
        </Section>

        <Section icon={<Bell className="w-4 h-4" />} title="Recordatorios">
          {!isNotificationSupported() ? (
            <InfoRow tone="warning"
              text="Tu navegador no admite notificaciones. Prueba en Chrome de escritorio o instala la app en tu móvil." />
          ) : permission === 'denied' ? (
            <InfoRow tone="warning"
              text="Has bloqueado las notificaciones. Para activarlas, busca el candado en la barra de direcciones y permítelas." />
          ) : permission !== 'granted' ? (
            <>
              <p className="text-sm text-white/70">
                Lilo puede avisarte cuando empezar tu rutina, cuando es hora de dormir
                y para registrar tu sueño al despertar.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRequestPermission}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                           bg-gradient-to-r from-lavender-400 to-violet-500
                           text-white text-sm font-medium shadow-glow"
              >
                <Bell className="w-4 h-4" /> Activar notificaciones
              </motion.button>
              <p className="text-[11px] text-white/40 mt-3 leading-relaxed">
                💡 En iPhone necesitas instalar primero la app: pulsa el botón de compartir en Safari
                y selecciona "Añadir a pantalla de inicio".
              </p>
            </>
          ) : (
            <>
              <InfoRow tone="success" text="Notificaciones activadas." />
              <div className="space-y-3 mt-4">
                <ReminderRow icon={<Moon className="w-4 h-4 text-lavender-300" />}
                  label="Inicio de rutina nocturna" hint="Apaga pantallas y baja luces"
                  time={schedule.windDown} enabled={schedule.enabled.windDown}
                  onTimeChange={(t) => handleScheduleChange({ ...schedule, windDown: t })}
                  onToggle={(on) => handleScheduleChange({
                    ...schedule, enabled: { ...schedule.enabled, windDown: on }
                  })} />
                <ReminderRow icon={<Sparkles className="w-4 h-4 text-violet-300" />}
                  label="Hora de acostarse" hint="Tu cama te espera"
                  time={schedule.bedtime} enabled={schedule.enabled.bedtime}
                  onTimeChange={(t) => handleScheduleChange({ ...schedule, bedtime: t })}
                  onToggle={(on) => handleScheduleChange({
                    ...schedule, enabled: { ...schedule.enabled, bedtime: on }
                  })} />
                <ReminderRow icon={<Sun className="w-4 h-4 text-dimgold-300" />}
                  label="Registrar al despertar" hint="Anota cómo dormiste"
                  time={schedule.morning} enabled={schedule.enabled.morning}
                  onTimeChange={(t) => handleScheduleChange({ ...schedule, morning: t })}
                  onToggle={(on) => handleScheduleChange({
                    ...schedule, enabled: { ...schedule.enabled, morning: on }
                  })} />
              </div>
              <button
                onClick={() => showNotification('🦊 Aquí estoy', {
                  body: 'Las notificaciones funcionan correctamente.'
                })}
                className="mt-4 text-xs text-lavender-300 hover:text-lavender-300/80"
              >
                Enviar notificación de prueba
              </button>
            </>
          )}
        </Section>

        <Section icon={<LogOut className="w-4 h-4" />} title="Sesión">
          <button onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                       bg-white/5 border border-white/10 text-white/80
                       hover:bg-rose-500/10 hover:border-rose-400/30 hover:text-rose-300 transition">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <GlassCard className="p-6">
      <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60 mb-5">
        {icon} {title}
      </h2>
      {children}
    </GlassCard>
  );
}

function SectionAction({ onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full
                 bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15">
      <Check className="w-4 h-4" /> {children}
    </motion.button>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
             placeholder={placeholder}
             className="mt-2 w-full bg-transparent border-b border-white/10
                        text-white placeholder:text-white/30 outline-none py-2
                        focus:border-lavender-400/50 transition" />
    </label>
  );
}

function TimeField({ icon, label, value, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="flex items-center gap-2 text-xs text-white/70">{icon} {label}</span>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
             className="mt-2 w-full bg-transparent text-xl font-light text-white outline-none" />
    </label>
  );
}

function InfoRow({ tone, text }) {
  const tones = {
    success: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200',
    warning: 'bg-amber-400/10 border-amber-400/20 text-amber-200',
  };
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${tones[tone]}`}>
      {tone === 'success'
        ? <Check className="w-4 h-4 mt-0.5 shrink-0" />
        : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
      <span>{text}</span>
    </div>
  );
}

function ReminderRow({ icon, label, hint, time, enabled, onTimeChange, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-white/5">{icon}</div>
          <div className="min-w-0">
            <p className="text-white text-sm truncate">{label}</p>
            <p className="text-[11px] text-white/50 truncate">{hint}</p>
          </div>
        </div>
        <Toggle on={enabled} onChange={onToggle} />
      </div>
      {enabled && (
        <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)}
               className="mt-3 w-full bg-transparent text-2xl font-light text-white outline-none
                          border-t border-white/5 pt-3" />
      )}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition
        ${on ? 'bg-lavender-400' : 'bg-white/10'}`}>
      <motion.div animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md" />
    </button>
  );
}
