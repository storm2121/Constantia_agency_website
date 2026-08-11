'use client';

import { useEffect, useState } from 'react';
import { MOBILE_MEDIA_QUERY } from '@/lib/device';

export function useIsMobile(initial = false): boolean {
  const [isMobile, setIsMobile] = useState(initial);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}
