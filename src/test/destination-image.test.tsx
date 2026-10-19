import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DestinationImage } from "@/components/casino/destination-image";

vi.mock("@/components/casino/context", () => ({
  useCasino: () => ({ t: (english: string) => english }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("reveals an image already decoded before React attaches its load handler", () => {
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
    1280,
  );

  render(<DestinationImage src="/cached-photo.jpg" alt="Destination view" />);

  // No load event is dispatched: hydration must recognize the decoded image.
  expect(screen.getByRole("img", { name: "Destination view" })).toHaveStyle({
    opacity: "1",
  });
  expect(screen.queryByText("Loading image")).not.toBeInTheDocument();
});

it("shows a visible failure when the image failed before hydration", () => {
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
    0,
  );

  render(<DestinationImage src="/failed-photo.jpg" alt="Destination view" />);

  expect(screen.getByText("Image unavailable")).toBeVisible();
  expect(screen.queryByText("Loading image")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("img", { name: "Destination view" }),
  ).not.toBeInTheDocument();
});
