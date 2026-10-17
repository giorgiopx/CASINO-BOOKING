import { createFileRoute } from "@tanstack/react-router";
import { VisualHome as Home } from "@/components/casino/visual-home";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/")({
  head: () =>
    casinoHead(
      "Casino Destinations & Free Travel Concierge",
      "Explore 15 casino destinations and request free assistance with hotels, flights, transfers, cruises and travel packages. English and Greek. Travel enquiries only.",
    ),
  component: Page,
});
function Page() {
  return <Home />;
}
