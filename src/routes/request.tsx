import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { RequestPage } from "@/components/casino/request";
import { casinoHead } from "@/lib/casino-seo";
const searchSchema = z.object({
  interest: z.string().optional().catch(undefined),
  type: z.string().optional().catch(undefined),
  country: z.enum(["0", "1", "2", "3", "4"]).optional().catch(undefined),
  start: z.string().optional().catch(undefined),
  party: z.string().optional().catch(undefined),
});
export const Route = createFileRoute("/request")({
  validateSearch: searchSchema,
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
