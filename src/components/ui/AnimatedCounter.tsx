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
      setDisplayVal(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springVal]);

  return (
    <div ref={ref} className="font-display font-extrabold text-5xl md:text-6xl text-white tracking-tight">
      <span>{displayVal}</span>
      <span className="text-[#C9A84C] ml-0.5">{suffix}</span>
    </div>
  );
};
