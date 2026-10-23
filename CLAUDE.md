# AmberX Tour

A ten-minute, auto-playing, phone-first guided walkthrough of the AmberX ecosystem, to be hosted at
https://tour.amberxai.com as its own Coolify app. Static site (nginx), vanilla JS, no build step.
It opens by explaining the goal, then tours the apps, then shows how everything connects.

## Status (as of Oct 21 2026)

- **Built:** first version, 11 chapters, 48 scenes, about 10:44 in total (computed from the captions). Animated SVG
  flow diagrams and cards, captions as narration text (Web Speech API toggle, off by default), chapter menu,
  progress bar with chapter marks, keyboard, edge taps and swipe, dark default plus light via
  `prefers-color-scheme`, `prefers-reduced-motion` respected. Checked in Chromium at 412x915 and 1280x800.
- **Chapters:** 1 The goal, 2 The cast, 3 AmberX AXF, 4 Dev Console, 5 Build Pilot, 6 axHub, 7 Working together
  (incl. approvals to the phone), 8 Phone to VPS, 9 The apps, 10 Push to live, 11 Where it's all going (roadmap + end card).
- **Live (Oct 22 2026):** https://tour.amberxai.com. The repo is **public** (Brett's call, so the VPS can clone it).
  Not a Coolify app: a plain container `amberx-tour` on Coolify's `coolify` network with Traefik labels (HTTPS via
  the `letsencrypt` resolver, http redirects to https), built from a clone at `/opt/amberx-tour` on the VPS, the same
  way Build Pilot runs. DNS: an A record `tour` added by Brett in hPanel. **No auto-deploy:** after pushing, redeploy
  on the VPS with `git -C /opt/amberx-tour pull` + `docker build -t amberx-tour:latest /opt/amberx-tour`, then
  re-run the container (`docker rm -f amberx-tour` and the same `docker run` with the Traefik labels).
