import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/")({
  head: () =>
    casinoHead(
      "Considered casino resort travel",
      "Independent casino-resort discovery and personal travel coordination in Greek and English. Adults only. No live bookings or confirmed partnerships.",
    ),
  component: Page,
});
function Page() {
  return <Home />;
}