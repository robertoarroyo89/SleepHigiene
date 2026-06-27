export const SUPPLEMENT_TIERS = {
  core:     { id: 'core',     label: 'Fundamentales',   description: 'La base. Bien estudiados, seguros y eficaces para la mayoría.' },
  support:  { id: 'support',  label: 'Complementarios', description: 'Ayudan en contextos específicos: ansiedad, estrés, despertares.' },
  advanced: { id: 'advanced', label: 'Avanzados',       description: 'Para optimizar más allá de lo básico. Considera consultar antes.' },
};

export const SUPPLEMENTS = [
  {
    id: 'magnesium_glycinate', tier: 'core',
    name: 'Magnesio Glicinato',
    tagline: 'El relajante del sistema nervioso',
    purpose:
      'El glicinato es la forma de magnesio con mejor biodisponibilidad cerebral y menos efectos digestivos. ' +
      'Modula el sistema GABA, relaja el sistema nervioso central, reduce la actividad muscular y favorece un sueño más profundo y continuo.',
    benefits: [
      'Reduce el tiempo para conciliar el sueño',
      'Disminuye despertares nocturnos',
      'Mejora la calidad del sueño profundo',
      'Relaja la tensión muscular',
    ],
    dose: '200-400 mg',
    timing: '30-60 min antes de acostarte',
    notes: 'Evita el óxido de magnesio (mala absorción, efecto laxante). El glicinato no causa diarrea.',
    color: 'from-violet-500/30 to-purple-600/10',
  },
  {
    id: 'l_theanine', tier: 'core',
    name: 'L-Teanina',
    tagline: 'Calma sin sedación',
    purpose:
      'Aminoácido presente en el té verde. Aumenta GABA, serotonina y dopamina, y promueve ondas alfa cerebrales ' +
      '(estado de "alerta relajada"). No te deja grogui — te quita el ruido mental.',
    benefits: [
      'Reduce la ansiedad y la rumiación',
      'Acorta el tiempo de inicio del sueño',
      'No genera somnolencia residual',
      'Sinergia con magnesio',
    ],
    dose: '200-400 mg',
    timing: '30-60 min antes de acostarte',
    notes: 'Especialmente útil si tu problema es "no puedo apagar la cabeza". Combina bien con magnesio glicinato.',
    color: 'from-emerald-400/25 to-teal-500/10',
  },
  {
    id: 'apigenin', tier: 'core',
    name: 'Apigenina / Manzanilla',
    tagline: 'El sueño profundo de la abuela',
    purpose:
      'La apigenina es el flavonoide activo principal del extracto de manzanilla. Se une a receptores GABA-A ' +
      '(similar a las benzodiacepinas, pero mucho más suave) y reduce la ansiedad y la activación cerebral nocturna.',
    benefits: [
      'Favorece el sueño profundo (ondas lentas)',
      'Reduce ansiedad subclínica',
      'Posible efecto antioxidante adicional',
    ],
    dose: '50 mg de apigenina pura o 400-1600 mg de extracto seco de manzanilla',
    timing: '30-60 min antes de acostarte',
    notes: 'Popularizada por Andrew Huberman. Si tomas anticoagulantes, consulta antes.',
    color: 'from-amber-300/30 to-yellow-500/10',
  },
  {
    id: 'glycine', tier: 'support',
    name: 'Glicina',
    tagline: 'El termostato natural del sueño',
    purpose:
      'Aminoácido inhibidor que reduce la temperatura corporal central (clave para iniciar el sueño) ' +
      'y mejora la calidad subjetiva del descanso al día siguiente.',
    benefits: [
      'Reduce el tiempo de conciliación',
      'Mejora la sensación de descanso al despertar',
      'Reduce la somnolencia diurna',
    ],
    dose: '3 g',
    timing: '30-60 min antes de acostarte',
    notes: 'Sabor ligeramente dulce, disuelve bien en agua.',
    color: 'from-sky-400/25 to-cyan-500/10',
  },
  {
    id: 'ashwagandha', tier: 'support',
    name: 'Ashwagandha (KSM-66)',
    tagline: 'Adaptógeno anti-cortisol',
    purpose:
      'Reduce los niveles de cortisol (hormona del estrés) hasta un 25-30% en estudios clínicos. ' +
      'Útil si tu mal sueño viene de estrés crónico o cortisol nocturno elevado.',
    benefits: [
      'Reduce cortisol y ansiedad percibida',
      'Mejora la calidad del sueño en personas estresadas',
      'Apoya la recuperación física',
    ],
    dose: '300-600 mg de extracto estandarizado (KSM-66 o Sensoril)',
    timing: 'Por la noche, con o sin comida',
    notes: 'Efecto acumulativo: 2-4 semanas. Evítala si tienes hipertiroidismo o tomas inmunosupresores.',
    color: 'from-orange-400/25 to-red-500/10',
  },
  {
    id: 'gaba', tier: 'support',
    name: 'GABA',
    tagline: 'Neurotransmisor inhibidor directo',
    purpose:
      'El principal neurotransmisor inhibidor del cerebro. Su suplementación oral es debatida ' +
      '(paso de la barrera hematoencefálica limitado), pero muchos usuarios reportan beneficios reales, probablemente vía nervio vago.',
    benefits: [
      'Sensación rápida de relajación',
      'Reduce ansiedad situacional',
    ],
    dose: '100-300 mg',
    timing: '30 min antes de acostarte',
    notes: 'Funciona mejor para algunos que para otros. Prueba 2 semanas y evalúa.',
    color: 'from-fuchsia-400/25 to-pink-500/10',
  },
  {
    id: 'lemon_balm', tier: 'support',
    name: 'Melisa (Lemon Balm)',
    tagline: 'Hierba calmante clásica',
    purpose:
      'Inhibe la enzima GABA-transaminasa, aumentando los niveles de GABA. ' +
      'Tradicionalmente usada para ansiedad e insomnio leve. Buena combinada con manzanilla o valeriana.',
    benefits: [
      'Reduce ansiedad leve',
      'Mejora la calidad del sueño',
      'Suave, bien tolerada',
    ],
    dose: '300-600 mg de extracto',
    timing: '30-60 min antes de acostarte',
    notes: 'Sinergia clásica con manzanilla y valeriana.',
    color: 'from-lime-400/25 to-emerald-500/10',
  },
  {
    id: 'melatonin', tier: 'advanced',
    name: 'Melatonina (microdosis)',
    tagline: 'No es un somnífero, es un cronorregulador',
    purpose:
      'La melatonina NO es para "dormir más profundo" — es la señal de "ya es de noche" para tu cerebro. ' +
      'Útil sobre todo para jet lag, trabajos por turnos o fase de sueño retrasada. Dosis altas son contraproducentes.',
    benefits: [
      'Ajusta el ritmo circadiano',
      'Útil para jet lag y turnos rotativos',
      'Puede acortar el inicio del sueño en casos concretos',
    ],
    dose: '0,3-1 mg (no más). Las presentaciones de 5-10 mg son innecesarias',
    timing: '30-90 min antes de acostarte',
    notes: 'Más no es mejor. Dosis altas alteran el ritmo circadiano y causan despertares precoces.',
    color: 'from-indigo-400/25 to-violet-600/10',
  },
  {
    id: 'tart_cherry', tier: 'advanced',
    name: 'Cereza Ácida (Montmorency)',
    tagline: 'Melatonina natural + antiinflamatorio',
    purpose:
      'Fuente natural de melatonina y triptófano, además de antocianinas con efecto antiinflamatorio. ' +
      'Estudiada para mejorar duración y eficiencia del sueño.',
    benefits: [
      'Aumenta el tiempo total de sueño',
      'Mejora la eficiencia del sueño',
      'Útil tras esfuerzo físico intenso',
    ],
    dose: '500 mg de extracto concentrado o 240 ml de zumo concentrado',
    timing: '1-2 horas antes de acostarte',
    notes: 'Buena alternativa "alimentaria" a la melatonina sintética.',
    color: 'from-rose-400/25 to-red-600/10',
  },
  {
    id: 'inositol', tier: 'advanced',
    name: 'Inositol (Mio-inositol)',
    tagline: 'Modulador del estado de ánimo',
    purpose:
      'Pseudo-vitamina del grupo B que influye en la señalización de serotonina. ' +
      'Útil para ansiedad, ataques de pánico y mejora del sueño en personas con cuadros ansioso-depresivos.',
    benefits: [
      'Reduce ansiedad',
      'Mejora calidad del sueño asociada a ansiedad',
      'Apoyo en SOP en mujeres',
    ],
    dose: '2-4 g',
    timing: 'Por la noche',
    notes: 'Dosis altas (12-18 g) bajo supervisión profesional.',
    color: 'from-teal-400/25 to-cyan-600/10',
  },
  {
    id: 'taurine', tier: 'advanced',
    name: 'Taurina',
    tagline: 'Aminoácido modulador del GABA',
    purpose:
      'Aminoácido con efecto sobre receptores GABA y glicina. Reduce excitabilidad neuronal y favorece la relajación.',
    benefits: [
      'Efecto calmante suave',
      'Sinergia con magnesio',
      'Apoyo cardiovascular adicional',
    ],
    dose: '500-2000 mg',
    timing: '30-60 min antes de acostarte',
    notes: 'Pese a estar en bebidas energéticas, su efecto aislado es relajante (no estimulante).',
    color: 'from-blue-400/25 to-indigo-600/10',
  },
  {
    id: 'phosphatidylserine', tier: 'advanced',
    name: 'Fosfatidilserina',
    tagline: 'Para cortisol nocturno elevado',
    purpose:
      'Fosfolípido que reduce la respuesta de cortisol al estrés. Especialmente útil si te despiertas ' +
      'entre las 2-4 AM con la cabeza acelerada (típico de cortisol nocturno alto).',
    benefits: [
      'Reduce cortisol nocturno',
      'Disminuye despertares de madrugada',
      'Apoyo cognitivo adicional',
    ],
    dose: '100-300 mg',
    timing: '60 min antes de acostarte',
    notes: 'Caro, pero muy específico para perfiles de estrés crónico.',
    color: 'from-purple-400/25 to-fuchsia-600/10',
  },
];
