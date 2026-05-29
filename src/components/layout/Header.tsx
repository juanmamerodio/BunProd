import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const navLinks = [
  { label: 'Servicios', id: 'services' },
  { label: 'Casos de Éxito', id: 'portfolio' },
  { label: 'Nosotros', id: 'about' },
];

const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-cinematic ${
        isScrolled
          ? 'bg-brand-black/70 backdrop-blur-2xl border-b border-brand-gold/[0.06] py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* ── Logo ── */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group relative z-50"
        >
          <span className="font-display font-black text-xl md:text-2xl tracking-[0.12em] text-brand-cream group-hover:text-brand-gold transition-colors duration-500">
            AFTERBUN
          </span>
          <motion.span
            animate={{ rotate: [0, 8, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.span>
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo(link.id);
              }}
              className="relative text-[13px] font-medium text-brand-muted hover:text-brand-cream transition-colors duration-300 tracking-wide group py-1"
            >
              {link.label}
              {/* Animated underline on hover */}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold/50 group-hover:w-full transition-all duration-500 ease-cinematic" />
            </a>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:block">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => smoothScrollTo('qualification')}
          >
            Aplicar
          </Button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-brand-cream hover:text-brand-gold transition-colors relative z-50 cursor-pointer"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  smoothScrollTo(link.id);
                }}
                className="text-2xl font-display font-bold text-brand-cream hover:text-brand-gold transition-colors tracking-wide"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setMobileOpen(false);
                  smoothScrollTo('qualification');
                }}
              >
                Aplicar Plan Premium
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
