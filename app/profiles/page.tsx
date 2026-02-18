import type { Metadata } from "next";

import { ProfilesPageView } from "@/features/profiles/profiles-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Profiles",
  description: `Switch and manage viewer profiles on ${APP_NAME}.`,
};

export default function ProfilesPage() {
  return (
    <main className="app-shell">
      <ProfilesPageView />
    </main>
  );
}
