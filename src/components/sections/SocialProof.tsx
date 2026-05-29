import React from 'react';
import { motion } from 'framer-motion';
import { metrics } from '../../data/metrics';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Badge } from '../ui/Badge';
import { Award, Zap, Heart, Sparkles } from 'lucide-react';

const blurInVariants = {
  hidden: { 
    opacity: 0, 
    y: 25,
    filter: 'blur(8px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: i * 0.1,
    },
  }),
};

export const SocialProof: React.FC = () => {
  // Dynamic icons list matching metrics size
  const icons = [
    <Zap className="w-5 h-5 text-brand-text" />,
    <Sparkles className="w-5 h-5 text-brand-gold" />,
    <Award className="w-5 h-5 text-brand-text" />,
    <Heart className="w-5 h-5 text-brand-gold" />
  ];

  return (
    <section className="bg-brand-black border-y border-brand-border/30 py-24 relative overflow-hidden">
      
      {/* Soft spotlight behind the dashboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] rounded-full bg-white/[0.008] blur-[160px] pointer-events-none" />

      <div className="section-container">
        
        {/* Subtle dashboard header */}
        <div className="text-center mb-16 space-y-3">
          <Badge variant="neutral">Métricas de Autoridad</Badge>
          <h3 className="font-sans font-bold text-2xl md:text-3xl text-brand-cream">
            El impacto de nuestras producciones en números
          </h3>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.id}
              custom={idx}
              variants={blurInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-brand-surface/30 border border-brand-border/40 p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col items-start justify-between min-h-[170px] hover:border-brand-gold-dark/25 hover:shadow-card-hover transition-all duration-700 group"
            >
              {/* Stat Icon */}
              <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center border border-brand-border/60 group-hover:border-brand-gold/20 transition-colors duration-500">
                {icons[idx]}
              </div>

              {/* Dynamic Spring Counter widget */}
              <div className="mt-6 space-y-1">
                <AnimatedCounter value={metric.valor} suffix={metric.sufijoPrefijo} />
                <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">
                  {metric.etiqueta}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Confiado por marcas líderes banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-10 border-t border-brand-border/25 text-center space-y-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-muted/50">
            Confiado por marcas líderes en su categoría
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-30 hover:opacity-60 transition-opacity duration-700">
            {['Aura Atelier', 'Clínica Dermolaser', 'Nero Bistró', 'Apex Holdings', 'Lux Agency'].map((logo, lIdx) => (
              <motion.span
                key={lIdx}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + lIdx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-xs md:text-sm font-semibold tracking-widest text-brand-cream border-r last:border-0 border-brand-border/40 pr-8 last:pr-0"
              >
                {logo.toUpperCase()}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
