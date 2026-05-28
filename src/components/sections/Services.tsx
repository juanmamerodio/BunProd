import React from 'react';
import { motion } from 'framer-motion';
import { services } from '../../data/services';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import {
  Video,
  Sparkles,
  Layers,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<number, React.ReactNode> = {
  0: <Video className="w-5 h-5 text-brand-gold-light" />,
  1: <Sparkles className="w-5 h-5 text-brand-gold-light" />,
  2: <Layers className="w-5 h-5 text-brand-gold-light" />,
  3: <TrendingUp className="w-5 h-5 text-brand-gold-light" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const Services: React.FC = () => {
  const scrollTo = useSmoothScroll();

  return (
    <section
      id="services"
      className="relative bg-brand-black py-28 md:py-36 overflow-hidden noise-overlay"
    >
      {/* Ambient glow - Hidden on mobile for performance */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-brand-gold/[0.03] blur-[150px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none hidden md:block" />

      <div className="section-container relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mb-20"
        >
          <Badge variant="gold" className="mb-5">
            Ecosistema de Servicios
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] text-brand-cream leading-[1.15] tracking-tight">
            No vendemos videos.{' '}
            <span className="gold-gradient">
              Diseñamos tu sistema de autoridad visual.
            </span>
          </h2>
          <p className="text-brand-muted text-base md:text-lg mt-5 leading-relaxed max-w-2xl">
            Cada servicio está diseñado como una pieza estratégica dentro de un
            ecosistema de conversión. Producciones cinematográficas que
            posicionan, retienen y venden.
          </p>
        </motion.div>

        {/* ── Services Grid — editorial asymmetric layout ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        >
          {services.map((service, idx) => {
            // First card spans full width on lg for editorial impact
            const isHero = idx === 0;
            const colSpan = isHero ? 'lg:col-span-12' : 'lg:col-span-4';

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={`${colSpan}`}
              >
                <Card
                  className={`h-full border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm flex flex-col justify-between hover:border-brand-gold/25 transition-colors duration-500 ${
                    isHero ? 'md:flex-row md:gap-12' : ''
                  }`}
                >
                  <div
                    className={`space-y-6 flex-1 ${
                      isHero ? 'md:max-w-[55%]' : ''
                    }`}
                  >
                    {/* Icon + Tag header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-gold/[0.08] flex items-center justify-center border border-brand-gold/20">
                        {iconMap[idx] || iconMap[0]}
                      </div>
                      {service.tag && (
                        <Badge variant="gold">{service.tag}</Badge>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h3
                        className={`font-display font-bold text-brand-cream tracking-wide leading-tight ${
                          isHero
                            ? 'text-2xl md:text-3xl'
                            : 'text-lg md:text-xl'
                        }`}
                      >
                        {service.titulo}
                      </h3>
                      <p
                        className={`text-brand-muted leading-relaxed ${
                          isHero ? 'text-sm md:text-base' : 'text-xs md:text-sm'
                        }`}
                      >
                        {service.descripcion}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="pt-4 border-t border-brand-border/30 space-y-4">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] block">
                        Beneficios Clave
                      </span>
                      <ul className="space-y-2.5">
                        {service.beneficios.map((beneficio, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-xs text-brand-cream/90"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-light flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{beneficio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Result + CTA */}
                  <div
                    className={`space-y-4 ${
                      isHero
                        ? 'md:max-w-[40%] md:border-l md:border-brand-border/30 md:pl-12 flex flex-col justify-center'
                        : 'pt-6 mt-auto'
                    }`}
                  >
                    <div className="p-4 rounded-xl bg-brand-black/50 border border-brand-border/40">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] block mb-2">
                        Resultado Esperado
                      </span>
                      <p className="text-xs text-brand-cream/80 leading-relaxed">
                        {service.resultadoEsperado}
                      </p>
                    </div>

                    <button
                      onClick={() => scrollTo('qualification')}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-gold-light hover:text-brand-gold transition-colors group cursor-pointer pt-1"
                    >
                      Consultar Disponibilidad
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Section CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mt-20 flex flex-col items-center text-center gap-4"
        >
          <p className="text-sm text-brand-muted max-w-md">
            ¿No sabés cuál es tu próximo paso? Empezá con una consultoría
            gratuita donde analizamos tu ecosistema de contenido actual.
          </p>
          <Button
            variant="secondary"
            size="md"
            icon={ArrowRight}
            onClick={() => scrollTo('calendly')}
          >
            Agendar Consultoría Gratis
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
