import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CasinoProvider } from "@/components/casino/context";
import { RequestPage } from "@/components/casino/request";

// Component behavior only: these synthetic adapters do not certify hosted Auth.
const db = vi.hoisted(() => ({
  insert: vi.fn(),
  saved: vi.fn(),
  profile: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) =>
      table === "enquiries"
        ? {
            insert: (value: unknown) => {
              db.insert(value);
              return { select: () => ({ single: db.saved }) };
            },
          }
        : { select: () => ({ eq: () => ({ maybeSingle: db.profile }) }) },
  },
}));
vi.mock("@/components/casino/auth", () => ({
  useAuth: () => ({
    session: { user: { id: "synthetic-customer" } },
    ready: true,
    available: true,
  }),
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/casino/public", () => ({
  Intro: () => <h1>Travel enquiry</h1>,
}));

function form() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidate = vi
    .spyOn(client, "invalidateQueries")
    .mockRejectedValue(new Error("Refresh unavailable"));
  const view = render(
    <QueryClientProvider client={client}>
      <CasinoProvider>
        <RequestPage
          defaults={{
            interest: "Monaco",
            start: "2099-06-10",
            end: "2099-06-15",
          }}
        />
      </CasinoProvider>
    </QueryClientProvider>,
  );
  const fill = (name: string, value: string) => {
    const element = view.container.querySelector(`[name="${name}"]`);
    if (!element) throw new Error(`Missing field ${name}`);
    fireEvent.change(element, { target: { value } });
  };
  for (const [name, value] of Object.entries({
    name: "Test",
    surname: "Guest",
    email: "test@example.invalid",
    phone: "+306990000000",
    residence: "Greece",
  }))
    fill(name, value);
  fireEvent.click(view.container.querySelector('[name="consent"]')!);
  const element = view.container.querySelector("form")!;
  return { fill, element, invalidate };
}
beforeEach(() => {
  vi.clearAllMocks();
  db.saved.mockResolvedValue({ data: { ref: "ENQ-SYNTHETIC" }, error: null });
  db.profile.mockRejectedValue(new Error("Profile lookup unavailable"));
});
afterEach(cleanup);

describe("enquiry save confirmation", () => {
  it("keeps confirmed success when later cache and profile refreshes fail", async () => {
    const { element } = form();
    fireEvent.submit(element);
    expect(await screen.findByText("ENQ-SYNTHETIC")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(db.insert).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent(
      "No email or WhatsApp message is sent",
    );
  });
  it("never claims success without a real returned enquiry reference", async () => {
    db.saved.mockResolvedValue({ data: { ref: "pending" }, error: null });
    const { element } = form();
    fireEvent.submit(element);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Check your dashboard before trying again",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Guest")).toBeVisible();
  });
  it("prevents duplicate submissions while persistence is pending", async () => {
    let resolveSave!: (value: unknown) => void;
    db.saved.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );
    const { element } = form();
    fireEvent.submit(element);
    fireEvent.submit(element);
    expect(db.insert).toHaveBeenCalledOnce();
    resolveSave({ data: { ref: "ENQ-SYNTHETIC" }, error: null });
    expect(await screen.findByText("ENQ-SYNTHETIC")).toBeVisible();
  });
  it("requires and persists the company name for business requests", async () => {
    const { element, fill } = form();
    fill("customerType", "business");
    fireEvent.submit(element);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter the company name",
    );
    expect(db.insert).not.toHaveBeenCalled();
    fill("companyName", "  Example Travel Ltd  ");
    fireEvent.submit(element);
    await waitFor(() =>
      expect(db.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "synthetic-customer",
          customer_type: "business",
          company_name: "Example Travel Ltd",
          services: ["casino"],
        }),
      ),
    );
    expect(await screen.findByText("ENQ-SYNTHETIC")).toBeVisible();
  });
});
