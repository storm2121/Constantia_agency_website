import DesktopHome from "@/components/home/DesktopHome";
import MobileHome from "@/components/home/MobileHome";
import DeviceGate from "@/components/DeviceGate";
import { getAllTalents, getTalentOverlayProjectMap } from "@/lib/content-repository";
import { getFirebaseStoragePublicUrl } from "@/lib/firebase-admin";

const MOBILE_HERO_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/constantia-agency.firebasestorage.app/o/perf_younes%2Fperf_2.jpg?alt=media&token=4c4edcd3-9c1c-43a1-a7e1-af23b40383a3";

export default async function Home() {
  const [talents, projectsByTalent] = await Promise.all([
    getAllTalents(),
    getTalentOverlayProjectMap(),
  ]);

  const serviceMediaOverrides = {
    video: {
      kind: "video" as const,
      src: getFirebaseStoragePublicUrl(
        "portfolios/video/magical-gala-evening/service-loop/loop.mp4"
      ),
      poster: getFirebaseStoragePublicUrl(
        "portfolios/video/magical-gala-evening/service-loop/poster.webp"
      ),
    },
  };

  return (
    <DeviceGate
      desktop={
        <DesktopHome
          talents={talents}
          projectsByTalent={projectsByTalent}
          serviceMediaOverrides={serviceMediaOverrides}
        />
      }
      mobile={
        <MobileHome
          talents={talents}
          serviceMediaOverrides={serviceMediaOverrides}
          heroImage={MOBILE_HERO_IMAGE}
          heroLabel="Younes — Performance"
        />
      }
    />
  );
}
