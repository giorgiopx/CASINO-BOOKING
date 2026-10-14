import { createFileRoute } from "@tanstack/react-router";
import { VisualHome as Home } from "@/components/casino/visual-home";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/")({
  head: () =>
    casinoHead(
      "European Casino Destinations | CasinoBooking.com",
      "Explore European casino destinations and request free assistance with flights, hotels and transfers. English and Greek. Travel enquiries only.",
    ),
  component: Page,
});
function Page() {
  return <Home />;
}