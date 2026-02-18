import type { Metadata } from "next";
import { AccountClient } from "@/features/account/account-client";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your MFLIX account settings and preferences.",
};

export default function AccountPage() {
  return <AccountClient />;
}
