import { AdminLandingPanel } from "@/components/admin/admin-landing-panel";
import { listLandingFeaturedProfiles, listLandingTestimonialsAdmin } from "@/lib/data/landing";

export default async function AdminLandingPage() {
  const [featured, testimonials] = await Promise.all([
    listLandingFeaturedProfiles(),
    listLandingTestimonialsAdmin(),
  ]);

  return (
    <AdminLandingPanel
      featured={featured as Parameters<typeof AdminLandingPanel>[0]["featured"]}
      testimonials={testimonials}
    />
  );
}
