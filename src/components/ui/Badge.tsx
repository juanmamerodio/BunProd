import React from 'react';

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
    gold: 'bg-neutral-950/60 text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_0_10px_rgba(201,168,76,0.05)]',
    neutral: 'bg-neutral-900/50 text-neutral-300 border border-neutral-800',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
