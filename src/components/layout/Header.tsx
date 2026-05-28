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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-brand-black/80 backdrop-blur-xl border-b border-neutral-800/40 py-4'
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
          className="flex items-center gap-2 cursor-pointer group relative z-50"
        >
          <span className="font-display font-black text-xl md:text-2xl tracking-[0.15em] text-brand-cream group-hover:text-brand-gold-light transition-colors duration-300">
            MOÑO
          </span>
          <Sparkles className="w-4 h-4 text-brand-gold-light group-hover:rotate-12 transition-transform duration-300" />
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
              className="text-[13px] font-medium text-neutral-400 hover:text-brand-cream transition-colors duration-300 tracking-wide"
            >
              {link.label}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  smoothScrollTo(link.id);
                }}
                className="text-2xl font-display font-bold text-brand-cream hover:text-brand-gold-light transition-colors tracking-wide"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
