import type { Metadata } from "next";
import AnnouncementsAdmin from "./AnnouncementsAdmin";

export const metadata: Metadata = {
  title: "Announcements Admin — Spotter Tools Pro",
  // Unlisted internal tool: keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function AnnouncementsAdminPage() {
  return <AnnouncementsAdmin />;
}
