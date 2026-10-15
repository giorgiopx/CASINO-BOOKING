/**
 * Browser-level smoke test only. Uses a dummy, non-working Supabase endpoint:
 * NEVER creates customer records, logs into production, or sends a travel request.
 * Browser screenshots are artifacts for review, not proof of a live CRM.
 */
import { chromium } from "playwright";
import { strict as assert } from "node:assert";
import { mkdir } from "node:fs/promises";

const base = process.env.SMOKE_URL || "http://127.0.0.1:4173";
const shots = "artifacts/browser-smoke";
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({ headless: true });
let failed = 0;

async function check(name, cb) {
  try {
    await cb();
    console.log("PASS:", name);
  } catch (e) {
    failed += 1;
    console.error("FAIL:", name, e?.message || String(e));
  }
}

try {
  const desktop = await browser.newPage({
    viewport: { width: 1536, height: 1024 },
  });
  const pageErrors = [];
  desktop.on("pageerror", (err) => pageErrors.push(err.message));

  await check(
    "Homepage opens and retains approved design component",
    async () => {
      const response = await desktop.goto(base + "/", {
        waitUntil: "domcontentloaded",
      });
      assert.equal(response?.status(), 200);
      await desktop.locator(".cb-design").waitFor({ timeout: 15000 });
      assert.equal(
        (await desktop.locator(".cb-country").count()) >= 12,
        true,
        "Expected 12 photo cards",
      );
    },
  );
  await desktop.screenshot({
    path: shots + "/home-desktop.png",
    fullPage: true,
  });

  await check("Separate international casino catalogue opens", async () => {
    const response = await desktop.goto(base + "/global-casinos", {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response?.status(), 200);
    await desktop.locator(".global-grid").waitFor({ timeout: 12000 });
    assert.equal((await desktop.locator(".global-card").count()) >= 10, true);
  });
  await desktop.screenshot({
    path: shots + "/usa-casinos.png",
    fullPage: true,
  });

  await check("Signup page contains adult acknowledgement", async () => {
    const response = await desktop.goto(base + "/auth", {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response?.status(), 200);
    await desktop.locator('input[name="email"]').waitFor({ timeout: 12000 });
    // Wait for client hydration; server-rendered controls may be visible before handlers bind.
    await desktop.waitForLoadState("networkidle");
    await desktop
      .getByRole("button", {
        name: /create an account|δημιουργία λογαριασμού/i,
      })
      .first()
      .click();
    // Retry only if the initial click raced the page hydration.
    if (
      (await desktop.locator('input[name="adultConfirmation"]').count()) === 0
    ) {
      await desktop.waitForTimeout(500);
      await desktop
        .getByRole("button", {
          name: /create an account|δημιουργία λογαριασμού/i,
        })
        .first()
        .click();
    }
    await desktop
      .locator('input[name="adultConfirmation"]')
      .waitFor({ timeout: 8000 });
    assert.equal(
      await desktop.locator('input[name="privacyAcceptance"]').count(),
      1,
    );
  });
  await desktop.screenshot({ path: shots + "/signup.png", fullPage: true });

  await check(
    "Free enquiry form exists and excludes unbuilt casinos",
    async () => {
      await desktop.goto(base + "/request", { waitUntil: "domcontentloaded" });
      await desktop
        .locator('select[name="destination"]')
        .waitFor({ timeout: 12000 });
      const options = await desktop
        .locator('select[name="destination"] option')
        .allTextContents();
      assert.ok(options.some((x) => x.includes("Bellagio Las Vegas")));
      assert.ok(
        !options.some((x) => x.includes("Hard Rock Hotel & Casino Athens")),
      );
      assert.ok(!options.some((x) => x.includes("Wynn Al Marjan Island")));
      assert.ok((await desktop.locator('input[name="phone"]').count()) > 0);
      assert.ok((await desktop.locator('input[name="email"]').count()) > 0);
    },
  );
  await desktop.screenshot({
    path: shots + "/enquiry-form.png",
    fullPage: true,
  });

  await check("Private dashboard requires account login", async () => {
    await desktop.goto(base + "/dashboard", { waitUntil: "domcontentloaded" });
    await desktop.waitForURL(/\/auth(?:\?|$)/, { timeout: 12000 });
  });

  await check("Private administrator CRM requires login", async () => {
    await desktop.goto(base + "/admin", { waitUntil: "domcontentloaded" });
    await desktop.waitForURL(/\/auth(?:\?|$)/, { timeout: 12000 });
  });

  await check(
    "Original approved WebP files load from HTTP server",
    async () => {
      const context = desktop.context();
      for (const asset of [
        "hero-reference.webp",
        "monaco.webp",
        "greece.webp",
        "cyprus.webp",
      ]) {
        const response = await context.request.get(
          base + "/design-reference/" + asset,
        );
        assert.equal(response.status(), 200, asset);
        const kind = response.headers()["content-type"] || "";
        assert.match(kind, /image\/webp/, asset + ": got " + kind);
      }
    },
  );

  await check("Mobile homepage layout loads", async () => {
    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    try {
      await mobile.goto(base + "/", { waitUntil: "domcontentloaded" });
      await mobile.locator(".cb-design").waitFor({ timeout: 12000 });
      await mobile.screenshot({
        path: shots + "/home-mobile.png",
        fullPage: true,
      });
      assert.equal((await mobile.locator(".cb-menu-toggle").count()) > 0, true);
    } finally {
      await mobile.close();
    }
  });
  console.log("Nonfatal pageerror count:", pageErrors.length);
} finally {
  await browser.close();
}
if (failed) {
  console.error(failed + " browser smoke checks failed.");
  process.exitCode = 1;
} else {
  console.log(
    "All browser smoke checks passed. Not a replacement for real Supabase E2E.",
  );
}
