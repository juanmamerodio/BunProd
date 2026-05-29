import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AuroraBackgroundProps {
  intensity?: number;
  speed?: number;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  intensity = 1,
  speed = 1,
}) => {
  // We use CSS animations for the orbs to avoid unnecessary React re-renders
  // Each orb has unique timing for organic movement

  const orbConfigs = [
    {
      color: 'rgba(232, 209, 167, 0.04)', // Gold
      size: '55vw',
      top: '-15%',
      left: '-10%',
      duration: 25 / speed,
      delay: 0,
    },
    {
      color: 'rgba(132, 89, 43, 0.035)', // Bronze
      size: '45vw',
      bottom: '-10%',
      right: '-10%',
      duration: 30 / speed,
      delay: 5,
    },
    {
      color: 'rgba(157, 145, 103, 0.025)', // Oliva
      size: '35vw',
      top: '40%',
      left: '30%',
      duration: 35 / speed,
      delay: 10,
    },
    {
      color: 'rgba(232, 209, 167, 0.02)', // Gold faint
      size: '50vw',
      top: '60%',
      right: '-20%',
      duration: 28 / speed,
      delay: 15,
    },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep radial base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(18, 15, 13, 0.5) 0%, rgba(5, 3, 2, 1) 70%)',
        }}
      />

      {/* Animated aurora orbs */}
      {orbConfigs.map((orb, idx) => (
        <motion.div
          key={idx}
          className="aurora-orb"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            bottom: orb.bottom,
            right: orb.right,
            opacity: intensity,
          }}
          animate={{
            x: [0, 60 * (idx % 2 === 0 ? 1 : -1), -40 * (idx % 2 === 0 ? 1 : -1), 0],
            y: [0, -50 * (idx % 2 === 0 ? -1 : 1), 30 * (idx % 2 === 0 ? -1 : 1), 0],
            scale: [1, 1.08 + idx * 0.02, 0.94 - idx * 0.01, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Film grain noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-noise"
      />
    </div>
  );
};
