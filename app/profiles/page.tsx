import type { Metadata } from "next";

import { ProfilesPageView } from "@/features/profiles/profiles-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Profiles | ${APP_NAME}`,
  description: "Select and manage multiple local profiles on MFLIX.",
};

export default function ProfilesPage() {
  return <ProfilesPageView />;
}
