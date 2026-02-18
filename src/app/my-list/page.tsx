import type { Metadata } from "next";
import { MyListClient } from "@/features/my-list/my-list-client";

export const metadata: Metadata = {
  title: "My List",
  description: "Your saved movies and TV shows on MFLIX.",
};

export default function MyListPage() {
  return <MyListClient />;
}
