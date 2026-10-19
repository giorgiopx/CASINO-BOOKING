import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  type InfiniteData,
} from "@tanstack/react-query";
import type { ComponentType } from "react";
import { Route } from "@/routes/_authenticated/admin";
import {
  fetchCustomerProfiles,
  fetchEnquiries,
  fetchMyEnquiries,
  type Enquiry,
} from "@/lib/enquiry-db";

const { calls, savedStatus } = vi.hoisted(() => ({
  calls: [] as unknown[][],
  savedStatus: vi.fn(),
}));
vi.mock("@/components/casino/auth", () => ({
  useAuth: () => ({
    session: { user: { id: "admin-test", email: "admin@example.test" } },
    isAdmin: true,
  }),
}));
vi.mock("@/components/casino/context", () => ({
  useCasino: () => ({
    t: (english: string) => english,
    p: (pair?: string[]) => pair?.[0] ?? "",
    lang: "en",
  }),
}));
vi.mock("@/components/casino/admin-details", () => ({
  AdminEnquiryDetails: () => null,
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      calls.push(["from", table]);
      const query = {
        select: () => query,
        update: () => query,
        eq: (...args: unknown[]) => {
          calls.push(["eq", ...args]);
          return query;
        },
        order: (...args: unknown[]) => {
          calls.push(["order", ...args]);
          return query;
        },
        range: (...args: unknown[]) => {
          calls.push(["range", ...args]);
          return Promise.resolve({ data: [], error: null });
        },
        single: savedStatus,
      };
      return query;
    },
  },
}));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  calls.length = 0;
});

describe("CRM pagination", () => {
  it("requests consecutive 100-record pages with stable ordering", async () => {
    await fetchEnquiries();
    await fetchEnquiries(1);
    await fetchCustomerProfiles(2);
    expect(calls.filter(([operation]) => operation === "range")).toEqual([
      ["range", 0, 99],
      ["range", 100, 199],
      ["range", 200, 299],
    ]);
    expect(calls.filter(([operation]) => operation === "order")).toEqual([
      ["order", "created_at", { ascending: false }],
      ["order", "id", { ascending: false }],
      ["order", "created_at", { ascending: false }],
      ["order", "id", { ascending: false }],
      ["order", "created_at", { ascending: false }],
      ["order", "id", { ascending: false }],
    ]);
  });

  it("filters customer ownership before requesting an older page", async () => {
    await fetchMyEnquiries("customer-a", 3);
    expect(calls).toEqual([
      ["from", "enquiries"],
      ["eq", "user_id", "customer-a"],
      ["order", "created_at", { ascending: false }],
      ["order", "id", { ascending: false }],
      ["range", 300, 399],
    ]);
  });

  it("updates a later cached page without changing another signed-in account's cache", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    const enquiry = {
      id: "request-a",
      ref: "CB-TEST",
      user_id: "customer-a",
      status: "new",
      services: [],
    } as unknown as Enquiry;
    const cached: InfiniteData<Enquiry[]> = {
      pages: [[], [enquiry]],
      pageParams: [0, 1],
    };
    const ownKey = ["enquiries", "admin", "admin-test"];
    const otherKey = ["enquiries", "mine", "customer-a"];
    client.setQueryData(ownKey, cached);
    client.setQueryData(otherKey, cached);
    client.setQueryData(["profiles", "admin", "admin-test"], {
      pages: [[]],
      pageParams: [0],
    });
    vi.spyOn(client, "invalidateQueries").mockResolvedValue();
    savedStatus.mockResolvedValue({
      data: { id: enquiry.id, status: "reviewing" },
      error: null,
    });
    const Admin = Route.options.component as ComponentType;
    render(
      <QueryClientProvider client={client}>
        <Admin />
      </QueryClientProvider>,
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Status for CB-TEST" }),
      { target: { value: "reviewing" } },
    );
    await waitFor(() =>
      expect(
        client.getQueryData<InfiniteData<Enquiry[]>>(ownKey)?.pages[1]?.[0]
          ?.status,
      ).toBe("reviewing"),
    );
    expect(
      client.getQueryData<InfiniteData<Enquiry[]>>(ownKey)?.pageParams,
    ).toEqual([0, 1]);
    expect(
      client.getQueryData<InfiniteData<Enquiry[]>>(ownKey)?.pages[0],
    ).toEqual([]);
    expect(
      client.getQueryData<InfiniteData<Enquiry[]>>(otherKey)?.pages[1]?.[0]
        ?.status,
    ).toBe("new");
  });
});
