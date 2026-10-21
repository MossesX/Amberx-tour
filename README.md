# AmberX Tour

A ten-minute, auto-playing guided walkthrough of Brett's AmberX ecosystem, built phone-first. It opens with the
goal (no-code Android and web apps from interchangeable assets, same look and behaviour, aiming at about five
minutes start to finish, wired to a data server like axHub), then tours AXF, the Dev Console, Build Pilot and
axHub, how they work together, how the phone, Moshi, Claude Code, GitHub, Coolify, Traefik and Hostinger connect,
and ends with the roadmap and every live URL. Planned things are labelled Coming, Planned or On hold.

Target address: https://tour.amberxai.com

It is a static site: `index.html`, `css/`, `js/`. No build step, no frameworks, no external requests.

## Run locally

```
python3 -m http.server 8000
# open http://localhost:8000   (phone-first: try a 412 px wide window)
```

`#c6` starts at chapter 6, `#t=120` starts at 2:00.

## Controls

Play/pause, previous/next scene, chapter menu, progress bar with chapter marks (tap or drag), elapsed/total time.
Keys: Space = play/pause, Left/Right = previous/next scene, Up/Down = previous/next chapter, M = chapters,
N = narration. Tap the left or right edge to go back or forward; swipe on touch screens; tap the middle to pause.
Narration (browser Web Speech API) is off by default; the captions are the narration text.

## Edit the content

All chapters and scenes are in `js/script.js`. Scene durations are computed from the caption lengths, so editing
text retimes the tour (aim for 9 to 11 minutes in total; `window.TOUR_TIMELINE.total` in the browser console shows
the seconds). Keep content in line with the source repos and mark unbuilt things `st: 'coming' | 'planned' | 'hold'`.

## Deploy on Coolify

1. Repo `MossesX/amberx-tour` on GitHub (private). In Coolify: Projects, + New, Resource, Private Repository
   (with Deploy Key), branch `main`.
2. Build Pack: `Dockerfile`. Ports Exposes: `80`.
3. Domains: `https://tour.amberxai.com`.
4. DNS: an A record `tour` pointing at the VPS (skip if a wildcard record already does).
5. Optional: Healthcheck on `/` (the image has its own), and Auto Deploy so every push to `main` redeploys.

No environment variables or secrets are needed.
