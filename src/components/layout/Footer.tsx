import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Globe, Sparkles } from 'lucide-react';

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
  { icon: Globe, href: '#', label: 'Website' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-brand-black border-t border-brand-border/30 pt-20 pb-10 overflow-hidden">
      {/* Subtle gold radial */}
      <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[60%] h-[250px] rounded-full bg-brand-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* ── Top grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-border/25"
        >
          {/* Brand column */}
          <div className="md:col-span-5 space-y-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <span className="font-display font-black text-2xl tracking-[0.12em] text-brand-cream group-hover:text-brand-gold transition-colors duration-500">
                AFTERBOW
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold opacity-70" />
            </a>

            <p className="text-sm text-brand-muted max-w-sm leading-relaxed">
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
                    className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border/60 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 hover:shadow-gold-glow transition-all duration-500"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Directory */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
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
                    className="text-sm text-brand-muted/80 hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold/60 flex-shrink-0" />
                <a
                  href="mailto:hola@afterbow.com"
                  className="text-sm text-brand-muted/80 hover:text-brand-gold transition-colors duration-300"
                >
                  hola@afterbow.com
                </a>
              </li>
              <li className="text-xs text-brand-muted/50 leading-relaxed pl-7">
                Buenos Aires, Argentina · Filmando y produciendo para marcas de
                todo el mundo de forma remota y presencial.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-muted/50 text-center sm:text-left">
            Afterbow © {new Date().getFullYear()}.{' '}
            <span className="text-brand-muted/70">
              Construimos el contenido de tu mes.
            </span>
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs font-medium text-brand-muted/60 hover:text-brand-gold transition-colors duration-500 cursor-pointer group"
          >
            <span>Volver Arriba</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform duration-500 ease-cinematic" />
          </button>
        </div>
      </div>
    </footer>
  );
};
