import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { useScroll, useTransform } from 'framer-motion';

// Majestic cinematic container variant
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

// Word/Item reveal animation with focal lens blur entry
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const, // Camera lens pull-focus bezier
    },
  },
};

export const Hero: React.FC = () => {
  const scrollTo = useSmoothScroll();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 150]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, -60]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050302] pt-28 pb-20 select-none">
      
      {/* Background cinematic visuals & gradients */}
      <div className="absolute inset-0 bg-[#050302] z-0" />
      
      {/* Slow-Drifting Luxury Auroras (After Effects style) */}
      <motion.div 
        animate={{
          scale: [1, 1.12, 0.95, 1],
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: yBg }} 
        className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] rounded-full bg-[#E8D1A7]/6 blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 0.9, 1.1, 1],
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: yBg }} 
        className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#84592B]/5 blur-[160px] pointer-events-none" 
      />
      
      {/* Subtle simulated video overlay texture (cinematic noise) */}
      <div className="absolute inset-0 opacity-[0.045] bg-noise pointer-events-none z-10 mix-blend-overlay" />
      
      {/* Fine vertical line to guide the eye */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[350px] bg-gradient-to-b from-[#9D9167]/30 via-[#442D1C]/10 to-transparent pointer-events-none" />

      <div className="section-container relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Premium copywriting funnel */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start space-y-6 md:space-y-8 text-left"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="gold" className="flex items-center gap-2 px-3 py-1 bg-[#E8D1A7]/5 border border-[#E8D1A7]/15 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E8D1A7]" />
              Estudio Creativo Audiovisual
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] text-[#F5EFE6] tracking-tight text-balance"
          >
            Construimos <span className="font-display italic font-normal text-[#E8D1A7] pr-2">el contenido del mes</span> para tu negocio.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#A0958E] font-body text-base sm:text-lg md:text-xl font-light max-w-xl leading-relaxed text-balance"
          >
            Nos trasladamos directamente a tu espacio de trabajo para capturar tu esencia. Sin logística, sin estrés. Transformamos tu presencia digital con producciones cinematográficas de alta retención.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
          >
            <Button
              variant="primary"
              size="lg"
              className="flex items-center justify-center gap-2 group w-full sm:w-auto"
              onClick={() => scrollTo('qualification')}
            >
              Aplicá a Afterbun Premium
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={() => scrollTo('portfolio')}
            >
              Ver casos de éxito
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column: Real Video Reel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: yVideo }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.35 }}
          className="lg:col-span-5 relative w-full flex justify-center"
        >
          <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-[2rem] overflow-hidden glass-panel shadow-volumetric group">
            
            {/* Real Video Integration - Plays automatically */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-700"
              poster="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=800&auto=format&fit=crop"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-with-a-professional-camera-42903-large.mp4" type="video/mp4" />
              Tu navegador no soporta video.
            </video>

            {/* Cinematic overlay over video */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050302]/30 to-[#050302]/95 z-10" />
            <div className="absolute inset-0 bg-[#E8D1A7]/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#050302]/85 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <Video className="w-4 h-4 text-[#E8D1A7]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#F5EFE6] uppercase tracking-wider shadow-black drop-shadow-md">Afterbun Showreel</h4>
                  <p className="text-[9px] font-medium text-[#A0958E] shadow-black drop-shadow-md tracking-wide">Dirección y Estética de Lujo</p>
                </div>
              </div>
              
              <div
                className="w-full py-4 rounded-xl bg-white/5 backdrop-blur-xl text-[#F5EFE6] border border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#E8D1A7] hover:text-[#442D1C] transition-colors duration-500 shadow-lg"
                onClick={() => scrollTo('portfolio-marquee')}
              >
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#442D1C] group-hover:text-[#E8D1A7] transition-colors duration-500">
                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Ver Casos Completos</span>
              </div>
            </div>
          </div>

          {/* Floating UI Live Indicator */}
          <div className="absolute -top-4 -left-4 glass-panel py-2.5 px-4 rounded-xl flex items-center gap-2.5 pointer-events-none shadow-volumetric">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase drop-shadow-sm">Cupos Abiertos</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
