import React, { useEffect } from 'react';
import { PORTFOLIO } from '../data';

const BackgroundPreloader: React.FC = () => {
  useEffect(() => {
    const preloadImage = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Use requestIdleCallback for non-critical preloading
    const idleCallback = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 3000);

    const handle = idleCallback(() => {
      PORTFOLIO.forEach((item) => {
        if (item.image) preloadImage(item.image);
        if (item.sketchImage) preloadImage(item.sketchImage);
      });
    });

    return () => {
      if (typeof cancelIdleCallback !== 'undefined' && typeof handle === 'number') {
        cancelIdleCallback(handle);
      }
    };
  }, []);

  return null;
};

export default React.memo(BackgroundPreloader);
