import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/privacy")({
  head: () =>
    casinoHead(
      "Privacy notice — legal draft",
      "Privacy notice placeholder for legal review. Learn how this prototype handles sample data.",
    ),
  component: Page,
});
function Page() {
  return <Legal kind="privacy" />;
}
