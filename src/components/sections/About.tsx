import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { teamMembers } from '../../data/team';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Check } from 'lucide-react';

export const About: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const checkVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="about" className="bg-brand-black py-24 md:py-32 relative overflow-hidden">

      {/* Light spots representing artistic set lightning */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-violet/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-brand-fuchsia/[0.02] blur-[130px] pointer-events-none" />

      <div className="section-container">

        {/* Layout header */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
          <Badge variant="neutral" className="border-brand-violet/30 text-brand-fuchsia bg-brand-violet/5 shadow-[0_0_15px_rgba(112,48,239,0.1)]">
            <Sparkles className="w-3 h-3 mr-1.5 inline" /> Dirección y Estrategia
          </Badge>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-cream tracking-tight">
            Quiénes están detrás de tu <span className="gold-gradient">transformación visual</span>
          </h2>
          <p className="text-brand-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            No somos operadoras de cámara tercerizadas. Somos estrategas visuales enfocadas en estructurar, dirigir y pulir la estética que tu marca merece.
          </p>
        </div>

        {/* Dynamic asymmetric team grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto items-stretch"
        >
          {teamMembers.map((member, idx) => (
            <motion.div variants={itemVariants} key={member.id} className="flex-grow flex">
              <Card
                className={`flex flex-col justify-between hover:border-brand-violet/35 hover:shadow-card-hover transition-all duration-700 bg-brand-surface/30 glass-panel flex-grow ${idx === 1 ? 'md:mt-16' : ''}`}
              >
                <div className="space-y-8 flex-grow">

                  {/* Visual container showing editorial photography */}
                  <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl bg-brand-black border border-brand-border/50 flex items-center justify-center relative overflow-hidden group shadow-inner">
                    
                    {/* Fallback elegant placeholder background with initials and gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-surface to-brand-black flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-16 h-16 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center mb-3">
                        <span className="text-xl font-bold text-brand-fuchsia">
                          {member.nombre.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-xs text-brand-muted font-medium">AFTERBOW Studio</span>
                    </div>

                    {member.imagen && (
                      <img 
                        src={member.imagen} 
                        alt={member.nombre} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105 z-10"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-transparent z-20 pointer-events-none" />

                    {/* Background overlay flash of brand accent */}
                    <div className="absolute inset-0 bg-brand-violet/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay z-25" />

                    {/* Aesthetic Role Title Overlay */}
                    <div className="absolute bottom-4 left-4 z-35">
                      <span className="text-[9px] font-bold tracking-[0.25em] text-brand-fuchsia-light uppercase bg-brand-black/80 border border-brand-border/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                        {idx === 0 ? 'Dirección Estética' : 'Estrategia Visual'}
                      </span>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-sans font-bold text-xl md:text-2xl text-brand-cream tracking-tight">
                        {member.nombre}
                      </h3>
                      <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest mt-1">
                        {member.rol}
                      </p>
                    </div>

                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light">
                      {member.descripcion}
                    </p>
                  </div>

                </div>

                {/* Masteries checklist with staggered animation */}
                <div className="pt-6 border-t border-brand-border/25 mt-8">
                  <span className="text-[10px] font-bold text-brand-muted/60 uppercase tracking-widest block mb-3">
                    Áreas de Maestría
                  </span>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {member.especialidades.map((skill, sIdx) => (
                      <motion.div
                        key={sIdx}
                        custom={sIdx}
                        variants={checkVariants}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-brand-fuchsia/[0.08] border border-brand-fuchsia/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-brand-fuchsia-light" />
                        </div>
                        <span className="text-[11px] text-brand-cream/80 font-medium">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
