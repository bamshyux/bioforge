import { SectionHub } from "@/components/dashboard/section-hub";
import { DASHBOARD_SECTIONS } from "@/lib/dashboard/navigation";

const section = DASHBOARD_SECTIONS.find((s) => s.id === "appearance")!;

export default function AppearanceHubPage() {
  return <SectionHub section={section} />;
}
