import { createFileRoute } from "@tanstack/react-router";
import { HowItWorks } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/how-it-works")({
  head: () =>
    casinoHead(
      "How it works",
      "Understand the CasinoBooking.com demo enquiry process and external provider booking model.",
    ),
  component: Page,
});
function Page() {
  return <HowItWorks />;
}