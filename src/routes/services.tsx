import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/services")({
  head: () =>
    casinoHead(
      "Travel services",
      "Explore independent referral coordination, flight assistance, airport transfers and group travel enquiries.",
    ),
  component: Page,
});
function Page() {
  return <Services />;
}