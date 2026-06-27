import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`relative rounded-3xl border border-white/10 bg-white/5
                  backdrop-blur-2xl shadow-glow
                  before:absolute before:inset-0 before:rounded-3xl
                  before:bg-gradient-to-br before:from-white/10 before:to-transparent
                  before:pointer-events-none ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
