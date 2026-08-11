import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HomeServicesRestore from "@/components/HomeServicesRestore";
import Hero from "@/components/Hero";
import VideoWipe from "@/components/VideoWipe";
import VisionPanel from "@/components/VisionPanel";
import ServicesHoverSlider from "@/components/ServicesHoverSlider";
import TeamSection from "@/components/TeamSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import type { Project, Talent } from "@/lib/types";
import type { ServicePortfolioSlug } from "@/lib/service-portfolios";

type SliderServiceMedia =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster: string };

type Props = {
  talents: Talent[];
  projectsByTalent: Record<string, Project[]>;
  serviceMediaOverrides: Partial<Record<ServicePortfolioSlug, SliderServiceMedia>>;
};

export default function DesktopHome({
  talents,
  projectsByTalent,
  serviceMediaOverrides,
}: Props) {
  return (
    <main className="relative flex w-full flex-col bg-black">
      <Navbar />
      <LoadingScreen />
      <HomeServicesRestore />

      {/* Layer 0: Background */}
      <div className="relative z-0">
        <Hero />
      </div>

      {/* Layer 1: Pinned Video Scrub */}
      <div className="relative z-10">
        <VideoWipe />
      </div>

      {/* Layer 2: Foreground Scroll (Overlaps Layer 1) */}
      <div className="relative z-20">
        <VisionPanel />
        <ServicesHoverSlider mediaOverrides={serviceMediaOverrides} />
        <TeamSection members={talents} projectsByTalent={projectsByTalent} />

        <StatsSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
