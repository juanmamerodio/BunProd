import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id "${id}" not found.`);
    }
  }, []);

  return scrollToId;
};
