'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { MOBILE_MEDIA_QUERY } from '@/lib/device';

type Props = {
  desktop: ReactNode;
  mobile: ReactNode;
};

export default function DeviceGate({ desktop, mobile }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (isMobile === null) {
    return <div className="dg-boot" aria-hidden="true" />;
  }
  return <>{isMobile ? mobile : desktop}</>;
}
