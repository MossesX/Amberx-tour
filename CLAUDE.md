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
- **Next:** not recorded. Ask Brett.

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
