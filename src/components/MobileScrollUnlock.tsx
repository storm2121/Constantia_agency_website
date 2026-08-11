'use client';

import { useEffect } from 'react';
import { MOBILE_MEDIA_QUERY } from '@/lib/device';

export default function MobileScrollUnlock() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const apply = () => {
      if (mq.matches) {
        document.documentElement.classList.remove('scroll-locked');
        document.documentElement.dataset.device = 'mobile';
      } else {
        document.documentElement.dataset.device = 'desktop';
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return null;
}
