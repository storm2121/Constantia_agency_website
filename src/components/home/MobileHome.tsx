'use client';

import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileNavbar from '@/components/mobile/MobileNavbar';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import MobileHero from '@/components/mobile/MobileHero';
import MobileVision from '@/components/mobile/MobileVision';
import MobileServices from '@/components/mobile/MobileServices';
import MobileTeam from '@/components/mobile/MobileTeam';
import MobileStats from '@/components/mobile/MobileStats';
import MobileCTA from '@/components/mobile/MobileCTA';
import MobileFooter from '@/components/mobile/MobileFooter';
import type { Talent } from '@/lib/types';
import type { ServicePortfolioSlug } from '@/lib/service-portfolios';

type SliderServiceMedia =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string; poster: string };

type Props = {
  talents: Talent[];
  serviceMediaOverrides: Partial<Record<ServicePortfolioSlug, SliderServiceMedia>>;
  heroImage?: string;
  heroLabel?: string;
};

export default function MobileHome({ talents, serviceMediaOverrides, heroImage, heroLabel }: Props) {
  const videoOverride =
    serviceMediaOverrides.video?.kind === 'video'
      ? {
          video: {
            src: serviceMediaOverrides.video.src,
            poster: serviceMediaOverrides.video.poster,
          },
        }
      : undefined;

  return (
    <main className="m-root">
      <MobileScrollReset />
      <MobileAmbient />
      <MobileNavbar />
      <MobileHero heroImage={heroImage} heroLabel={heroLabel} />
      <MobileVision />
      <MobileServices videoOverrides={videoOverride} />
      <MobileTeam talents={talents} />
      <MobileStats />
      <MobileCTA />
      <MobileFooter />

      <style jsx>{`
        .m-root {
          position: relative;
          isolation: isolate;
        }
      `}</style>
    </main>
  );
}
