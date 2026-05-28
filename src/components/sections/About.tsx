import React from 'react';
import { motion } from 'framer-motion';
import { teamMembers } from '../../data/team';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Check } from 'lucide-react';

export const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section id="about" className="bg-neutral-950 py-24 md:py-32 relative overflow-hidden">
      
      {/* Light spots representing artistic set lightning */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-[#C9A84C]/[0.02] blur-[130px] pointer-events-none" />

      <div className="section-container">
        
        {/* Layout header */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
          <Badge variant="gold">
            <Sparkles className="w-3 h-3 mr-1 inline" /> Dirección y Estrategia
          </Badge>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Quiénes están detrás de tu <span className="text-[#C9A84C]">transformación visual</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
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
                className={`flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-volumetric transition-all duration-700 bg-neutral-900/40 glass-panel flex-grow ${idx === 1 ? 'md:mt-16' : ''}`}
              >
              <div className="space-y-8 flex-grow">
                
                {/* Visual placeholder box simulating an editorial photography */}
                <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-center relative overflow-hidden group shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/10 to-transparent z-10" />
                  
                  {/* Background overlay flash of gold */}
                  <div className="absolute inset-0 bg-[#C9A84C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />

                  {/* Aesthetic Role Title Overlay */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[9px] font-bold tracking-[0.25em] text-[#C9A84C] uppercase bg-neutral-950/90 border border-neutral-800 px-3 py-1.5 rounded-full">
                      {idx === 0 ? 'Dirección Estética' : 'Estrategia Visual'}
                    </span>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-sans font-bold text-xl md:text-2xl text-white tracking-tight">
                      {member.nombre}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">
                      {member.rol}
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light">
                    {member.descripcion}
                  </p>
                </div>

              </div>

              {/* Masteries checklist */}
              <div className="pt-6 border-t border-neutral-900 mt-8">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-3">
                  Áreas de Maestría
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.especialidades.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#C9A84C]" />
                      </div>
                      <span className="text-[11px] text-neutral-300 font-medium">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
