// Records each chapter as its own video while the narration plays out in time: every scene runs its action,
// then holds until its voice clip (from tts.mjs) has finished. Writes raw videos + a timeline for assemble.mjs.
// On the live sites it opens pages, menus, views and dialogs; the only write is the empty Pilot project "Tour demo".
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync, readdirSync, renameSync } from "node:fs";
import { CHAPTERS } from "./script.mjs";

const OUT = process.env.OUT || "/out";
const ONLY = (process.env.ONLY || "").split(",").filter(Boolean);
const HUB = "https://axhub.amberxai.com";
const SIZE = { width: 1280, height: 720 };
const durations = JSON.parse(readFileSync(`${OUT}/durations.json`, "utf8"));
mkdirSync(`${OUT}/raw`, { recursive: true });
mkdirSync(`${OUT}/shots`, { recursive: true });

// A visible pointer, so viewers can follow the mouse in the recording.
const CURSOR = `addEventListener('DOMContentLoaded', () => {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;' +
    'background:rgba(255,140,0,.35);border:2px solid #ff8c00;z-index:2147483647;pointer-events:none;transition:transform .08s';
  document.body.appendChild(d);
  addEventListener('mousemove', (e) => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; }, true);
  addEventListener('mousedown', () => { d.style.transform = 'scale(.7)'; }, true);
  addEventListener('mouseup', () => { d.style.transform = ''; }, true);
});`;

// Console banners (setup issues, keys, what's new…) would cover half of every console shot. Hidden for the
// recording through the console's own banner settings (this browser only), minimized in the chapter that talks
// about them. Never touches the server or other devices.
const BANNERS = ["activity", "approvals", "build-manager", "claude-handoff", "codebase-changes", "push-banner", "keys-needed", "systems-check", "whats-new"];
const bannerPrefs = (mode) => `(() => {
  if (location.hostname !== "console.amberxai.com") return;
  const key = "axf:axf-console:settings";
  let v = {}; try { v = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch {}
  const prefs = {};
  for (const id of ${JSON.stringify(BANNERS)}) prefs[id] = ${mode === "minimized" ? '{ launch: "minimized" }' : "{ show: false }"};
  v["axf.banners.prefs"] = prefs;
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
})();`;

const browser = await chromium.launch();

async function signIn(page) {
  if (!page.url().includes("/auth/login")) await page.goto(`${HUB}/auth/login?rd=/`, { waitUntil: "domcontentloaded" });
  await page.fill("#u", process.env.HUB_USER || "");
  await page.fill("#p", process.env.HUB_PASS || "");
  await page.click("form[action='/auth/login'] button");
  await page.waitForURL((u) => !u.pathname.startsWith("/auth/login"), { timeout: 20000 });
}

// Sign in once and reuse the session for every chapter (except the one that shows signing in).
{
  const ctx = await browser.newContext({ viewport: SIZE });
  const page = await ctx.newPage();
  await signIn(page);
  await ctx.storageState({ path: `${OUT}/state.json` });
  await ctx.close();
}

