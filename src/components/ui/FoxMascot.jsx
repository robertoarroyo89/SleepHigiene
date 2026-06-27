import { motion } from 'framer-motion';

export default function FoxMascot({ size = 140, className = '' }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className={className}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="foxFur" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="95" fill="url(#halo)" />

        {/* Orejas */}
        <path d="M55 80 L70 115 L88 98 Z" fill="#b45309" />
        <path d="M145 80 L130 115 L112 98 Z" fill="#b45309" />
        <path d="M60 85 L72 110 L82 100 Z" fill="#fde68a" opacity="0.7" />
        <path d="M140 85 L128 110 L118 100 Z" fill="#fde68a" opacity="0.7" />

        {/* Cabeza */}
        <ellipse cx="100" cy="118" rx="55" ry="48" fill="url(#foxFur)" />

        {/* Cara clara */}
        <ellipse cx="100" cy="132" rx="34" ry="26" fill="#fef3c7" />

        {/* Ojos dormidos */}
        <path d="M82 120 Q88 127 94 120" stroke="#1e1b4b" strokeWidth="2.5"
              fill="none" strokeLinecap="round" />
        <path d="M106 120 Q112 127 118 120" stroke="#1e1b4b" strokeWidth="2.5"
              fill="none" strokeLinecap="round" />

        {/* Nariz y boca */}
        <ellipse cx="100" cy="138" rx="4" ry="3" fill="#1e1b4b" />
        <path d="M100 141 L100 145 Q97 148 94 146 M100 145 Q103 148 106 146"
              stroke="#1e1b4b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Z flotantes */}
        <motion.g
          animate={{ y: [-2, -12, -2], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <text x="150" y="68" fontSize="22" fill="#c4b5fd" fontFamily="serif" fontWeight="600">z</text>
          <text x="162" y="50" fontSize="14" fill="#c4b5fd" fontFamily="serif" fontWeight="600">z</text>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
