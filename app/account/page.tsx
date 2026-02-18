import type { Metadata } from "next";

import { AccountPageView } from "@/features/account/account-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Account & Settings | ${APP_NAME}`,
  description: "Manage your MFLIX account preferences, language, and playback settings.",
};

export default function AccountPage() {
  return (
    <main className="app-shell">
      <AccountPageView />
    </main>
  );
}
