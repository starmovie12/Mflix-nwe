import type { Metadata } from "next";

import { AccountPageView } from "@/features/account/account-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Account",
  description: `Manage preferences and profile settings on ${APP_NAME}.`,
};

export default function AccountPage() {
  return (
    <main className="app-shell">
      <AccountPageView />
    </main>
  );
}
