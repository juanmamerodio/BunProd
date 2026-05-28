import React from 'react';
import { motion } from 'framer-motion';
import { metrics } from '../../data/metrics';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Badge } from '../ui/Badge';
import { Award, Zap, Heart, Sparkles } from 'lucide-react';

export const SocialProof: React.FC = () => {
  // Dynamic icons list matching metrics size
  const icons = [
    <Zap className="w-5 h-5 text-white" />,
    <Sparkles className="w-5 h-5 text-[#C9A84C]" />,
    <Award className="w-5 h-5 text-white" />,
    <Heart className="w-5 h-5 text-[#C9A84C]" />
  ];

  return (
    <section className="bg-neutral-950 border-y border-neutral-900 py-24 relative overflow-hidden">
      
      {/* Soft spotlight behind the dashboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] rounded-full bg-white/[0.01] blur-[160px] pointer-events-none" />

      <div className="section-container">
        
        {/* Subtle dashboard header */}
        <div className="text-center mb-16 space-y-3">
          <Badge variant="neutral">Métricas de Autoridad</Badge>
          <h3 className="font-sans font-bold text-2xl md:text-3xl text-white">
            El impacto de nuestras producciones en números
          </h3>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: idx * 0.1 }}
              className="bg-neutral-900/40 border border-neutral-900 p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col items-start justify-between min-h-[170px] hover:border-neutral-800 transition-colors duration-300"
            >
              {/* Stat Icon */}
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
                {icons[idx]}
              </div>

              {/* Dynamic Spring Counter widget */}
              <div className="mt-6 space-y-1">
                <AnimatedCounter value={metric.valor} suffix={metric.sufijoPrefijo} />
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                  {metric.etiqueta}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Confiado por marcas líderes banner */}
        <div className="mt-20 pt-10 border-t border-neutral-900 text-center space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            Confiado por marcas líderes en su categoría
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-40 hover:opacity-75 transition-opacity duration-500">
            {['Aura Atelier', 'Clínica Dermolaser', 'Nero Bistró', 'Apex Holdings', 'Lux Agency'].map((logo, lIdx) => (
              <span
                key={lIdx}
                className="font-sans text-xs md:text-sm font-semibold tracking-widest text-white border-r last:border-0 border-neutral-800 pr-8 last:pr-0"
              >
                {logo.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
