import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate motion values for 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end inertia and damping
  const tiltSpringConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), tiltSpringConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), tiltSpringConfig);

  // Motion Values for dynamic spotlight tracking — reactive via useMotionTemplate
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useSpring(useMotionValue(0), { damping: 20, stiffness: 150 });

  // Reactive glow gradient that follows the cursor
  const spotlightGradient = useMotionTemplate`radial-gradient(200px circle at ${glowX}px ${glowY}px, rgba(232, 209, 167, 0.07), transparent 100%)`;

  // Shimmer border highlight that follows cursor along the edge
  const borderGlow = useMotionTemplate`radial-gradient(300px circle at ${glowX}px ${glowY}px, rgba(232, 209, 167, 0.15), rgba(157, 145, 103, 0.05) 50%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalised mouse coordinates between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    // Track cursor absolute coordinates inside card for spotlight
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glowOpacity.set(0);
  };

  // Base luxury iOS 26.1 spatial style classes
  const baseCardStyles = `bg-gradient-to-b from-brand-card/60 to-brand-dark/80 backdrop-blur-2xl border border-white/[0.04] p-6 md:p-8 rounded-2xl relative overflow-hidden group select-none transition-colors duration-700 hover:border-brand-gold-dark/25 shadow-card ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  if (!hoverEffect) {
    return (
      <div 
        ref={cardRef} 
        onClick={onClick} 
        className={baseCardStyles}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="perspective-1200">
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ 
          scale: 1.015,
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.7), 0 0 20px rgba(232, 209, 167, 0.03)',
        }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={baseCardStyles}
      >
        {/* Spotlight tracking reflection — reactive */}
        <motion.span 
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-0 rounded-2xl"
          style={{
            background: spotlightGradient,
            opacity: glowOpacity,
          }}
        />

        {/* Shimmer border glow — follows cursor along edges */}
        <motion.span 
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-[1] rounded-2xl"
          style={{
            background: borderGlow,
            opacity: glowOpacity,
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />

        {/* Sub-pixel illuminated dynamic borders overlay */}
        <span className="absolute inset-0 border border-white/[0.03] group-hover:border-brand-gold-dark/15 rounded-2xl transition-colors duration-500 pointer-events-none z-10" />

        {/* Volumetric shadow layer inside the card for 3D depth */}
        <div 
          style={{ transform: 'translateZ(25px)' }}
          className="relative z-20 transition-transform duration-500"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
