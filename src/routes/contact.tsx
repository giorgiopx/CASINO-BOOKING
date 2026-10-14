import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/casino/request";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/contact")({
  head: () =>
    casinoHead(
      "Contact & enquiries",
      "Start a sample travel enquiry. Verified production contact channels are not yet configured.",
    ),
  component: Page,
});
function Page() {
  return <Contact />;
}