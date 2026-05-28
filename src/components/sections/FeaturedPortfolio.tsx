import React from 'react';
import { motion } from 'framer-motion';
import { portfolioCases } from '../../data/portfolio';
import { Badge } from '../ui/Badge';
import {
  Play,
  TrendingUp,
  ArrowUpRight,
  } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const caseVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const FeaturedPortfolio: React.FC = () => {
  return (
    <section
      id="portfolio"
      className="relative bg-brand-dark py-28 md:py-36 overflow-hidden noise-overlay"
    >
      {/* Ambient */}
      <div className="absolute top-[10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-brand-gold/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <Badge variant="gold" className="mb-5">
            Casos de Éxito &amp; Resultados Reales
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] text-brand-cream leading-[1.15] tracking-tight">
            Producciones que{' '}
            <span className="gold-gradient">Generan Impacto</span>
          </h2>
          <p className="text-brand-muted text-base md:text-lg mt-5 leading-relaxed max-w-2xl mx-auto">
            No medimos el éxito en likes. Lo medimos en facturación,
            conversiones y autoridad de mercado.
          </p>
        </motion.div>

        {/* ── Portfolio Cases ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-28"
        >
          {portfolioCases.map((item, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <motion.article
                key={item.id}
                variants={caseVariants}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center will-change-transform"
              >
                {/* ─ Visual Frame ─ */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? 'lg:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-brand-border/50 bg-brand-surface group cursor-pointer">
                    {/* Dark cinematic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent z-10" />

                    {/* Hover gold tint */}
                    <div className="absolute inset-0 bg-brand-gold/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />

                    {/* Simulated cinematic dark background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-brand-black z-0 group-hover:scale-105 transition-transform duration-700 ease-out" />

                    {/* Before / After Badges */}
                    <div className="absolute top-5 left-5 z-20 flex gap-2">
                      <span className="text-[9px] font-bold bg-neutral-950/80 text-brand-muted border border-neutral-800 px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">
                        Antes: <span className="text-red-400">Común</span>
                      </span>
                      <span className="text-[9px] font-bold bg-neutral-950/80 text-brand-cream border border-brand-gold/30 px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">
                        Después: <span className="text-[#C9A84C]">Moño</span>
                      </span>
                    </div>

                    {/* Play Button + Client Name */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
                      {/* Play circle */}
                      <motion.button
                        aria-label={`Reproducir caso de éxito de ${item.cliente}`}
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full glass-panel shadow-volumetric border-brand-gold/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700"
                      >
                        <Play className="w-6 h-6 md:w-7 md:h-7 text-brand-gold group-hover:text-black ml-1 fill-current transition-colors duration-700" aria-hidden="true" />
                      </motion.button>

                      {/* Client label on hover */}
                      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] block">
                          {item.industria}
                        </span>
                        <h3 className="font-display font-bold text-xl md:text-2xl text-white mt-1">
                          {item.cliente}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom gradient bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold/40 to-brand-gold/0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>

                {/* ─ Content Side ─ */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isReversed ? 'lg:order-1' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase">
                      {item.industria}
                    </span>
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-brand-cream leading-tight">
                      Cómo redefinimos la estética de{' '}
                      <span className="text-brand-gold-light">
                        {item.cliente}
                      </span>
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {item.descripcion}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold text-brand-gold-light/80 bg-brand-gold/[0.06] border border-brand-gold/15 px-3 py-1.5 rounded-full tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metric Highlight */}
                  <div className="pt-5 border-t border-brand-border/40">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-surface/60 border border-brand-border/40 glass-panel shadow-volumetric hover:border-brand-gold/20 transition-all duration-500 cursor-pointer group">
                      <div className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="w-5 h-5 text-brand-gold-light" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] block">
                          Métrica Destacada
                        </span>
                        <p className="text-sm font-bold text-brand-cream mt-0.5 leading-snug group-hover:text-brand-gold-light transition-colors duration-300">
                          {item.metricaDestacada}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-brand-gold/40 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
