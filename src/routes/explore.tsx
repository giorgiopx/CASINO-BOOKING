import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Explore } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/explore")({
  validateSearch: z.object({
    country: z.enum(["0", "1", "2", "3", "4"]).optional().catch(undefined),
  }),
  head: () =>
    casinoHead(
      "Explore casino resorts",
      "Initial casino-resort directory candidates with official links and unconfirmed partnership labels. Verify local law before travel.",
    ),
  component: Page,
});
function Page() {
  const { country } = Route.useSearch();
  return <Explore key={country} initialCountry={country ?? "0"} />;
}