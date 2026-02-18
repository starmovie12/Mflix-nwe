import type { Metadata } from "next";
import { ProfilesClient } from "@/features/profiles/profiles-client";

export const metadata: Metadata = {
  title: "Who's Watching?",
  description: "Select your MFLIX profile.",
};

export default function ProfilesPage() {
  return <ProfilesClient />;
}
