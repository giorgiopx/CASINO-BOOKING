import { createFileRoute } from "@tanstack/react-router";
import { requestSearchSchema } from "@/lib/casino-request-schema";
import { RequestPage } from "@/components/casino/request";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/request")({
  validateSearch: requestSearchSchema,
  head: () =>
    casinoHead(
      "Plan your journey",
      "Submit a free casino travel enquiry and track its reference in your account. An enquiry is not a confirmed booking; email and WhatsApp notifications are not yet enabled.",
    ),
  component: Page,
});
function Page() {
  const defaults = Route.useSearch();
  return <RequestPage defaults={defaults} />;
}
