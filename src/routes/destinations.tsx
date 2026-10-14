import { createFileRoute } from "@tanstack/react-router";
import { Destinations } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/destinations")({
  head: () =>
    casinoHead(
      "Destinations",
      "Discover initial travel destinations in Cyprus, Greece, Slovenia and Bulgaria with transparent legal and partnership notices.",
    ),
  component: Page,
});
function Page() {
  return <Destinations />;
}