function helpers(page, log) {
  const soft = async (what, fn) => {
    try { await fn(); } catch (e) { log.push(`  ! ${what}: ${e.message.split("\n")[0].slice(0, 140)}`); }
  };
  const visible = (loc) => loc.locator("visible=true").first();
  const moveTo = async (loc) => {
    await loc.scrollIntoViewIfNeeded({ timeout: 4000 });
    const b = await loc.boundingBox();
    if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 18 });
  };
  const press = async (loc, settle = 1500) => { await moveTo(loc); await loc.click({ timeout: 5000 }); await page.waitForTimeout(settle); };
  const h = {
    wait: (ms) => page.waitForTimeout(ms),
    go: (url) => soft(`go ${url}`, async () => { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); await page.waitForTimeout(2500); }),
    point: (sel) => soft(`point ${sel}`, () => moveTo(visible(page.locator(sel)))),
    scroll: (dy) => soft("scroll", async () => {
      await page.mouse.move(SIZE.width / 2, SIZE.height / 2, { steps: 5 });
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, dy / 6); await page.waitForTimeout(80); }
    }),
    esc: () => page.keyboard.press("Escape").then(() => page.waitForTimeout(400)),
    openMenu: (name) => soft(`menu ${name}`, () => press(visible(page.getByRole("button", { name, exact: true })), 900)),
    // A menu item by the start of its label ("…" and "..." match either way); the deepest open one wins (a
    // submenu's items come after its parent). With leaf set, an item that only opens a submenu goes one step on
    // to the submenu's first item, so the scene ends on a real page or dialog, not an open menu.
    menuItem: (name, settle = 1800, leaf = true) => soft(`menu item ${name}`, async () => {
      const label = name.replace(/(…|\.\.\.)$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const item = page.locator("[role=menuitem], [role=menuitemcheckbox]").locator("visible=true")
        .filter({ hasText: new RegExp("^\\s*" + label) }).last();
      const el = await item.elementHandle({ timeout: 5000 });
      await press(item, leaf ? 900 : settle);
      if (!leaf) return;
      const sub = await el.getAttribute("aria-haspopup").catch(() => null);
      if (sub && sub !== "false") {
        log.push(`  · ${name} opens a submenu: taking its first item`);
        await press(page.locator("[role=menu]").locator("visible=true").last()
          .locator("[role=menuitem], [role=menuitemcheckbox]").locator("visible=true").first(), settle);
      } else await page.waitForTimeout(Math.max(0, settle - 900));
    }),
    // Reload first: a view or dialog left open by the previous item can sit over the menu. Then walk the path
    // (submenus open on click), ending on the page or dialog the last item opens.
    menu: async (top, ...path) => {
      await soft("reload", async () => { await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(2500); });
      await h.openMenu(top);
      for (let i = 0; i < path.length; i++) await h.menuItem(path[i], i < path.length - 1 ? 700 : 1800, i === path.length - 1);
    },
    clickTimes: (sel, n, gap) => soft(`clickTimes ${sel}`, async () => {
      const l = visible(page.locator(sel)); await moveTo(l);
      for (let i = 0; i < n; i++) { await l.click({ timeout: 4000 }); await page.waitForTimeout(gap); }
    }),
    // A view button, not a menu-bar button of the same name (Build Pilot's menu bar has its own "Assets" menu).
    // The last match also skips a menu bar placed ahead of the views.
    view: (name) => soft(`view ${name}`, () => press(page.getByRole("button", { name, exact: true })
      .and(page.locator(":not([aria-haspopup])")).locator("visible=true").last(), 1800)),
    nextStep: () => soft("next step", async () => { await press(visible(page.getByRole("button", { name: /^Next:/ }))); await page.mouse.wheel(0, -2000); }),
    signIn: () => soft("sign in", async () => {
      await moveTo(page.locator("#u"));
      await page.locator("#u").pressSequentially(process.env.HUB_USER || "", { delay: 60 });
      await page.fill("#p", process.env.HUB_PASS || "");
      await signIn(page); await page.waitForTimeout(2500);
    }),
    // Brett's OK (Oct 22 2026): create the empty "Tour demo" Android project if it doesn't exist yet. Never built.
    startDemoProject: (name) => soft(`start project ${name}`, async () => {
      const existing = page.getByText(name, { exact: true }).locator("visible=true");
      if (await existing.count()) return press(existing.first(), 2500);
      const f = visible(page.getByLabel("App name")); await moveTo(f); await f.pressSequentially(name, { delay: 70 });
      await press(visible(page.getByRole("button", { name: /^Start .*project$/ })), 2500);
    }),
    openDemoProject: (name) => soft(`open project ${name}`, () => press(visible(page.getByText(name, { exact: true })), 2500)),
  };
  return h;
}

const timeline = [];
for (const ch of CHAPTERS) {
  if (ONLY.length && !ONLY.includes(ch.id)) continue;
  const dir = `${OUT}/raw/${ch.id}`;
  const ctx = await browser.newContext({ viewport: SIZE, recordVideo: { dir, size: SIZE }, ...(ch.signedOut ? {} : { storageState: `${OUT}/state.json` }) });
  await ctx.addInitScript(CURSOR);
  await ctx.addInitScript(bannerPrefs(ch.banners));
  const page = await ctx.newPage();
  const t0 = Date.now();
  const log = [`## ${ch.id}`];
  const h = helpers(page, log);
  if (ch.start) await h.go(ch.start);
  if (ch.pre) await ch.pre(h);
  const scenes = [];
  for (let i = 0; i < ch.scenes.length; i++) {
    const s = ch.scenes[i];
    const dur = durations[`${ch.id}-${i}`] ?? 3;
    const start = (Date.now() - t0) / 1000;
    await Promise.race([s.act(h), page.waitForTimeout(Math.max(8000, dur * 1000))]).catch((e) => log.push(`  ! act ${i}: ${e.message}`));
    const left = start + dur + 0.5 - (Date.now() - t0) / 1000;
    if (left > 0) await page.waitForTimeout(left * 1000);
    const end = (Date.now() - t0) / 1000;
    scenes.push({ i, start, end, dur, say: s.say });
    const heads = await page.evaluate(() => [...document.querySelectorAll("h1,h2")].filter((e) => e.getBoundingClientRect().height > 0)
      .map((e) => e.innerText.trim()).slice(0, 4).join(" | ")).catch(() => "");
    log.push(`  ${i} ${start.toFixed(1)}-${end.toFixed(1)}s  ${page.url().replace(/^https:\/\//, "")}  [${heads}]`);
    await page.screenshot({ path: `${OUT}/shots/${ch.id}-${i}.jpg`, quality: 55 }).catch(() => {});
  }
  await ctx.close();
  const webm = readdirSync(dir).find((f) => f.endsWith(".webm"));
  renameSync(`${dir}/${webm}`, `${OUT}/raw/${ch.id}.webm`);
  timeline.push({ id: ch.id, title: ch.title, scenes });
  console.log(log.join("\n"));
}
writeFileSync(`${OUT}/timeline.json`, JSON.stringify(timeline, null, 1));
await browser.close();
