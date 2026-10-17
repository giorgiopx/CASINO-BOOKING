/**
 * Real Chromium, read-only public UI checks. Never creates accounts, submits an
 * enquiry, or proves authenticated Supabase/RLS behavior. Network writes are
 * blocked even if the app was accidentally started with live backend settings.
 */
import { chromium } from "playwright";
import { strict as assert } from "node:assert";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.SMOKE_URL || "http://127.0.0.1:4173";
assert.ok(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Run this read-only suite against a local app only",
);
const shots = "artifacts/browser-smoke";
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
});
const results = [];
const pageErrors = [];
const blockedWrites = [];
const assets = [
  "hero-reference",
  "monaco",
  "cyprus",
  "greece",
  "italy",
  "france",
  "spain",
  "portugal",
  "serbia",
  "romania",
  "slovenia",
  "bulgaria",
  "croatia",
];
const dateIn = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const start = dateIn(30);
const end = dateIn(35);

async function newPage(width = 1536) {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 1024 },
  });
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      blockedWrites.push({ method: request.method(), url: request.url() });
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) =>
    pageErrors.push({ url: page.url(), message: error.message }),
  );
  page.setDefaultTimeout(15000);
  return page;
}
async function visit(page, path) {
  const response = await page.goto(base + path, {
    waitUntil: "networkidle",
    timeout: 45000,
  });
  // A same-document hash change returns no HTTP response in Playwright.
  if (response) assert.equal(response.status(), 200, path);
  else assert.equal(page.url(), new URL(path, base).href, path);
  await page.getByRole("main").waitFor();
}
async function check(name, callback, page) {
  try {
    await callback();
    results.push({ name, passed: true });
    console.log("PASS:", name);
  } catch (error) {
    const message = error?.stack || String(error);
    results.push({ name, passed: false, error: message });
    console.error("FAIL:", name, message);
    if (page && !page.isClosed())
      await page
        .screenshot({
          path: `${shots}/failure-${results.length}.png`,
          fullPage: true,
        })
        .catch(() => {});
  }
}
async function value(page, name, expected) {
  assert.equal(
    await page.locator(`[name="${name}"]`).inputValue(),
    expected,
    name,
  );
}
async function noOverflow(page) {
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  assert.ok(
    sizes.content <= sizes.width + 1,
    `Horizontal overflow: ${JSON.stringify(sizes)}`,
  );
}
async function language(page, lang) {
  const control = page.locator(".cb-language");
  if ((await page.locator("html").getAttribute("lang")) !== lang)
    await control.click();
  await page.waitForFunction(
    (expected) => document.documentElement.lang === expected,
    lang,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("casinobooking.language")),
    lang,
  );
}