- **Honesty rules in the content:** the five-minute app is a goal, not a measured result. Approvals reach the phone
  today by the apps polling axHub's feed (AXHub app every 30 s, console banner every 5 s); true server push is
  Coming. Web stacks in Build Pilot, the Asset Designer/Browser and axHub steps 4 to 9 are Coming or Planned.
  Native Android Console/Pilot are On hold (Brett's call, Oct 21 2026).
- **Left out as unclear:** `patches.amberxai.com` (only appears as an example setting in axHub, no deploy recorded),
  the Dev Console MCP tool count (sources say 24 and 26), Hostinger as an API token holder (not set yet), anything
  about mosh internals (not in the sources).
- **Now (Oct 22 2026):** the front page is the narrated video walkthrough (see Video pipeline); the slideshow is at
  `/slides/`. The site container mounts `/opt/amberx-tour-rec/publish` as `/video`, so a new recording goes live
  as soon as it is assembled. Still to add: Brett's phone clip of an Android approval.

## Next: the narrated video walkthrough (Brett, Oct 22 2026)

The slideshow above is a stopgap. What Brett actually wants, like the walkthrough on demo.amberxai.com
(`/opt/axp-demo/html/walkthrough` on the VPS: a real browser recording with a voice, 720p MP4 parts, VTT/SRT
captions, a chapter list and an index page):

- **Opening chapter = the purpose (Brett's words, Oct 22 2026):** build apps quickly, **assembled by spec**:
  pick features and pre-built libraries, optionally have **Claude add features**; **spec-driven instead of
  code-driven**. Show it on screen (Build Pilot's feature picking, libraries, "Add with Claude").
- **Every developer feature (Brett, Oct 22 2026):** walk through all of them, not a highlight reel. In the
  Console that includes the **Pending builds list** (builds parked until Fable is available, or built with Opus
  now; Fable rebuilds), model picks, Projects/manifests/Standards, the project wizard, systems check, plugins and
  Plugin Manager/catalog/switches, AI assistant, agent manager, live sessions, terminal, container access,
  snapshots, theme manager, feature assistant, activity, alerts, approvals banner, build manager, codebase
  changes, main build status, APK builds. Plus every Build Pilot step/plugin and every axHub page. Source list:
  the bold headings in AmberX-AXF/CLAUDE.md, Build-Pilot/CLAUDE.md, axHub/CLAUDE.md. Longer than 10 min is
  fine: the chapter index + speed slider make it navigable (the demo's walkthrough runs 71 min).
- **Scope:** the AmberX AXF framework, Dev Console, Build Pilot and axHub only. No Expense Tracker or ledger.
- **Live:** record the real sites (console/pilot/axhub.amberxai.com) in a browser on the VPS, signed in from
  `/root/.tour-recorder.env` (root-only, written by Brett; never in chat, repo or axHub logs). Show and open
  things only: no builds, commits or other writes.
- **Android approvals:** shown from Brett's real phone (AXHub app): he screen-records while Claude triggers a
  harmless approval, then sends the video to splice in.
- **Narrated:** a voice over the recording plus captions (offline Piper TTS is available from GitHub releases).
- **Player:** chapter index, captions, and a **playback speed slider with presets** (e.g. 0.75x, 1x, 1.25x, 1.5x, 2x).
- About 10 minutes. Publish at tour.amberxai.com, replacing the slideshow.

## Video pipeline (live Oct 22 2026: first cut 8.7 min, 11 chapters; Oct 23 fixes: console banners hidden while recording (minimized in the console chapter), menus walk submenus to the real pages, Pending builds view, closing chapter shows Pilot + axHub; re-recorded Oct 23 into /opt/amberx-tour-rec/publish, but menus stayed open: the recorder image's Playwright 1.49.1 ignores `filter({ visible: true })` (1.51+), so clicks hit hidden items; fixed with `visible=true` locators, submenu items now go on to their first entry, Pilot views skip the menu bar's same-named buttons; needs another re-record. tour.amberxai.com is being repurposed for Walkthrough Studio, so don't touch the site container)

```
recorder/script.mjs    the narration: chapters → scenes { say, act } (facts from the three source CLAUDE.md files)
recorder/tts.mjs       Piper voice (en_US ryan high) → audio/<chapter>-<n>.wav + durations.json
recorder/record.mjs    Playwright on the live sites, one video per chapter, each scene held for its voice clip;
                       signs in as axHub user `tour-recorder` from /root/.tour-recorder.env (random password made on
                       the VPS, never shown); creates/reuses the empty Pilot project "Tour demo" (Brett OK, never built); otherwise read-only
recorder/assemble.mjs  ffmpeg → publish/walkthrough.mp4 (720p, narration) + walkthrough.vtt + chapters.json
recorder/Dockerfile    recorder image (Playwright + ffmpeg + Piper); run.sh runs the three steps inside it
index.html + js/player.js + css/player.css   the player: video, captions, chapter index, speed slider + presets
slides/                the old slideshow
```
On the VPS: `docker build -t amberx-tour-recorder /opt/amberx-tour/recorder`, then run it with
`--env-file /root/.tour-recorder.env -v /opt/amberx-tour/recorder:/rec:ro -v /opt/amberx-tour-rec:/out` and `bash /rec/run.sh`.
The site container mounts `/opt/amberx-tour-rec/publish` at `/usr/share/nginx/html/video` (read-only).

## Layout

```
index.html        shell: header, stage, controls, chapter sheet
css/style.css     theme tokens (dark default, light via prefers-color-scheme), cards, SVG flow styles, controls
js/script.js      ALL content: window.TOUR = { goal, urls, chapters[ scenes[ {h, caps, v} ] ] }
js/diagram.js     renderers for the visuals: cards, animated SVG flows (auto layout), end-card URL list
js/app.js         engine: timeline, scene rendering, controls, keyboard, swipe, narration
Dockerfile        nginx:alpine on port 80, healthcheck
project.manifest.json   project-manifest@1 (name amberx-tour, deploy tour.amberxai.com via coolify)
```

## Build, run, test

```
python3 -m http.server 8000      # then open http://localhost:8000 (no build step)
```
No test suite. Verified with Playwright and Chromium (`executablePath: '/opt/pw-browsers/chromium'`): no console
errors, no horizontal scroll at 412x915 and 1280x800, autoplay advances, controls work. `window.TOUR_TIMELINE` and
`window.TOUR_API` (seek, toggle, state) exist for tests. Total runtime must stay between 9 and 11 minutes.

## Conventions & decisions

- **Content must match the source repos** (axhub, build-pilot, amberx-axf, Expense, amberx). No invented features,
  numbers or URLs; no secrets, tokens, IPs or credentials. When unsure, leave it out.
- **Mark the future.** Anything not built carries `st: 'coming' | 'planned' | 'hold'` (shown as a badge and dashed
  border). Never present it as done. Update the content whenever a source repo's Status changes.
- **Every chapter's title card carries a "how this serves the goal" line** (the chapter's `goal` field), and the end card restates the goal.
- Scene length comes from caption length (about 2.9 words per second, minimum 3.4 s), so captions double as narration.
- No frameworks, no external requests (system fonts only). External loads would only ever be Google Fonts.
- Phone first: check 412 px width for no horizontal scroll and readable text before anything else.

## Related repos

- **MossesX/axHub**, **MossesX/Build-Pilot**, **MossesX/AmberX-AXF**: the sources for the content.
- **MossesX/Expense**: the Expense Tracker described in chapter 9. (Not the near-empty `MossesX/Expenses`.)

## Dormant

An older PyQt6 desktop line (`MossesX/amberx`) is mentioned in one line only (chapter 9).

---

## Working with Brett (same in every MossesX repo)

- **Where he works:** mostly from his Android phone (Samsung Galaxy S26 Ultra), often through **Moshi** (mosh) into his Hostinger VPS, where Claude Code runs. Keep replies phone-readable: lead with the result, short paragraphs, no walls of text.
- **Model choice:** before any build task, recommend which model to use and why, then let him pick from the top three (Fable, Opus, Sonnet). Use Fable where it's warranted, Opus for most work, and Sonnet only when you're sure Opus isn't needed.
- **The repo is the shared memory.** Sessions on the phone (Moshi), desktop, web and claude.ai don't share chat history, so anything a future session needs must live in this repo. Commit and push often with clear messages, and update the **Status** section of this file whenever something meaningful changes.
- **No secrets in the repo:** no tokens, passwords, keys or IPs with credentials. Use environment variables or GitHub Actions secrets.
- **GitHub:** account `MossesX`. A new repo must exist on GitHub before a session can push to it.
- **Server:** a Hostinger VPS running **Coolify**. Coolify's Traefik proxy owns ports 80/443, so new web apps go behind it as Coolify apps (no separate nginx). His domain is `amberxai.com`.
- **axHub:** his connector hub on the VPS (repo `MossesX/axHub`). If the axHub MCP server is configured in this Claude Code install, use its `list_services`, `describe_service` and `call` tools to reach his other services instead of asking him for credentials.
