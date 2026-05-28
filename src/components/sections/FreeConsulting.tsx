import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import {
  Video,
  Clock,
  Award,
} from 'lucide-react';

const consultingDetails = [
  {
    icon: Clock,
    label: 'Duración',
    value: '30 Minutos',
  },
  {
    icon: Video,
    label: 'Plataforma',
    value: 'Video Llamada de Zoom',
  },
  {
    icon: Award,
    label: 'Con Quién',
    value: 'Directora Creativa Senior',
  },
];

export const FreeConsulting: React.FC = () => {
  return (
    <section
      id="calendly"
      className="relative bg-black py-28 md:py-36 overflow-hidden"
    >
      {/* Pure black — zero noise, zero distraction */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Single subtle gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* ── Ultra-clean header ── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16 space-y-5"
          >
            <Badge variant="gold">Diagnóstico Estratégico Sin Cargo</Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-[1.15] tracking-tight">
              Reservá una consultoría{' '}
              <span className="gold-gradient">estratégica gratuita.</span>
            </h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Descubrí los puntos débiles de tu comunicación visual y cómo
              estructurar un ecosistema de contenido que convierta.
            </p>
          </motion.div>

          {/* ── Main layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Call details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-4 flex flex-col justify-between p-8 rounded-[1.5rem] bg-neutral-950 border border-neutral-800/60"
            >
              <div className="space-y-7">
                {consultingDetails.map((detail, idx) => {
                  const Icon = detail.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-gold/[0.08] flex items-center justify-center border border-brand-gold/15 flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-brand-gold-light" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                          {detail.label}
                        </h4>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 mt-8 border-t border-neutral-800/40">
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  * 100% gratuito. No te venderemos nada a menos que apliques y
                  califiques para nuestra producción premium de forma explícita.
                </p>
              </div>
            </motion.div>

            {/* Right: Calendly placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="lg:col-span-8"
            >
              <div className="h-full min-h-[600px] rounded-[1.5rem] bg-neutral-950/60 backdrop-blur-md border border-neutral-800/50 relative overflow-hidden flex flex-col p-1 md:p-2">
                {/* Calendly Inline Widget Real */}
                <iframe
                  src="https://calendly.com/placeholder-link?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=c9a84c"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="min-h-[600px] w-full rounded-xl"
                  title="Reserva tu Consultoría con Moño Producciones"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
