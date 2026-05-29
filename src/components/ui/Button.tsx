import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Motion Values for Magnetic UI Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Motion Values for Dynamic Spotlight Glow
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const springConfig = { damping: 12, stiffness: 120, mass: 0.5 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Magnetic translation calculation (relative to button center, max 12px range)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Smooth magnetic attraction factor (0.2)
    mouseX.set(distanceX * 0.22);
    mouseY.set(distanceY * 0.22);

    // Glow position calculation (relative to button left-top)
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    glowX.set(localX);
    glowY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-sans font-semibold transition-colors duration-500 rounded-xl focus:outline-none cursor-pointer tracking-wider uppercase overflow-hidden group select-none shadow-md';
  
  const sizeStyles = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-9 py-4.5 text-sm',
  };

  const variantStyles = {
    primary: 'bg-[#E8D1A7] text-[#442D1C] hover:bg-[#F3E5CB] border border-[#E8D1A7] shadow-[0_4px_20px_rgba(232,209,167,0.15)]',
    secondary: 'bg-transparent text-[#F5EFE6] border border-[#9D9167]/30 hover:border-[#E8D1A7] hover:shadow-[0_0_25px_rgba(232,209,167,0.08)]',
    ghost: 'bg-transparent text-[#9D9167] hover:text-[#E8D1A7] border border-transparent',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  // Dynamic glow style for hover reveal
  const glowStyle = {
    background: 'radial-gradient(45px circle at var(--x) var(--y), rgba(232, 209, 167, 0.15), transparent 100%)',
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{
        x: magneticX,
        y: magneticY,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Visual Spatial Glow Layer */}
      <span 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          // @ts-ignore
          '--x': `${glowX.get()}px`,
          // @ts-ignore
          '--y': `${glowY.get()}px`,
          ...glowStyle
        }}
      />

      {isLoading ? (
        <span className="flex items-center gap-2 relative z-10">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Procesando...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2.5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
          {children as React.ReactNode}
          {Icon && <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
        </span>
      )}
    </motion.button>
  );
};
