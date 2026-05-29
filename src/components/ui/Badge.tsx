import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full';

  const variantStyles = {
    gold: 'bg-brand-black/60 text-brand-gold border border-brand-gold/25 shadow-[0_0_12px_rgba(232,209,167,0.06)]',
    neutral: 'bg-brand-surface/50 text-brand-muted border border-brand-border/60',
  };

  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
};
