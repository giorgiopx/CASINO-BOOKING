import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CasinoProvider } from "@/components/casino/context";
import { CustomerProfileEditor } from "@/components/casino/profile-editor";
import { saveCustomerProfile, type Profile } from "@/lib/enquiry-db";

vi.mock("@/components/casino/auth", () => ({
  useAuth: () => ({
    session: { user: { id: "customer-test", email: "test@example.invalid" } },
    isAdmin: false,
  }),
}));
vi.mock("@/lib/enquiry-db", () => ({ saveCustomerProfile: vi.fn() }));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const profile: Profile = {
  id: "customer-test",
  customer_ref: "CB-TEST-0001",
  first_name: "Test",
  last_name: "Customer",
  full_name: "Test Customer",
  email: "test@example.invalid",
  phone: "+30 6900000000",
  residence: "GR",
  customer_type: "individual",
  company_name: null,
  services: ["casino"],
  created_at: "2026-10-18T00:00:00Z",
};
function showCard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CasinoProvider>
        <CustomerProfileEditor profile={profile} />
      </CasinoProvider>
    </QueryClientProvider>,
  );
}

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe("customer card", () => {
  it("keeps the customer ID immutable and account email read-only, and offers all six services", () => {
    showCard();
    expect(screen.getByText("CB-TEST-0001")).toBeVisible();
    expect(screen.queryByDisplayValue("CB-TEST-0001")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.invalid")).toHaveAttribute(
      "readonly",
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(6);
    expect(
      screen
        .getByRole("combobox", { name: /Country of residence/ })
        .querySelectorAll("option"),
    ).toHaveLength(250);
  });

  it("requires a company name before saving a company card", async () => {
    showCard();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Customer category" }),
      { target: { value: "business" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Save my profile" }));
    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: /Company name/ }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(saveCustomerProfile).not.toHaveBeenCalled();
  });

  it("retains edited fields when saving fails and allows a retry", async () => {
    vi.mocked(saveCustomerProfile)
      .mockRejectedValueOnce(new Error("Forbidden"))
      .mockResolvedValueOnce({ ...profile, first_name: "Updated" });
    showCard();
    fireEvent.change(screen.getByRole("textbox", { name: /First name/ }), {
      target: { value: "Updated" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save my profile" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be saved",
    );
    expect(screen.getByRole("textbox", { name: /First name/ })).toHaveValue(
      "Updated",
    );
    fireEvent.click(screen.getByRole("button", { name: "Save my profile" }));
    await waitFor(() => expect(saveCustomerProfile).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
    expect(saveCustomerProfile).toHaveBeenLastCalledWith(
      "customer-test",
      expect.objectContaining({ firstName: "Updated", services: ["casino"] }),
    );
  });

  it("sends selected services and company details through the validated save helper", async () => {
    vi.mocked(saveCustomerProfile).mockResolvedValue(profile);
    showCard();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Customer category" }),
      { target: { value: "business" } },
    );
    fireEvent.change(screen.getByRole("textbox", { name: /Company name/ }), {
      target: { value: "Example Travel" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Hotels" }));
    fireEvent.click(screen.getByRole("button", { name: "Save my profile" }));
    await waitFor(() =>
      expect(saveCustomerProfile).toHaveBeenCalledWith(
        "customer-test",
        expect.objectContaining({
          customerType: "business",
          companyName: "Example Travel",
          services: ["casino", "hotel"],
        }),
      ),
    );
  });
});
