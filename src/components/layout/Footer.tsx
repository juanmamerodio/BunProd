import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Instagram, Linkedin, Globe, Sparkles } from 'lucide-react';

const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const directoryLinks = [
  { label: 'Servicios', id: 'services' },
  { label: 'Casos de Éxito', id: 'portfolio' },
  { label: 'Equipo', id: 'about' },
  { label: 'Aplicar', id: 'qualification' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Globe, href: '#', label: 'Website' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-brand-black border-t border-neutral-800/40 pt-20 pb-10 overflow-hidden">
      {/* Subtle gold radial */}
      <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[60%] h-[250px] rounded-full bg-brand-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800/30">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="font-display font-black text-2xl tracking-[0.15em] text-brand-cream group-hover:text-brand-gold-light transition-colors duration-300">
                MOÑO
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold-light" />
            </a>

            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
              No hacemos videos. Creamos activos visuales que posicionan tu marca
              en la cima de su categoría. Estética cinematográfica y conversión
              digital premium unificadas.
            </p>

            {/* Social */}
            <div className="flex gap-3 pt-1">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800/60 flex items-center justify-center text-neutral-500 hover:text-brand-gold-light hover:border-brand-gold/30 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Directory */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Directorio
            </h4>
            <ul className="space-y-3">
              {directoryLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(link.id);
                    }}
                    className="text-sm text-neutral-500 hover:text-brand-gold-light transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold-light/60 flex-shrink-0" />
                <a
                  href="mailto:hola@monoproducciones.com"
                  className="text-sm text-neutral-500 hover:text-brand-gold-light transition-colors duration-300"
                >
                  hola@monoproducciones.com
                </a>
              </li>
              <li className="text-xs text-neutral-600 leading-relaxed pl-7">
                Buenos Aires, Argentina · Filmando y produciendo para marcas de
                todo el mundo de forma remota y presencial.
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600 text-center sm:text-left">
            Moño Producciones © {new Date().getFullYear()}.{' '}
            <span className="text-neutral-500">
              Construimos el contenido de tu mes.
            </span>
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-brand-gold-light transition-colors duration-300 cursor-pointer group"
          >
            <span>Volver Arriba</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};
