import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { useScroll, useTransform } from 'framer-motion';

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, // Elegante bezier de desaceleración
    },
  },
};

export const Hero: React.FC = () => {
  const scrollTo = useSmoothScroll();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950 pt-28 pb-20">
      
      {/* Background cinematic visuals & gradients */}
      <div className="absolute inset-0 bg-neutral-950 z-0" />
      
      {/* Abstract luxury gold & white light beams */}
      <motion.div style={{ y: yBg }} className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9A84C]/8 blur-[120px] pointer-events-none" />
      <motion.div style={{ y: yBg }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/[0.03] blur-[150px] pointer-events-none" />
      
      {/* Subtle simulated video overlay texture */}
      <div className="absolute inset-0 opacity-[0.05] bg-noise pointer-events-none z-10 mix-blend-overlay" />
      
      {/* Fine vertical line to guide the eye */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[350px] bg-gradient-to-b from-neutral-800/80 via-neutral-900/40 to-transparent pointer-events-none" />

      <div className="section-container relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Premium copywriting funnel */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start space-y-6 md:space-y-8 text-left"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="gold" className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Estudio Creativo Audiovisual
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white tracking-tight text-balance"
          >
            Construimos el <span className="text-[#C9A84C]">contenido del mes</span> para tu negocio.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-neutral-400 text-base sm:text-lg md:text-xl font-light max-w-xl leading-relaxed text-balance"
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
              Aplicá a Moño Premium
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
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: yVideo }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
          className="lg:col-span-5 relative w-full flex justify-center"
        >
          <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-[2rem] overflow-hidden glass-panel shadow-volumetric group">
            
            {/* Real Video Integration - Plays automatically */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              poster="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=800&auto=format&fit=crop"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-with-a-professional-camera-42903-large.mp4" type="video/mp4" />
              Tu navegador no soporta video.
            </video>

            {/* Cinematic overlay over video */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950/95 z-10" />
            <div className="absolute inset-0 bg-brand-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-950/80 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <Video className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider shadow-black drop-shadow-md">Moño Showreel</h4>
                  <p className="text-[10px] font-medium text-neutral-300 shadow-black drop-shadow-md tracking-wide">Dirección y Estética Premium</p>
                </div>
              </div>
              
              <div
                className="w-full py-4 rounded-xl bg-white/5 backdrop-blur-xl text-white border border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-white hover:text-black transition-colors duration-500 shadow-lg"
                onClick={() => scrollTo('portfolio-marquee')}
              >
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Ver Casos Completos</span>
              </div>
            </div>
          </div>

          {/* Floating UI Live Indicator */}
          <div className="absolute -top-4 -left-4 glass-panel py-2.5 px-4 rounded-xl flex items-center gap-2.5 pointer-events-none shadow-volumetric">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase drop-shadow-sm">Cupos Abiertos</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
