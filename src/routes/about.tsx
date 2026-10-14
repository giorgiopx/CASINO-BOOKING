import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
export const Route = createFileRoute("/about")({
  head: () =>
    casinoHead(
      "Our approach & mobile roadmap",
      "Independent travel coordination, prototype limitations, photography credits and the mobile app roadmap.",
    ),
  component: Page,
});
function Page() {
  return <About />;
}