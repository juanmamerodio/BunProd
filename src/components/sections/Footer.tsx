import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-black border-t border-brand-border/30 pt-20 pb-12 relative overflow-hidden">
      
      {/* Background radial soft gold spot */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[50%] h-[300px] rounded-full bg-brand-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-border/25"
        >
          
          {/* Brand & Closing Signature */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-2xl tracking-[0.12em] text-brand-cream">
                AFTERBUN
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold opacity-70" />
            </div>
            
            <p className="text-sm text-brand-muted max-w-sm leading-relaxed">
              No hacemos videos, creamos activos visuales que posicionan tu marca en la cima de su categoría. Estética cinematográfica y conversión digital premium unificadas.
            </p>

            {/* Social handles */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: <Globe className="w-4 h-4" />, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border/60 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 hover:shadow-gold-glow transition-all duration-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links Directory */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
              Directorio
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted/80">
              {[
                { label: 'Servicios', id: 'services' },
                { label: 'Casos de Éxito', id: 'portfolio' },
                { label: 'Equipo', id: 'about' },
                { label: 'Aplicar', id: 'qualification' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(link.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
              Contacto Premium
            </h4>
            <ul className="space-y-3 text-sm text-brand-muted/80">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold/60" />
                <a href="mailto:hola@afterbun.com" className="hover:text-brand-gold transition-colors duration-300">
                  hola@afterbun.com
                </a>
              </li>
              <li className="text-xs text-brand-muted/50 leading-relaxed">
                Buenos Aires, Argentina • Filmando y produciendo para marcas de todo el mundo de forma remota y presencial.
              </li>
            </ul>
          </div>

        </motion.div>

        {/* Footer bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-muted/50">
            © {new Date().getFullYear()} Afterbun. Todos los derechos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-brand-gold/60 hover:text-brand-gold transition-colors duration-500 cursor-pointer group"
          >
            <span>Volver Arriba</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-500 ease-cinematic" />
          </button>
        </div>

      </div>
    </footer>
  );
};
