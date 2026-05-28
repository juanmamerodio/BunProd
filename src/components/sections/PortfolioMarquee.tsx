import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const PortfolioMarquee: React.FC = () => {
  // Cinematic asset previews
  const works = [
    { title: 'Aura Atelier Fashion Film', category: 'Moda / Editorial', length: '0:45' },
    { title: 'Dermolaser Clinique Spot', category: 'Estética / High-Ticket', length: '1:10' },
    { title: 'Nero Bistró Experience', category: 'Gastronomía / Autor', length: '1:30' },
    { title: 'Vortex Crypto Campaign', category: 'Fintech / Motion', length: '0:55' },
    { title: 'Apex Corporate Keynote', category: 'Corporativo / Lujo', length: '2:00' },
  ];

  // Repeat works array to enable endless looping scroll
  const continuousWorks = [...works, ...works, ...works];

  return (
    <section id="portfolio-marquee" className="bg-neutral-950 py-20 overflow-hidden relative">
      
      {/* Light edge masks */}
      <div className="absolute top-0 left-0 w-36 h-full bg-gradient-to-r from-neutral-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-36 h-full bg-gradient-to-l from-neutral-950 to-transparent z-20 pointer-events-none" />

      {/* Aesthetic introduction header */}
      <div className="text-center mb-12 space-y-3">
        <Badge variant="gold">
          <Sparkles className="w-3 h-3 mr-1 inline" /> Estética Activa
        </Badge>
        <h3 className="font-sans font-bold text-xl md:text-2xl text-white">
          Producciones recientes en rotación constante
        </h3>
      </div>

      {/* Infinite scrolling track container */}
      <div className="flex w-[200%] gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
        {continuousWorks.map((work, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-80 md:w-[420px] aspect-video rounded-2xl bg-neutral-900/60 border border-neutral-900 relative overflow-hidden group flex flex-col justify-end p-6 hover:border-neutral-800 transition-all duration-300"
          >
            {/* Dark aesthetic backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent z-10" />
            
            {/* Visual play mockup container overlay */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-950/80 backdrop-blur-sm border border-neutral-800/80 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 z-20">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>

            {/* Inner hover flash of gold light */}
            <div className="absolute inset-0 bg-[#C9A84C]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Visual Details */}
            <div className="relative z-20 space-y-1.5">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase">
                {work.category} • {work.length} MIN
              </span>
              <h4 className="text-sm md:text-base font-semibold text-white tracking-wide group-hover:text-neutral-200 transition-colors">
                {work.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
