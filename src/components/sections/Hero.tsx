import React, { useMemo } from 'react';
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
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// Word reveal animation with focal lens blur entry
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
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Word-by-word animation container
const wordContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

const wordVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Component to animate text word-by-word
const AnimatedWords: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const words = useMemo(() => text.split(' '), [text]);
  return (
    <motion.span variants={wordContainerVariants} className={className}>
      {words.map((word, idx) => (
        <motion.span 
          key={idx} 
          variants={wordVariants} 
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Hero: React.FC = () => {
  const scrollTo = useSmoothScroll();
  const { scrollY } = useScroll();
  
  // Multi-speed parallax layers
  const yBgSlow = useTransform(scrollY, [0, 1000], [0, 300]);
  const yBgMed = useTransform(scrollY, [0, 1000], [0, 150]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, -120]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0.3]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black pt-28 pb-20 select-none">
      
      {/* Background cinematic visuals & gradients */}
      <div className="absolute inset-0 bg-brand-black z-0" />
      
      {/* Slow-Drifting Luxury Auroras (After Effects style) — Deepest layer */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 0.92, 1],
          x: [0, 50, -35, 0],
          y: [0, -40, 25, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: yBgSlow }} 
        className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-full bg-brand-violet/[0.08] blur-[160px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 0.88, 1.12, 1],
          x: [0, -60, 40, 0],
          y: [0, 50, -25, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ y: yBgSlow }} 
        className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-brand-fuchsia/[0.05] blur-[180px] pointer-events-none" 
      />
      {/* Mid-layer orb — oliva */}
      <motion.div 
        animate={{
          scale: [1, 1.06, 0.96, 1],
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
        style={{ y: yBgMed }} 
        className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-brand-violet-dark/[0.1] blur-[150px] pointer-events-none" 
      />
      
      {/* Cinematic noise texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-noise pointer-events-none z-10 mix-blend-overlay" />
      
      {/* Animated vertical guide line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[350px] bg-gradient-to-b from-brand-violet-light/30 via-brand-fuchsia/10 to-transparent pointer-events-none origin-top"
      />

      <motion.div 
        style={{ opacity: opacityFade }}
        className="section-container relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        
        {/* Left Column: Premium copywriting funnel */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start space-y-6 md:space-y-8 text-left"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="gold" className="flex items-center gap-2 px-3 py-1 bg-brand-violet/[0.08] border border-brand-violet/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-brand-fuchsia" />
              Estudio Creativo Audiovisual
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-brand-text tracking-tighter text-balance drop-shadow-xl"
          >
            <AnimatedWords text="Construimos" />
            <span className="font-display font-semibold italic text-brand-fuchsia pr-2 drop-shadow-lg">
              <AnimatedWords text="el contenido del mes" />
            </span>
            <AnimatedWords text="para tu negocio." />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-brand-muted font-body text-base sm:text-lg md:text-xl font-light max-w-xl leading-relaxed text-balance"
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
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          style={{ y: yVideo }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 }}
          className="lg:col-span-5 relative w-full flex justify-center"
        >
          <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-[2rem] overflow-hidden glass-panel shadow-volumetric group">
            
            {/* Real Video Integration - Plays automatically */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              poster="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=800&auto=format&fit=crop"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-with-a-professional-camera-42903-large.mp4" type="video/mp4" />
              Tu navegador no soporta video.
            </video>

            {/* Cinematic overlay over video */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/20 to-brand-black/90 z-10" />
            <div className="absolute inset-0 bg-brand-violet/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-black/80 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <Video className="w-4 h-4 text-brand-fuchsia" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-brand-text uppercase tracking-wider drop-shadow-md">Afterbun Showreel</h4>
                  <p className="text-[9px] font-medium text-brand-muted drop-shadow-md tracking-wide">Dirección y Estética de Lujo</p>
                </div>
              </div>
              
              <div
                className="w-full py-4 rounded-xl bg-white/5 backdrop-blur-xl text-brand-text border border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-brand-fuchsia hover:text-white transition-colors duration-500 shadow-lg"
                onClick={() => scrollTo('portfolio-marquee')}
              >
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Ver Casos Completos</span>
              </div>
            </div>
          </div>

          {/* Floating UI Live Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-4 -left-4 glass-panel py-2.5 px-4 rounded-xl flex items-center gap-2.5 pointer-events-none shadow-volumetric"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase drop-shadow-sm">Cupos Abiertos</span>
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  );
};
