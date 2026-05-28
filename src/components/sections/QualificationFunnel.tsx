import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Check,
  Flame,
  ShieldCheck,
  Sparkles,
  Send,
  Crown,
  Zap,
  Eye,
  Film,
  Palette,
} from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Auditoría de Autoridad Visual Gratuita',
    desc: 'Analizamos todo tu ecosistema de contenido actual y diagnosticamos oportunidades ocultas.',
  },
  {
    icon: Palette,
    title: 'Planificación Estratégica de 30 Días',
    desc: 'Diseñamos tu hoja de ruta cinematográfica con calendario editorial completo.',
  },
  {
    icon: Film,
    title: 'Rodaje Premium In-Situ con Óptica de Cine',
    desc: 'Jornada intensiva de filmación 4K con dirección creativa presencial.',
  },
  {
    icon: Zap,
    title: 'Edición con Metodología de Retención Moño',
    desc: 'Postproducción con color grading, SFX inmersivo y edición psicológica de alto impacto.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía de Satisfacción Absoluta',
    desc: 'Si no estás conforme con el primer corte, recalculamos sin costo adicional.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const QualificationFunnel: React.FC = () => {
  return (
    <section
      id="qualification"
      className="relative bg-brand-black py-28 md:py-36 overflow-hidden noise-overlay"
    >
      {/* Multi-layered ambient glow */}
      <div className="absolute top-[15%] right-[-8%] w-[45%] h-[45%] rounded-full bg-brand-gold/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-brand-gold/[0.02] blur-[100px] pointer-events-none" />

      {/* Decorative vertical line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-brand-gold/20 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ── Left: Value Proposition ── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="lg:col-span-6 space-y-8"
            >
              <div className="space-y-5">
                <motion.div variants={itemVariants}>
                  <Badge variant="gold" className="flex items-center gap-1.5 w-fit">
                    <Flame className="w-3.5 h-3.5" />
                    Cupos Estrictamente Limitados
                  </Badge>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-brand-cream leading-[1.12] tracking-tight"
                >
                  Aplicá al Plan <br />
                  <span className="gold-gradient">
                    Moño Premium 30 Días
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-sm md:text-base text-brand-muted leading-relaxed max-w-lg"
                >
                  No trabajamos con cualquiera. Buscamos marcas y profesionales
                  ambiciosos dispuestos a liderar visualmente su industria.
                  Aplicá hoy para calificar para nuestro plan integral de
                  transformación.
                </motion.p>
              </div>

              {/* Feature checklist */}
              <div className="space-y-4 pt-2">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="flex gap-4 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-brand-gold/[0.08] border border-brand-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/15 transition-colors duration-500">
                        <Icon className="w-4 h-4 text-brand-gold-light" />
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-brand-cream tracking-wide">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Right: Exclusive Application Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="lg:col-span-6"
            >
              <div className="relative p-8 md:p-10 rounded-[2rem] bg-brand-surface/60 backdrop-blur-xl border border-brand-gold/15 glow-gold overflow-hidden">
                {/* Corner glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-gold/10 to-transparent rounded-bl-[6rem] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-gold/[0.05] to-transparent pointer-events-none" />

                {/* Crown icon */}
                <div className="absolute -top-1 -right-1 w-14 h-14 flex items-center justify-center pointer-events-none">
                  <Crown className="w-5 h-5 text-brand-gold/30" />
                </div>

                <div className="relative z-10 space-y-7">
                  {/* Step indicator */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse-slow" />
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">
                        Acceso Exclusivo
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-brand-cream leading-tight">
                      Iniciar Aplicación Premium
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      Completá el pre-filtro para ver si tu marca califica para
                      la consultoría diagnóstica y plan de transformación visual.
                    </p>
                  </div>

                  {/* Visual exclusivity box */}
                  <div className="p-5 rounded-2xl bg-brand-black/50 border border-brand-border/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand-cream font-medium">
                        Requisitos del Perfil
                      </span>
                      <span className="text-[10px] font-bold text-brand-gold-light uppercase tracking-wider">
                        Obligatorio
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-brand-border/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 0.75 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                        className="h-full w-full origin-left bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light rounded-full"
                      />
                    </div>

                    <div className="space-y-2.5">
                      {[
                        'Facturación activa y capacidad operativa real.',
                        'Compromiso con la excelencia visual a largo plazo.',
                        'Disposición a invertir en contenido profesional.',
                      ].map((req, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex items-center gap-2.5 text-xs text-brand-muted"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-gold-light flex-shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-1 space-y-4">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={Send}
                      onClick={() => {
                        // Fricción Intencional: Redirección al formulario de calificación real
                        window.open('https://form.typeform.com/to/placeholder', '_blank', 'noopener,noreferrer');
                      }}
                    >
                      Iniciar Aplicación Premium
                    </Button>

                    {/* Scarcity / Authority text */}
                    <p className="text-[10px] text-center text-brand-muted/70 leading-relaxed">
                      *Revisamos cada solicitud cuidadosamente para garantizar
                      nuestra calidad cinematográfica. Solo aceptamos marcas con
                      las que podamos generar resultados extraordinarios.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
