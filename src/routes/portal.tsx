import { createFileRoute } from "@tanstack/react-router";
import { Portal } from "@/components/casino/portal";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/portal")({
  head: () =>
    casinoHead(
      "Concierge demo portal",
      "Clearly labeled fictional CRM and customer portal with demo enquiries, status controls and reports.",
    ),
  component: Page,
});
function Page() {
  return <Portal />;
}