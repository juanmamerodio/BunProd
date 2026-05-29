import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const PortfolioMarquee: React.FC = () => {
  // Row 1: Cinematic and Editorial Productions
  const row1 = [
    { title: 'Aura Atelier Fashion Film', category: 'Moda / Editorial', length: '0:45', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop' },
    { title: 'Nero Bistró Culinary Short', category: 'Gastronomía / Lujo', length: '1:15', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop' },
    { title: 'Apex Corporate Branding', category: 'Corporativo / Premium', length: '2:30', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop' },
    { title: 'Vortex Crypto Identity', category: 'Fintech / Motion', length: '0:50', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop' },
    { title: 'Dermolaser Clinique Campaign', category: 'Estética / High-Ticket', length: '1:00', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop' },
  ];

  // Row 2: Reels, Social Campaigns, and BTS
  const row2 = [
    { title: 'Afterbun Premium Showreel', category: 'Showreel / Director Cut', length: '1:45', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop' },
    { title: 'High-Ticket Launch Funnel', category: 'Estrategia / Conversión', length: '0:30', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
    { title: 'Terra Luxury Real Estate', category: 'Cinematic / Inmobiliaria', length: '2:15', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
    { title: 'BTS - Directing Aura Set', category: 'Detrás de Escena / Cine', length: '3:00', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop' },
    { title: 'Elixir Skincare Product Launch', category: 'E-Commerce / Premium', length: '0:45', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop' },
  ];

  // Repeat arrays for seamless loop
  const continuousRow1 = [...row1, ...row1, ...row1];
  const continuousRow2 = [...row2, ...row2, ...row2];

  return (
    <section id="portfolio-marquee" className="bg-brand-black py-24 md:py-32 overflow-hidden relative noise-overlay">
      
      {/* Light edge masks */}
      <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-brand-black via-brand-black/70 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-brand-black via-brand-black/70 to-transparent z-20 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[350px] bg-brand-gold/[0.02] blur-[150px] pointer-events-none" />

      {/* Aesthetic introduction header */}
      <div className="section-container relative z-10 mb-16 space-y-4 text-center">
        <Badge variant="gold">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline text-brand-gold" /> 
          Estética En Movimiento
        </Badge>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-brand-cream tracking-tight">
          Producciones recientes en <span className="gold-gradient">rotación constante</span>
        </h2>
        <p className="text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
          Una curaduría de nuestros últimos trabajos mensuales, comerciales y piezas de alto valor visual para marcas premium.
        </p>
      </div>

      {/* Infinite scrolling tracks */}
      <div className="flex flex-col gap-8 w-full">
        {/* ROW 1 (Moves Left) */}
        <div className="flex w-[300%] md:w-[200%] gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
          {continuousRow1.map((work, idx) => (
            <div
              key={`r1-${idx}`}
              className="flex-shrink-0 w-72 md:w-[400px] aspect-[16/10] rounded-[2rem] bg-brand-surface border border-brand-border/40 relative overflow-hidden group flex flex-col justify-end p-6 hover:border-brand-gold/30 hover:shadow-card-hover transition-all duration-700 ease-out transform-gpu hover:-translate-y-2 hover:rotate-1"
            >
              {/* Image background with dark cinematic overlay */}
              <img 
                src={work.image} 
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-[1.08] group-hover:opacity-75 transition-all duration-[1500ms] ease-out z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent z-10" />
              
              {/* Play button */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500 z-20 shadow-lg">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>

              {/* Hover flash of gold light */}
              <div className="absolute inset-0 bg-brand-gold/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 mix-blend-overlay" />

              {/* Details */}
              <div className="relative z-20 space-y-1">
                <span className="text-[9px] font-bold tracking-[0.2em] text-brand-gold uppercase">
                  {work.category} • {work.length} MIN
                </span>
                <h3 className="text-sm md:text-base font-bold text-brand-cream tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                  {work.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 2 (Moves Right) */}
        <div className="flex w-[300%] md:w-[200%] gap-6 animate-marquee-reverse hover:[animation-play-state:paused] cursor-pointer">
          {continuousRow2.map((work, idx) => (
            <div
              key={`r2-${idx}`}
              className="flex-shrink-0 w-72 md:w-[400px] aspect-[16/10] rounded-[2rem] bg-brand-surface border border-brand-border/40 relative overflow-hidden group flex flex-col justify-end p-6 hover:border-brand-gold/30 hover:shadow-card-hover transition-all duration-700 ease-out transform-gpu hover:-translate-y-2 hover:-rotate-1"
            >
              {/* Image background with dark cinematic overlay */}
              <img 
                src={work.image} 
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-[1.08] group-hover:opacity-75 transition-all duration-[1500ms] ease-out z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent z-10" />
              
              {/* Play button */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500 z-20 shadow-lg">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>

              {/* Hover flash of gold light */}
              <div className="absolute inset-0 bg-brand-gold/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 mix-blend-overlay" />

              {/* Details */}
              <div className="relative z-20 space-y-1">
                <span className="text-[9px] font-bold tracking-[0.2em] text-brand-gold uppercase">
                  {work.category} • {work.length} MIN
                </span>
                <h3 className="text-sm md:text-base font-bold text-brand-cream tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                  {work.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
