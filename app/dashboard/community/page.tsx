import { SectionHub } from "@/components/dashboard/section-hub";
import { DASHBOARD_SECTIONS } from "@/lib/dashboard/navigation";

const section = DASHBOARD_SECTIONS.find((s) => s.id === "community")!;

export default function CommunityHubPage() {
  return <SectionHub section={section} />;
}
