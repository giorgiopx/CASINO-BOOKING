import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminEnquiryDetails } from "@/components/casino/admin-details";
import { CasinoProvider } from "@/components/casino/context";
import type { Enquiry } from "@/lib/enquiry-db";

const { saveRecord } = vi.hoisted(() => ({ saveRecord: vi.fn() }));
vi.mock("@/components/casino/auth", () => ({
  useAuth: () => ({ session: { user: { id: "admin-test" } }, isAdmin: true }),
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        order: () => Promise.resolve({ data: [], error: null }),
        insert: () => query,
        single: saveRecord,
      };
      return query;
    },
  },
}));

const enquiry = {
  id: "request-test",
  ref: "CB-TEST",
  name: "Synthetic",
  surname: "Customer",
  customer_type: "individual",
  destination: "Monaco",
  services: ["casino"],
  trip_preferences: {},
} as Enquiry;

function showDetails() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <CasinoProvider>
        <AdminEnquiryDetails enquiry={enquiry} customerRef="CUS-TEST" />
      </CasinoProvider>
    </QueryClientProvider>,
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Internal customer note" }),
    {
      target: { value: "Synthetic follow-up" },
    },
  );
  return client;
}

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe("CRM mutation feedback", () => {
  it("does not show success or clear a draft when no row was saved", async () => {
    saveRecord.mockResolvedValue({ data: null, error: null });
    showDetails();
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalled();
    expect(
      screen.getByRole("textbox", { name: "Internal customer note" }),
    ).toHaveValue("Synthetic follow-up");
  });

  it("reports a saved record separately when refreshing fails", async () => {
    saveRecord.mockResolvedValue({ data: { id: "saved-note" }, error: null });
    const client = showDetails();
    vi.spyOn(client, "invalidateQueries").mockRejectedValue(
      new Error("Offline"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining("Saved to CRM, but"),
      ),
    );
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(
      screen.getByRole("textbox", { name: "Internal customer note" }),
    ).toHaveValue("");
    expect(saveRecord).toHaveBeenCalledTimes(1);
  });

  it("keeps saving disabled until the saved record has been refreshed", async () => {
    saveRecord.mockResolvedValue({ data: { id: "saved-note" }, error: null });
    const client = showDetails();
    let finishRefresh!: () => void;
    vi.spyOn(client, "invalidateQueries").mockReturnValue(
      new Promise<void>((resolve) => {
        finishRefresh = resolve;
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    await waitFor(() => expect(client.invalidateQueries).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Save note" })).toBeDisabled();
    expect(toast.success).not.toHaveBeenCalled();
    finishRefresh();
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Saved to CRM"),
    );
  });
});
