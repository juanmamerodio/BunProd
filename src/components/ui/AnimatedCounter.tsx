import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayVal, setDisplayVal] = useState(0);
  const [hasReached, setHasReached] = useState(false);
  
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 70,
    restDelta: 0.01,
  });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      const rounded = Math.round(latest);
      setDisplayVal(rounded);
      if (rounded >= value && !hasReached) {
        setHasReached(true);
      }
    });
    return () => unsubscribe();
  }, [springVal, value, hasReached]);

  return (
    <div ref={ref} className="font-display font-extrabold text-5xl md:text-6xl text-brand-cream tracking-tight">
      <span className={`transition-all duration-700 ${hasReached ? 'drop-shadow-[0_0_20px_rgba(232,209,167,0.3)]' : ''}`}>
        {displayVal}
      </span>
      <span className="text-brand-gold ml-0.5">{suffix}</span>
    </div>
  );
};
