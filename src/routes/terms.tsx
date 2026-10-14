import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/terms")({
  head: () =>
    casinoHead(
      "Terms of use — legal draft",
      "Draft terms for legal review, adult-only restrictions and responsible gambling information.",
    ),
  component: Page,
});
function Page() {
  return <Legal kind="terms" />;
}