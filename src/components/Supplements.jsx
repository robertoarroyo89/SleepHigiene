import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, AlertTriangle, Pill, Clock, Sparkles, ChevronDown, Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { SUPPLEMENTS, SUPPLEMENT_TIERS } from '../data/supplements';

export default function Supplements() {
  const [activeTier, setActiveTier] = useState('core');

  const filtered = SUPPLEMENTS.filter((s) => s.tier === activeTier);
  const tiers = Object.values(SUPPLEMENT_TIERS);

  return (
    <div className="min-h-screen w-full px-4 py-10 md:py-14
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-[40rem] h-[40rem]
                      rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[35rem] h-[35rem]
                      rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
          <FoxMascot size={64} />
        </header>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-dimgold-300">
            Suplementación estratégica
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-white">
            Lo que funciona, y por qué
          </h1>
          <p className="text-sm text-white/60 max-w-xl leading-relaxed">
            Los suplementos no reemplazan los hábitos. Son un complemento.
            Aquí tienes los más estudiados, ordenados por nivel de evidencia y prioridad.
          </p>
        </div>

        <GlassCard className="p-5 border-amber-400/20">
          <div className="flex items-start gap-3">
            <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl
                            bg-amber-400/15 text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-200">Aviso médico importante</p>
              <p className="mt-1 text-xs text-white/65 leading-relaxed">
                Esta información es <strong>educativa</strong>, no constituye consejo médico.
                Antes de tomar cualquier suplemento, consulta con tu médico o farmacéutico,
                especialmente si tomas medicación, estás embarazada o en lactancia,
                tienes patologías crónicas o eres menor de edad.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-2">
          {tiers.map((t) => (
            <button key={t.id} onClick={() => setActiveTier(t.id)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${activeTier === t.id
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p key={activeTier}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}
            className="text-sm text-lavender-300/80 italic">
            {SUPPLEMENT_TIERS[activeTier].description}
          </motion.p>
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((sup, i) => (
              <motion.div key={sup.id} layout
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}>
                <SupplementCard supplement={sup} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <GlassCard className="p-6 mt-8">
          <div className="flex items-start gap-4">
            <FoxMascot size={64} />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-dimgold-300">
                Recordatorio de Lilo
              </p>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                Empieza con <strong>uno</strong> a la vez (2-3 semanas) para identificar qué te funciona.
                Si tomas todo a la vez, no sabrás qué te ha ayudado.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SupplementCard({ supplement }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-3xl border border-white/10 backdrop-blur-2xl overflow-hidden
                     bg-gradient-to-br ${supplement.color}`}>
      <button onClick={() => setOpen((o) => !o)}
        className="w-full p-6 text-left hover:bg-white/[0.02] transition">
        <div className="flex items-start gap-4">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl
                          bg-white/10 text-white">
            <Pill className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl text-white font-light">{supplement.name}</h3>
            <p className="text-sm text-lavender-300/90 mt-0.5">{supplement.tagline}</p>

            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full
                               bg-white/10 border border-white/10 px-3 py-1 text-white/80">
                <Sparkles className="w-3 h-3" /> {supplement.dose}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full
                               bg-white/10 border border-white/10 px-3 py-1 text-white/80">
                <Clock className="w-3 h-3" /> {supplement.timing}
              </span>
            </div>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-white/50" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Para qué sirve</p>
                <p className="text-sm text-white/80 leading-relaxed">{supplement.purpose}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Beneficios</p>
                <ul className="space-y-1.5">
                  {supplement.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                      <span className="text-dimgold-300 mt-1">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {supplement.notes && (
                <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
                  <Info className="w-4 h-4 text-lavender-300 mt-0.5 shrink-0" />
                  <p className="text-xs text-white/65 leading-relaxed">{supplement.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
