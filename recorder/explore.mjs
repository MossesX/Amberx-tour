// First look-around for the video walkthrough: signs in through axHub, visits the live
// developer apps and prints what is on each screen (headings, navigation, buttons), so the
// recording script can be written against the real UI. Read-only: it only opens pages.
// Run in the Playwright image on the VPS; credentials come from the env (HUB_USER, HUB_PASS).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.env.OUT || "/out";
mkdirSync(`${OUT}/shots`, { recursive: true });
const pages = [
  ["axhub-home", "https://axhub.amberxai.com/"],
  ["axhub-approvals", "https://axhub.amberxai.com/auth/admin/approvals"],
  ["axhub-apps", "https://axhub.amberxai.com/apps"],
  ["console", "https://console.amberxai.com/"],
  ["pilot", "https://pilot.amberxai.com/"]
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

await page.goto("https://axhub.amberxai.com/auth/login?rd=/", { waitUntil: "domcontentloaded" });
await page.fill("#u", process.env.HUB_USER || "");
await page.fill("#p", process.env.HUB_PASS || "");
await page.click("form[action='/auth/login'] button");
// Wait for the sign-in POST to finish and leave the login page; moving on earlier aborts it.
await page.waitForURL((u) => !u.pathname.startsWith("/auth/login"), { timeout: 20000 }).catch(() => {});
const after = new URL(page.url());
console.log("after sign-in:", after.pathname, after.searchParams.get("err") || "");
if (after.pathname.startsWith("/auth/login")) {
  const msg = await page.locator(".err, .error, [role=alert]").allInnerTexts().catch(() => []);
  console.log("sign-in failed:", msg.join(" | ") || "(no message shown)");
  await browser.close();
  process.exit(2);
}

const dump = () => page.evaluate(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const txt = (e) => (e.innerText || e.getAttribute("aria-label") || e.title || "").trim().replace(/\s+/g, " ").slice(0, 60);
  const pick = (sel, n) => [...new Set([...document.querySelectorAll(sel)].filter(vis).map(txt).filter(Boolean))].slice(0, n);
  return {
    title: document.title,
    headings: pick("h1,h2,h3", 25),
    nav: pick("nav a, nav button, [role=tab], [role=menuitem], aside a, aside button", 60),
    buttons: pick("button, [role=button], a.button", 60),
    dataAttrs: [...new Set([...document.querySelectorAll("[data-view],[data-action],[data-testid]")].slice(0, 40)
      .map((e) => e.getAttribute("data-view") || e.getAttribute("data-action") || e.getAttribute("data-testid")))]
  };
});

for (const [name, url] of pages) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(4000);
    const d = await dump();
    await page.screenshot({ path: `${OUT}/shots/${name}.png` });
    console.log(`\n### ${name}  ${page.url()}\n${JSON.stringify(d)}`);
  } catch (e) {
    console.log(`\n### ${name}  ERROR ${e.message.split("\n")[0]}`);
  }
}
await browser.close();
