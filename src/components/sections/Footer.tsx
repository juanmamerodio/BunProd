import React from 'react';
import { ArrowUp, Mail, Instagram, Linkedin, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-black border-t border-brand-border/60 pt-20 pb-12 relative overflow-hidden">
      
      {/* Background radial soft gold spot */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[50%] h-[300px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-border/40">
          
          {/* Brand & Closing Signature */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-widest text-brand-cream">
                MOÑO
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold-light" />
            </div>
            
            <p className="text-sm text-brand-muted max-w-sm leading-relaxed">
              No hacemos videos, creamos activos visuales que posicionan tu marca en la cima de su categoría. Estética cinematográfica y conversión digital premium unificadas.
            </p>

            {/* Social handles */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                { icon: <Globe className="w-4 h-4" />, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-gold-light hover:border-brand-gold/40 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links Directory */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-brand-cream uppercase tracking-widest">
              Directorio
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted">
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
                    className="hover:text-brand-gold-light transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-brand-cream uppercase tracking-widest">
              Contacto Premium
            </h4>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold-light" />
                <a href="mailto:hola@monoproducciones.com" className="hover:text-brand-gold-light transition-colors duration-300">
                  hola@monoproducciones.com
                </a>
              </li>
              <li className="text-xs text-brand-muted/80 leading-relaxed">
                Buenos Aires, Argentina • Filmando y produciendo para marcas de todo el mundo de forma remota y presencial.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} Moño Producciones. Todos los derechos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-brand-gold-light hover:text-brand-gold transition-colors duration-300 cursor-pointer group"
          >
            <span>Volver Arriba</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
