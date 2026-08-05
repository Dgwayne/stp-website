import type { Metadata } from "next";
import TelemetryDashboard from "./TelemetryDashboard";

export const metadata: Metadata = {
  title: "Telemetry — Spotter Tools Pro",
  // Unlisted internal tool: keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function TelemetryAdminPage() {
  return <TelemetryDashboard />;
}
