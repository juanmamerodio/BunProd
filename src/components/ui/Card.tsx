import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  const Component = hoverEffect ? motion.div : 'div';

  const motionProps = hoverEffect
    ? {
        whileHover: { 
          y: -6,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        },
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {};

  return (
    // @ts-ignore
    <Component
      onClick={onClick}
      className={`bg-neutral-950/80 backdrop-blur-md border border-neutral-800/50 p-6 md:p-8 rounded-2xl relative overflow-hidden group transition-colors duration-500 hover:border-neutral-700/60 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      {...motionProps}
    >
      <div className="relative z-10">{children}</div>
    </Component>
  );
};
