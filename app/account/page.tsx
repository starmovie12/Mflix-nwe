import type { Metadata } from "next";

import { AccountPageView } from "@/features/account/account-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Account | ${APP_NAME}`,
  description: "Manage profile preferences, playback settings, and accessibility options.",
};

export default function AccountPage() {
  return <AccountPageView />;
}
