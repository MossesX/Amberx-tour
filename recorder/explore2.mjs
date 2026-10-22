// Second look-around: opens every top-level menu in the Dev Console and every view in Build Pilot,
// and prints what each contains, so the walkthrough can visit every developer feature.
// Read-only: it opens menus and views and presses Escape; it never clicks a menu item.
import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto("https://axhub.amberxai.com/auth/login?rd=/", { waitUntil: "domcontentloaded" });
await page.fill("#u", process.env.HUB_USER || "");
await page.fill("#p", process.env.HUB_PASS || "");
await page.click("form[action='/auth/login'] button");
await page.waitForURL((u) => !u.pathname.startsWith("/auth/login"), { timeout: 20000 });

const visible = (sel, n = 80) => page.evaluate(([sel, n]) => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const t = (e) => (e.innerText || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 70);
  return [...new Set([...document.querySelectorAll(sel)].filter(vis).map(t).filter(Boolean))].slice(0, n);
}, [sel, n]);
const MENU = "[role=menu] [role=menuitem], [role=menu] button, [role=menu] a, .menu [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio]";

console.log("### CONSOLE");
await page.goto("https://console.amberxai.com/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
for (const name of ["Console", "Builds", "Framework", "Plugins", "Apps", "View", "Help"]) {
  try {
    await page.getByRole("button", { name, exact: true }).first().click({ timeout: 5000 });
    await page.waitForTimeout(800);
    console.log(`menu ${name}: ${JSON.stringify(await visible(MENU))}`);
    await page.keyboard.press("Escape"); await page.waitForTimeout(300);
  } catch (e) { console.log(`menu ${name}: ERROR ${e.message.split("\n")[0]}`); }
}
console.log("tabs/views:", JSON.stringify(await visible("[role=tab], nav a, aside a, aside button")));

console.log("\n### PILOT");
for (const v of ["Home", "Designer", "Plugins", "Assistant", "Agents", "Assets", "Roles", "Settings"]) {
  try {
    await page.goto("https://pilot.amberxai.com/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: v, exact: true }).first().click({ timeout: 5000 });
    await page.waitForTimeout(2500);
    console.log(`view ${v}: h=${JSON.stringify(await visible("h1,h2,h3", 20))} b=${JSON.stringify(await visible("main button, main [role=tab], main a", 40))}`);
  } catch (e) { console.log(`view ${v}: ERROR ${e.message.split("\n")[0]}`); }
}
await browser.close();