try {
  for (const width of [1536, 768, 390]) {
    const page = await newPage(width);
    await check(
      `${width}px homepage: approved images, EN/EL, persistence, navigation and layout`,
      async () => {
        await visit(page, "/");
        assert.equal(await page.locator("header.cb-shell-header").count(), 1);
        assert.equal(await page.locator("footer.cb-shell-footer").count(), 1);
        assert.equal(
          await page.locator(".cb-country-grid .cb-country").count(),
          12,
        );
        assert.equal(
          await page.locator(".cb-extra-steps .cb-extra-step").count(),
          4,
        );
        for (const lang of ["el", "en"]) {
          await language(page, lang);
          await page.reload({ waitUntil: "networkidle" });
          await page.waitForFunction(
            (expected) => document.documentElement.lang === expected,
            lang,
          );
          assert.match(
            await page.getByRole("heading", { level: 1 }).innerText(),
            lang === "el" ? /Κορυφαία Καζίνο/ : /World-Class Casinos/,
          );
          await noOverflow(page);
          // Scroll each approved crop into view so lazy images are decoded as well.
          for (const img of await page
            .locator('.cb-country-grid img[src^="/design-reference/"]')
            .all()) {
            await img.scrollIntoViewIfNeeded();
            await img.evaluate((element) => element.decode());
            assert.ok(
              await img.evaluate((element) => element.naturalWidth > 0),
            );
          }
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({
            path: `${shots}/home-${width}-${lang}.png`,
            fullPage: true,
          });
          await page.screenshot({
            path: `${shots}/home-${width}-${lang}-viewport.png`,
          });
        }
        // The accessible label changes to "Close menu" while expanded.
        const menu = page.locator("button.cb-menu-toggle");
        if (await menu.isVisible()) {
          await menu.click();
          assert.equal(await menu.getAttribute("aria-expanded"), "true");
          await page.keyboard.press("Escape");
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
          assert.ok(
            await menu.evaluate(
              (element) => document.activeElement === element,
            ),
          );
          await menu.click();
        }
        await page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Destinations", exact: true })
          .click();
        await page.waitForURL((url) => url.pathname === "/destinations");
        await page
          .getByRole("heading", { level: 1, name: /destination directory/ })
          .waitFor();
        await noOverflow(page);
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        if (await menu.isVisible())
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
        await language(page, "el");
        await page.reload({ waitUntil: "networkidle" });
        await page
          .getByRole("heading", {
            name: "Κατάλογος προορισμών καζίνο",
            exact: true,
          })
          .waitFor();
        await noOverflow(page);
        await language(page, "en");
        await visit(page, "/request");
        await noOverflow(page);
        await page.screenshot({
          path: `${shots}/request-${width}.png`,
          fullPage: true,
        });
      },
      page,
    );
    await page.context().close();
  }

  const page = await newPage();
  await check(
    "All thirteen approved WebP files are served and decode in Chromium",
    async () => {
      await visit(page, "/");
      for (const asset of assets) {
        const url = `${base}/design-reference/${asset}.webp`;
        const response = await page.context().request.get(url);
        assert.equal(response.status(), 200, asset);
        assert.match(
          response.headers()["content-type"] || "",
          /image\/webp/,
          asset,
        );
        assert.ok(
          (await response.body()).length > 1000,
          `${asset} unexpectedly empty`,
        );
        const dimensions = await page.evaluate(async (src) => {
          const image = new Image();
          image.src = src;
          await image.decode();
          return { width: image.naturalWidth, height: image.naturalHeight };
        }, url);
        assert.ok(
          dimensions.width > 100 && dimensions.height > 100,
          `${asset}: ${JSON.stringify(dimensions)}`,
        );
      }
      assert.match(
        await page
          .locator(".cb-hero-photo")
          .evaluate((element) => getComputedStyle(element).backgroundImage),
        /hero-reference\.webp/,
      );
    },
    page,
  );

  await check(
    "Directory: 15 countries, 51 operator-listed venues, one planned; filters and restricted actions",
    async () => {
      await visit(page, "/destinations");
      assert.equal(await page.locator(".approved-country").count(), 15);
      assert.equal(await page.locator(".approved-venues li").count(), 52);
      assert.equal(await page.locator(".approved-listed").count(), 51);
      assert.equal(await page.locator(".approved-planned").count(), 1);
      assert.deepEqual(
        await page.locator(".approved-stats strong").allTextContents(),
        ["15", "51", "1"],
      );
      await page.screenshot({
        path: `${shots}/directory-15-countries.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Planned only", exact: true })
        .click();
      assert.equal(await page.locator(".approved-venues li").count(), 1);
      assert.match(
        await page.locator(".approved-venues").innerText(),
        /Wynn Al Marjan/,
      );
      assert.equal(
        await page.locator('.approved-venues a[href^="/request"]').count(),
        0,
      );
      await page
        .getByRole("button", { name: "Information only", exact: true })
        .click();
      assert.ok((await page.locator(".approved-venues li").count()) > 0);
      assert.equal(
        await page.locator('.approved-venues a[href^="/request"]').count(),
        0,
      );
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      await page.getByRole("searchbox").fill("Bellagio");
      assert.equal(await page.locator(".approved-venues li").count(), 1);
      await page.locator('.approved-venues a[href^="/request"]').click();
      await page.waitForURL((url) => url.pathname === "/request");
      await value(page, "destination", "Bellagio Las Vegas");
      await visit(page, "/destinations");
      await page.getByRole("searchbox").fill("zz-no-matching-venue-zz");
      await page
        .getByText("No matches. Try another search.", { exact: true })
        .waitFor();
      assert.equal(await page.locator(".approved-country").count(), 0);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.equal(await page.locator(".approved-country").count(), 15);
    },
    page,
  );

  await check(
    "Homepage enquiry forwards destination, both dates, party and package service",
    async () => {
      await visit(page, "/");
      const search = page.locator("form.cb-search");
      await search.getByRole("combobox").nth(0).selectOption("Monaco");
      await search.getByLabel("Arrival date", { exact: true }).fill(start);
      await search.getByLabel("Departure date", { exact: true }).fill(end);
      await search.getByRole("combobox").nth(1).selectOption("4");
      await search.locator('button[type="submit"]').click();
      await page.waitForURL((url) => url.pathname === "/request");
      for (const [name, expected] of Object.entries({
        destination: "Monaco",
        start,
        end,
        party: "4",
      }))
        await value(page, name, expected);
      assert.ok(
        await page.locator('[name="services"][value="package"]').isChecked(),
      );
    },
    page,
  );

  await check(
    "Service query defaults, validation and read-only enquiry form",
    async () => {
      for (const [type, service] of [
        ["casino", "casino"],
        ["flight", "flight"],
        ["hotel", "hotel"],
        ["transfer", "transfer"],
        ["cruise", "cruise"],
        ["bundle", "package"],
      ]) {
        await visit(
          page,
          `/request?type=${type}&interest=Monaco&start=${start}&end=${end}&party=6`,
        );
        assert.ok(
          await page
            .locator(`[name="services"][value="${service}"]`)
            .isChecked(),
          type,
        );
        for (const [name, expected] of Object.entries({
          destination: "Monaco",
          start,
          end,
          party: "6",
        }))
          await value(page, name, expected);
      }
      assert.deepEqual(
        (
          await page
            .locator('[name="services"]')
            .evaluateAll((elements) => elements.map((element) => element.value))
        ).sort(),
        ["casino", "cruise", "flight", "hotel", "package", "transfer"],
      );
      const destinations = await page
        .locator('[name="destination"] option')
        .allTextContents();
      assert.ok(
        destinations.some((text) => text.includes("Bellagio Las Vegas")),
      );
      for (const forbidden of [
        "Wynn Al Marjan",
        "Hard Rock Hotel & Casino Athens",
        "Casino Sochi",
        "Tigre de Cristal",
        "Shambala",
        "Sobranie",
      ])
        assert.ok(
          !destinations.some((text) => text.includes(forbidden)),
          `Ineligible destination: ${forbidden}`,
        );
      for (const name of [
        "name",
        "surname",
        "email",
        "phone",
        "residence",
        "customerType",
        "companyName",
        "flightOrigin",
        "flightDestination",
        "hotelCategory",
        "rooms",
        "transferPickup",
        "transferDestination",
        "preference",
        "consent",
      ])
        assert.equal(await page.locator(`[name="${name}"]`).count(), 1, name);
      assert.ok(
        await page
          .getByRole("button", { name: "Submit travel enquiry", exact: true })
          .isDisabled(),
      );
      await page
        .getByRole("status")
        .filter({
          hasText:
            /Account services are temporarily unavailable|Sign in or create a free account/,
        })
        .waitFor();
      assert.ok(
        (await page.locator('[name="consent"]').getAttribute("required")) !==
          null,
      );
      assert.match(
        await page.locator("main").innerText(),
        /Email\/WhatsApp delivery is not yet connected/,
      );
      await page.locator('[name="start"]').fill(dateIn(-1));
      assert.equal(
        await page
          .locator('[name="start"]')
          .evaluate((element) => element.validity.rangeUnderflow),
        true,
      );
      await page.locator('[name="start"]').fill(start);
      await page.locator('[name="end"]').fill(dateIn(29));
      assert.equal(
        await page
          .locator('[name="end"]')
          .evaluate((element) => element.validity.rangeUnderflow),
        true,
      );
      await visit(
        page,
        `/request?interest=not-a-real-destination&type=invalid&party=999&start=bad-date&end=bad-date`,
      );
      await value(page, "destination", "");
      await value(page, "start", "");
      await value(page, "end", "");
      await value(page, "party", "2");
    },
    page,
  );

  await check(
    "Signup link opens signup mode; consent required; account routes redirect anonymously",
    async () => {
      await visit(page, "/auth?mode=signup");
      await page.locator('[name="adultConfirmation"]').waitFor();
      for (const name of ["adultConfirmation", "privacyAcceptance"]) {
        assert.ok(
          (await page.locator(`[name="${name}"]`).getAttribute("required")) !==
            null,
          name,
        );
        assert.equal(await page.locator(`[name="${name}"]`).isChecked(), false);
      }
      await page.screenshot({ path: `${shots}/signup.png`, fullPage: true });
      assert.equal(await page.locator(".success-ref").count(), 0);
      for (const path of ["/dashboard", "/admin", "/portal"]) {
        await page.goto(base + path, { waitUntil: "domcontentloaded" });
        await page.waitForURL((url) => url.pathname === "/auth");
        await page.locator('[name="password"]').waitFor();
        assert.equal(await page.locator(".success-ref").count(), 0);
      }
    },
    page,
  );

  await check(
    "Public navigation targets load; no payment controls or payment integrations",
    async () => {
      for (const path of [
        "/explore",
        "/global-casinos",
        "/services",
        "/services#cruises",
        "/about",
        "/contact",
        "/privacy",
        "/terms",
        "/destination/monaco",
      ]) {
        await visit(page, path);
        assert.equal(
          await page.locator("header.cb-shell-header").count(),
          1,
          path,
        );
        assert.ok(
          (await page.getByRole("heading", { level: 1 }).count()) > 0,
          path,
        );
        assert.equal(
          await page
            .getByRole("link", {
              name: /^(pay now|checkout|subscribe|buy membership)$/i,
            })
            .count(),
          0,
          path,
        );
        assert.equal(
          await page
            .locator(
              'iframe[src*="stripe"],script[src*="stripe"],input[autocomplete="cc-number"],input[name="cardNumber"]',
            )
            .count(),
          0,
          path,
        );
        await noOverflow(page);
      }
    },
    page,
  );
  await check(
    "No uncaught browser errors and no network writes attempted",
    async () => {
      assert.deepEqual(pageErrors, [], "Uncaught browser exceptions");
      assert.deepEqual(
        blockedWrites,
        [],
        "Unexpected attempted network mutations (blocked)",
      );
    },
  );
} finally {
  await browser.close();
  await writeFile(
    `${shots}/report.json`,
    JSON.stringify(
      {
        scope:
          "Real Chromium public UI only. No mocked or live authenticated sessions, database writes, notifications, or RLS proof.",
        base,
        chromium: browser.version(),
        runAt: new Date().toISOString(),
        results,
        pageErrors,
        blockedWrites,
      },
      null,
      2,
    ),
  );
}
const failures = results.filter((result) => !result.passed);
console.log(
  `${results.length - failures.length}/${results.length} browser checks passed. Authenticated Supabase/RLS E2E remains separate.`,
);
if (failures.length) process.exitCode = 1;
