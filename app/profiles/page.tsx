import type { Metadata } from "next";

import { ProfilesPageView } from "@/features/profiles/profiles-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Profiles | ${APP_NAME}`,
  description: "Select or manage your MFLIX profile.",
};

export default function ProfilesPage() {
  return (
    <main className="app-shell">
      <ProfilesPageView />
    </main>
  );
}
