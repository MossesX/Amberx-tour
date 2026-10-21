/* AmberX tour: ALL chapter and scene content lives in this file.
   Facts come from the source repos (axhub, build-pilot, amberx-axf, Expense, amberx). See CLAUDE.md.
   Keep anything not built yet marked st:'coming' | 'planned' | 'hold'.
   Scene shape: { h: headline, caps: [caption sentences = narration text], v: visual }.
   Durations are computed from the captions (see js/app.js), so editing text retimes the tour.
   Visuals:
     {t:'cards', items:[{h, b, st, n, c}]}                       cards, st = live|built|coming|planned|hold|target|dormant
     {t:'flow',  nodes:[{id,l,s,k,st,row,c,x,y,w,link}], edges:[[from,to,label,{c,bi}]]}
        k = me|ext|amber|hub|infra. row = layer (auto edges join neighbouring layers); x,y,w = free layout (360 wide).
     {t:'urls'}                                                   the end card (uses TOUR.urls)
   c = index of the caption at which the item appears. */
window.TOUR = {
  goal: "Assemble no-code Android and web apps from interchangeable assets, the same look and behaviour on both, aiming at about five minutes start to finish, wired to a data server like axHub.",
  goalShort: "No-code Android and web apps, from interchangeable assets that look and behave the same, aiming at about five minutes, wired to a data server like axHub.",
  urls: [
    { name: "Dev Console", url: "https://console.amberxai.com", note: "AXF web console and build engine" },
    { name: "Build Pilot", url: "https://pilot.amberxai.com", note: "the no-code app designer" },
    { name: "axHub", url: "https://axhub.amberxai.com", note: "connector hub, sign-in and data server" },
    { name: "axHub Apps page", url: "https://axhub.amberxai.com/apps", note: "Android app downloads (admins)" },
    { name: "Expense Tracker", url: "https://expenses.amberxai.com", note: "the ledger app" },
    { name: "AXF demo site", url: "https://axf.amberxai.com", note: "a bare AXF app" },
    { name: "AmberX AI Studio", url: "https://studio.amberxai.com", note: "studioX, shares the Expense data volume" },
    { name: "This tour", url: "https://tour.amberxai.com", note: "once deployed on Coolify" },
    { name: "console.amberxai.com/mcp", url: "", note: "MCP endpoint, token needed" },
    { name: "axhub.amberxai.com/mcp", url: "", note: "MCP endpoint, token needed" }
  ],
  chapters: [
    /* 1 */ {
      id: "goal", title: "The goal", short: "Why it all exists",
      goal: "Everything in this tour exists to serve one goal. Here it is.",
      scenes: [
        { h: "No-code apps, Android and web", caps: [
            "The goal: assemble no-code Android apps and web apps.",
            "From building blocks that are compatible, integrable and interchangeable.",
            "They should look and behave the same on Android and on the web.",
            "The target is a quick start-to-finish app, in about five minutes.",
            "And it should plug into a data server, like axHub."],
          v: { t: "cards", items: [
            { n: "1", h: "Assemble, don't code", b: "No-code Android apps and web apps" },
            { n: "2", h: "Interchangeable assets", b: "Compatible and integrable building blocks" },
            { n: "3", h: "Same look, same behaviour", b: "On Android and on the web" },
            { n: "4", h: "About 5 minutes", b: "The target, start to finish", st: "target" },
            { n: "5", h: "A data server", b: "Integrates with something like axHub" } ] } },
        { h: "What already serves it", caps: [
            "AXF makes every UI piece a hot-swappable JSON asset, on both ports.",
            "Build Pilot assembles an app from them; the console builds it.",
            "axHub's data API holds the shared look every developer app follows."],
          v: { t: "flow", nodes: [
            { id: "a", l: "AXF assets (asset@1)", s: "same on web and Android", k: "amber", row: 0 },
            { id: "b", l: "Build Pilot", s: "no-code assembler", k: "amber", row: 1 },
            { id: "c", l: "Dev Console", s: "build engine", k: "amber", row: 2 },
            { id: "d", l: "axHub data API", s: "shared appearance document", k: "hub", row: 3, c: 2 } ],
            edges: [["a", "b", "", {}], ["b", "c", "", {}], ["c", "d", "", { c: 2 }]] } },
        { h: "Honest status", caps: [
            "The asset model and the Android path exist today. The five minutes is a target, not measured.",
            "Web stacks in Pilot and a no-code asset designer are coming."],
          v: { t: "cards", items: [
            { h: "Asset model on web + Android", b: "AXF, built", st: "live" },
            { h: "Android apps in Build Pilot", b: "Android is the ready stack", st: "live" },
            { h: "Shared look on axHub", b: "appearance document, built", st: "live" },
            { h: "Web app stacks in Pilot", b: "Placeholders today", st: "coming", c: 1 },
            { h: "No-code Asset Designer", b: "On the pending list", st: "coming", c: 1 },
            { h: "Five-minute app", b: "A goal, not measured", st: "target", c: 1 } ] } }
      ]
    },
    /* 2 */ {
      id: "map", title: "The cast", short: "Everything on one map",
      goal: "One map of every piece, so you can see what serves the goal.",
      scenes: [
        { h: "Phone, VPS and apps", caps: [
            "Brett works from his Android phone, a Galaxy S26 Ultra.",
            "Moshi, a mosh client, reaches the Hostinger VPS, where Claude Code runs.",
            "Coolify and its Traefik proxy serve the apps over HTTPS.",
            "GitHub holds the code and runs the builds. Hostinger's API is reached through axHub."],
          v: { t: "flow", nodes: [
            { id: "ph", l: "Android phone", s: "Galaxy S26 Ultra", k: "me", x: 180, y: 30, w: 170, c: 0 },
            { id: "mo", l: "Moshi", s: "mosh session", k: "ext", x: 180, y: 100, w: 170, c: 1 },
            { id: "vps", l: "Hostinger VPS", s: "Claude Code runs here", k: "infra", x: 180, y: 176, w: 300, c: 1 },
            { id: "co", l: "Coolify", s: "Traefik proxy", k: "infra", x: 180, y: 262, w: 108, c: 2 },
            { id: "gh", l: "GitHub", s: "repos, Actions", k: "ext", x: 62, y: 262, w: 108, c: 3 },
            { id: "ha", l: "Hostinger API", s: "via axHub", k: "ext", x: 298, y: 262, w: 108, c: 3 },
            { id: "a1", l: "Console", k: "amber", x: 51, y: 352, w: 76, c: 2 },
            { id: "a2", l: "Pilot", k: "amber", x: 137, y: 352, w: 76, c: 2 },
            { id: "a3", l: "axHub", k: "hub", x: 223, y: 352, w: 76, c: 2 },
            { id: "a4", l: "Expenses", k: "amber", x: 309, y: 352, w: 76, c: 2 } ],
            edges: [["ph", "mo", "", { c: 0 }], ["mo", "vps", "", { c: 1 }], ["vps", "co", "", { c: 2 }], ["vps", "gh", "", { c: 3, bi: 1 }], ["vps", "ha", "", { c: 3 }],
              ["co", "a1", "", { c: 2 }], ["co", "a2", "", { c: 2 }], ["co", "a3", "", { c: 2 }], ["co", "a4", "", { c: 2 }]], vb: 400 } },
        { h: "A subdomain for each app", caps: [
            "Each app lives on its own amberxai.com subdomain.",
            "Console, Pilot and axHub are the developer tools.",
            "Expenses is a finished app, and the demo is a bare AXF app."],
          v: { t: "cards", items: [
            { h: "console.amberxai.com", b: "Dev Console", st: "live" },
            { h: "pilot.amberxai.com", b: "Build Pilot", st: "live" },
            { h: "axhub.amberxai.com", b: "axHub", st: "live" },
            { h: "expenses.amberxai.com", b: "Expense Tracker", st: "live", c: 2 },
            { h: "axf.amberxai.com", b: "AXF demo site", st: "live", c: 2 },
            { h: "tour.amberxai.com", b: "This tour, on Coolify", st: "planned", c: 2 } ] } },
        { h: "Three tools, one loop", caps: [
            "Three tools carry the load: Build Pilot, the Dev Console and axHub.",
            "Pilot designs, the console builds, and axHub connects and guards."],
          v: { t: "flow", nodes: [
            { id: "p", l: "Build Pilot", s: "designs", k: "amber", x: 180, y: 50, w: 170 },
            { id: "c", l: "Dev Console", s: "builds", k: "amber", x: 85, y: 200, w: 150, c: 1 },
            { id: "h", l: "axHub", s: "connects, guards", k: "hub", x: 275, y: 200, w: 150, c: 1 } ],
            edges: [["p", "c", "build request", { c: 0 }], ["c", "h", "apps", { c: 1 }], ["h", "p", "look + sign-in", { c: 1 }]], vb: 270 } }
      ]
    },
    /* 3 */ {
      id: "axf", title: "AmberX AXF", short: "The framework of assets",
      goal: "AXF supplies the interchangeable assets that make one look work everywhere.",
      scenes: [
        { h: "Everything visible is an asset", caps: [
            "In AXF, every visible piece is a JSON asset in one format, asset at-1.",
            "Themes, layouts, menus, toolbars, dialogs, buttons, sliders and access policies.",
            "39 starter assets ship with it, and any AXF app can load another app's assets."],
          v: { t: "cards", items: [
            { h: "Themes + layouts", b: "color, style, grid" },
            { h: "Menus + toolbars", b: "app menu, nav, context menus" },
            { h: "Dialogs + popups", b: "chrome that swaps at runtime" },
            { h: "Controls", b: "buttons, sliders, containers" },
            { h: "Access policy", b: "who may swap or see what", c: 1 },
            { h: "39 starter assets", b: "ready to use", st: "built", c: 2 } ] } },
        { h: "Two ports, one design", caps: [
            "The web port uses TypeScript engines and React.",
            "The Android port is Kotlin and Compose, with a pure-Kotlin kernel.",
            "Shared test fixtures keep both engines compatible, so assets behave alike."],
          v: { t: "flow", nodes: [
            { id: "as", l: "asset@1 (JSON)", s: "theme, layout, menu, toolbar...", k: "amber", row: 0 },
            { id: "w", l: "Web port", s: "TypeScript + React", k: "amber", row: 1, c: 0 },
            { id: "an", l: "Android port", s: "Kotlin + Compose", k: "amber", row: 1, c: 1 },
            { id: "fx", l: "Conformance fixtures", s: "same behaviour", k: "infra", row: 2, c: 2 } ],
            edges: [["as", "w", "", { c: 0 }], ["as", "an", "", { c: 1 }], ["w", "fx", "", { c: 2 }], ["an", "fx", "", { c: 2 }]] } },
        { h: "Built, coming, planned", caps: [
            "Built today: a build engine and CLI, the Android kernel and modules, and the console.",
            "The tracker counts 187 features built, 13 partial, 140 placeholders and 71 planned.",
            "Coming: a no-code Asset Designer, an Asset Browser, and ten or more templates per type.",
            "Planned libraries include media, location, files, charts and notifications."],
          v: { t: "cards", items: [
            { h: "Build engine + CLI", b: "axf init, validate, new-asset", st: "live" },
            { h: "Android kernel + modules", b: "pure Kotlin kernel", st: "built" },
            { h: "Asset Designer", b: "no-code editors for menus, toolbars, themes", st: "coming", c: 2 },
            { h: "Asset Browser + templates", b: "10+ templates per type", st: "coming", c: 2 },
            { h: "More libraries", b: "media, location, files, charts", st: "planned", c: 3 } ] } }
      ]
    },
    /* 4 */ {
      id: "console", title: "Dev Console", short: "The build engine",
      goal: "The console is the build engine behind every no-code app.",
      scenes: [
        { h: "console.amberxai.com", caps: [
            "The Dev Console is AXF's own web app, live at console.amberxai.com.",
            "A React interface, a Python API, and the build engine behind it.",
            "It also serves an MCP endpoint, so Claude can drive it."],
          v: { t: "flow", nodes: [
            { id: "ui", l: "Console UI", s: "React + TypeScript", k: "amber", x: 180, y: 28, w: 230, c: 0 },
            { id: "api", l: "Python API", s: "FastAPI", k: "amber", x: 180, y: 100, w: 230, c: 1 },
            { id: "en", l: "Build engine", s: "init, validate", k: "amber", x: 90, y: 185, w: 160, c: 1 },
            { id: "mcp", l: "MCP server", s: "/mcp", k: "amber", x: 270, y: 185, w: 160, c: 2 },
            { id: "cl", l: "Claude", s: "drives it by token", k: "ext", x: 270, y: 265, w: 160, c: 2 } ],
            edges: [["ui", "api", "", { c: 0 }], ["api", "en", "", { c: 1 }], ["api", "mcp", "", { c: 2 }], ["mcp", "cl", "", { c: 2, bi: 1 }]], vb: 300 } },
        { h: "Features are plugins", caps: [
            "Its features are plugins that install and uninstall cleanly.",
            "An AI assistant, agent manager, terminal, snapshots, theme manager and project wizard.",
            "A banner shows axHub approvals that are waiting for you."],
          v: { t: "cards", items: [
            { h: "AI assistant + agents", b: "Claude-backed, live sessions", st: "live" },
            { h: "Terminal", b: "container shell in a floating window", st: "live" },
            { h: "Snapshot manager", b: "take, diff, restore", st: "live" },
            { h: "Theme manager", b: "roll colour and style themes", st: "live" },
            { h: "Project wizard", b: "new project with manifest", st: "live", c: 1 },
            { h: "Approvals banner", b: "axHub calls waiting for you", st: "live", c: 2 } ] } },
        { h: "Guarded, and still growing", caps: [
            "It sits behind axHub's sign-in wall. Machines use the console token.",
            "Coming: Asset Designer and Asset Browser plugins.",
            "Android tabs for Console and Pilot are on hold. Brett will finish them later."],
          v: { t: "cards", items: [
            { h: "axHub sign-in wall", b: "hub admins only", st: "live" },
            { h: "Android console showcase", b: "ai.amberx.axf.console", st: "built" },
            { h: "Asset Designer plugin", b: "no-code editors", st: "coming", c: 1 },
            { h: "Asset Browser plugin", b: "browse, preview, hot-swap", st: "coming", c: 1 },
            { h: "Native Android Pilot + hub tabs", b: "Brett will finish later", st: "hold", c: 2 } ] } }
      ]
    },
    /* 5 */ {
      id: "pilot", title: "Build Pilot", short: "The no-code assembler",
      goal: "Pilot is the no-code assembler: pick, review, build.",
      scenes: [
        { h: "Pick a stack, get the steps", caps: [
            "Build Pilot is an app designer driven entirely by plugins.",
            "Pick a stack, and that stack's plugins become the steps.",
            "The finished design is built by the console's engine. Android is the ready stack; the web stacks are coming."],
          v: { t: "flow", nodes: [
            { id: "s", l: "Pick a stack", s: "Android is ready", k: "amber", row: 0, c: 1 },
            { id: "p", l: "Plugins are the steps", s: "setup, features, look, build", k: "amber", row: 1, c: 1 },
            { id: "r", l: "One build request", s: "checked and composed", k: "amber", row: 2, c: 1 },
            { id: "e", l: "Dev Console builds it", s: "init + validate", k: "amber", row: 3, c: 2 },
            { id: "w", l: "Web React, Next, Python", s: "placeholders", k: "amber", st: "coming", row: 4, link: false, c: 2 } ] } },
        { h: "What you can do in it", caps: [
            "Choose boilerplates, modules and libraries, with a live phone preview.",
            "An agent can assemble the parts, or you pick by hand. Both pass the same checks.",
            "Custom features can be asked of Claude, and every call is metered."],
          v: { t: "cards", items: [
            { h: "Boilerplate browser", b: "screens in a phone frame", st: "live" },
            { h: "Features", b: "dependency highlights, auto pick", st: "live" },
            { h: "Look", b: "banner + toolbar designers", st: "live" },
            { h: "Agent or manual assembly", b: "same checked gate", st: "live", c: 1 },
            { h: "Custom features with Claude", b: "metered, no rates set yet", st: "live", c: 2 },
            { h: "Build APK", b: "via the console + GitHub Actions", st: "live", c: 2 } ] } },
        { h: "Looks come from axHub", caps: [
            "Pilot follows the shared look stored on axHub. If the hub is down, it waits.",
            "Coming: a rebuilt plugin contract, and plugins for other stacks.",
            "Pilot's own Android version comes later, and that work is on hold."],
          v: { t: "cards", items: [
            { h: "Developer app on axHub", b: "reads shared appearance, live", st: "live" },
            { h: "Plugin catalog", b: "install plugins shared on axHub", st: "live" },
            { h: "Plugin contract rebuild", b: "on the pending list", st: "coming", c: 1 },
            { h: "Plugins for other stacks", b: "web and Python", st: "coming", c: 1 },
            { h: "Build Pilot for Android", b: "later, on hold", st: "hold", c: 2 } ] } }
      ]
    },
    /* 6 */ {
      id: "axhub", title: "axHub", short: "The connector hub and data server",
      goal: "axHub is the data server, and the guarded door between Claude and everything else.",
      scenes: [
        { h: "One MCP server for Claude", caps: [
            "To Claude, axHub is one remote MCP server.",
            "Behind it: the VPS shell, GitHub and Hostinger are registered. Hostinger is read-only and waits for its API token.",
            "Registering the Dev Console is the next step."],
          v: { t: "flow", nodes: [
            { id: "cl", l: "Claude (MCP)", s: "five meta-tools", k: "ext", row: 0, c: 0 },
            { id: "hub", l: "axHub", s: "policy, vault, jobs, audit", k: "hub", row: 1, c: 0 },
            { id: "v", l: "VPS shell", k: "infra", row: 2, c: 1 },
            { id: "g", l: "GitHub", k: "ext", row: 2, c: 1 },
            { id: "h", l: "Hostinger", k: "ext", row: 2, c: 1 },
            { id: "c", l: "Console", k: "amber", st: "coming", row: 2, c: 2 } ] } },
        { h: "Safe by design", caps: [
            "Every call passes a policy gate: allow, confirm or deny.",
            "Risky calls wait for your approval, shown in full, and run once.",
            "Secrets live in an encrypted, write-only vault. Claude never sees them."],
          v: { t: "flow", nodes: [
            { id: "1", l: "Call arrives", s: "tool + arguments", k: "ext", row: 0, c: 0 },
            { id: "2", l: "Policy gate", s: "allow, confirm, deny", k: "hub", row: 1, c: 0 },
            { id: "3", l: "Approval", s: "out-of-band, single use", k: "me", row: 2, c: 1 },
            { id: "4", l: "Connector + vault", s: "credential added inside the hub", k: "hub", row: 3, c: 2 },
            { id: "5", l: "Result + audit entry", s: "no secrets", k: "hub", row: 4, c: 2 } ] } },
        { h: "More than a door", caps: [
            "axHub also signs people in, and walls other apps behind that sign-in.",
            "It serves an Apps page, a projects tree for Claude's memory, and a data API.",
            "Slow calls become jobs you can poll or cancel. Coming: an admin API with OAuth and a mobile config app."],
          v: { t: "cards", items: [
            { h: "Sign-in + the wall", b: "admins, users, permissions", st: "live" },
            { h: "Apps page", b: "Android downloads", st: "live", c: 1 },
            { h: "Projects tree", b: "Claude's rules and memory", st: "live", c: 1 },
            { h: "Data API", b: "JSON documents with ETags", st: "live", c: 1 },
            { h: "Jobs", b: "after 25 seconds", st: "live", c: 2 },
            { h: "Admin API + OAuth 2.1", b: "roadmap step 4", st: "coming", c: 2 },
            { h: "Mobile config UI (PWA)", b: "roadmap step 5", st: "coming", c: 2 } ] } }
      ]
    },
    /* 7 */ {
      id: "together", title: "Working together", short: "Pilot + Console + axHub",
      goal: "This is the assembly line: a design in Pilot becomes an app, and the look stays shared.",
      scenes: [
        { h: "From design to APK", caps: [
            "In Pilot, Build APK sends the app folder to the console.",
            "The console pushes a pilot branch to GitHub and starts an Actions workflow.",
            "Actions compiles the APK, and Pilot offers the download."],
          v: { t: "flow", nodes: [
            { id: "p", l: "Build Pilot", s: "Build APK", k: "amber", row: 0, c: 0 },
            { id: "c", l: "Dev Console", s: "publishes branch pilot/<name>", k: "amber", row: 1, c: 1 },
            { id: "g", l: "GitHub Actions", s: "pilot-apk.yml compiles", k: "ext", row: 2, c: 1 },
            { id: "a", l: "APK artifact", s: "Pilot polls, then Download", k: "amber", row: 3, c: 2 } ] } },
        { h: "Main builds reach the hub", caps: [
            "CI builds apps on main, and the console files their APKs in a catalog.",
            "axHub's Apps page lists them for download on the phone."],
          v: { t: "flow", nodes: [
            { id: "m", l: "Push to main", k: "me", row: 0, c: 0 },
            { id: "g", l: "GitHub Actions", s: "android.yml builds every app", k: "ext", row: 1, c: 0 },
            { id: "c", l: "Dev Console", s: "files APKs in the catalog", k: "amber", row: 2, c: 0 },
            { id: "h", l: "axHub /apps", s: "download buttons", k: "hub", row: 3, c: 1 },
            { id: "ph", l: "Phone", s: "AXHub app Apps tab", k: "me", row: 4, c: 1 } ] } },
        { h: "Approvals to your phone", caps: [
            "A dev app or Claude calls a guarded tool. axHub holds it: confirmation required, with a one-tap link.",
            "Waiting approvals appear in axHub's feed, readable only by a signed-in admin.",
            "The AXHub phone app checks that feed every 30 seconds. The console banner, every 5.",
            "You approve on the hub's own page. The caller retries, and the call runs once."],
          v: { t: "flow", nodes: [
            { id: "c", l: "Dev app or Claude", s: "calls vps.run, a GitHub write", k: "ext", row: 0, c: 0 },
            { id: "g", l: "axHub policy gate", s: "confirmation_required + link", k: "hub", row: 1, c: 0 },
            { id: "f", l: "Approvals feed", s: "/auth/admin/approvals.json", k: "hub", row: 2, c: 1 },
            { id: "p", l: "AXHub app", s: "every 30 s", k: "me", row: 3, c: 2 },
            { id: "b", l: "Console banner", s: "every 5 s", k: "amber", row: 3, c: 2 },
            { id: "a", l: "You approve", s: "on the hub's page", k: "me", row: 4, c: 3 },
            { id: "r", l: "Call runs once", s: "retry with the id", k: "hub", row: 5, c: 3 } ],
            edges: [["c", "g", "call", { c: 0 }], ["g", "f", "waiting", { c: 1 }], ["f", "p", "", { c: 2 }], ["f", "b", "", { c: 2 }], ["p", "a", "", { c: 3 }], ["b", "a", "", { c: 3 }], ["a", "r", "approved", { c: 3 }]] } },
        { h: "What the alert does", caps: [
            "One high-priority alert per approval. The lock screen only says Approval waiting.",
            "Tapping opens it inside the app, behind a fingerprint lock.",
            "In the console, each new request opens by itself in a sandboxed frame.",
            "Approvals are single use, expire in 30 minutes, and Claude can never approve its own call.",
            "Today the apps poll the feed. True server push is coming, not built yet."],
          v: { t: "cards", items: [
            { h: "Phone alert", b: "full screen when allowed", st: "live" },
            { h: "Fingerprint app lock", b: "signed out: checks every 5 min", st: "live", c: 1 },
            { h: "Console banner", b: "opens requests in a sandboxed frame", st: "live", c: 2 },
            { h: "Single use, 30-minute expiry", b: "bound to caller, tool, args", st: "live", c: 3 },
            { h: "Fallback", b: "axhub confirmations approve <id> in Coolify", st: "live", c: 3 },
            { h: "Server push", b: "placeholder axhub.push", st: "coming", c: 4 } ] } },
        { h: "One look everywhere", caps: [
            "A developer app saves its look to axHub's data API.",
            "That one document, appearance.json, is read by every developer app, live.",
            "So Console, Pilot, the phone app and axHub's pages stay in sync."],
          v: { t: "flow", nodes: [
            { id: "d", l: "appearance.json", s: "axHub data API", k: "hub", x: 180, y: 150, w: 170, c: 0 },
            { id: "c", l: "Console", s: "web + Android", k: "amber", x: 70, y: 40, w: 118, c: 1 },
            { id: "p", l: "Build Pilot", k: "amber", x: 290, y: 40, w: 118, c: 1 },
            { id: "a", l: "AXHub app", k: "amber", x: 70, y: 260, w: 118, c: 2 },
            { id: "w", l: "axHub pages", k: "hub", x: 290, y: 260, w: 118, c: 2 } ],
            edges: [["c", "d", "", { c: 0, bi: 1 }], ["p", "d", "", { c: 1, bi: 1 }], ["a", "d", "", { c: 2, bi: 1 }], ["w", "d", "", { c: 2, bi: 1 }]], vb: 300 } },
        { h: "The sign-in wall", caps: [
            "Console and Pilot sit behind axHub's sign-in wall.",
            "Traefik asks axHub if the browser has a signed-in admin session.",
            "Machines with a bearer token pass on API and MCP routes."],
          v: { t: "flow", nodes: [
            { id: "b", l: "Browser", k: "me", row: 0, c: 0 },
            { id: "t", l: "Traefik", s: "forwardAuth", k: "infra", row: 1, c: 1 },
            { id: "v", l: "axHub /auth/verify", s: "signed-in admin?", k: "hub", row: 2, c: 1 },
            { id: "a", l: "Console or Pilot", s: "gets signed headers", k: "amber", row: 3, c: 2 } ],
            edges: [["b", "t", "", { c: 0 }], ["t", "v", "ask", { c: 1 }], ["v", "a", "pass", { c: 2 }]] } }
      ]
    },
    /* 8 */ {
      id: "phone", title: "Phone to VPS", short: "Moshi, Claude Code, axHub MCP",
      goal: "Brett can run the whole assembly line from his phone.",
      scenes: [
        { h: "Phone, Moshi, Claude Code", caps: [
            "From the phone, Moshi opens a mosh session into the VPS.",
            "Claude Code runs there, and reaches axHub as one MCP server.",
            "Through axHub it can use the VPS shell, GitHub and Hostinger.",
            "The Dev Console joins as the next registered service."],
          v: { t: "flow", nodes: [
            { id: "ph", l: "Android phone", k: "me", row: 0, c: 0 },
            { id: "mo", l: "Moshi (mosh)", k: "ext", row: 1, c: 0 },
            { id: "cc", l: "VPS: Claude Code", k: "infra", row: 2, c: 1 },
            { id: "hub", l: "axHub MCP", k: "hub", row: 3, c: 1 },
            { id: "s1", l: "VPS shell", k: "infra", row: 4, c: 2 },
            { id: "s2", l: "GitHub", k: "ext", row: 4, c: 2 },
            { id: "s3", l: "Hostinger", k: "ext", row: 4, c: 2 },
            { id: "s4", l: "Console", k: "amber", st: "coming", row: 4, c: 3 } ] } },
        { h: "An approval, phone and back", caps: [
            "A risky call stops at axHub with confirmation required.",
            "The AXHub phone app sees it in the hub's feed and raises an alert.",
            "You approve on the hub's page. Claude retries, and it runs once."],
          v: { t: "flow", nodes: [
            { id: "c", l: "Claude Code", s: "calls vps.run", k: "ext", row: 0, c: 0 },
            { id: "h", l: "axHub", s: "confirmation_required", k: "hub", row: 1, c: 0 },
            { id: "p", l: "Phone alert", s: "AXHub app, approvals", k: "me", row: 2, c: 1 },
            { id: "a", l: "You approve", s: "on the hub page", k: "me", row: 3, c: 2 },
            { id: "r", l: "Runs once", s: "same tool, same args", k: "hub", row: 4, c: 2 } ],
            edges: [["c", "h", "", { c: 0 }], ["h", "p", "", { c: 1 }], ["p", "a", "", { c: 2 }], ["a", "h", "", { c: 2, side: 1 }], ["h", "r", "", { c: 2 }]] } },
        { h: "Memory and ways in", caps: [
            "A sync hook loads Brett's rules and memory from axHub at session start.",
            "A launcher asks whether to use a Claude plan or an API key.",
            "Other routes in: a claude.ai connector, cloud sessions, or a terminal."],
          v: { t: "cards", items: [
            { h: "claude-sync", b: "rules + memory via the projects tree", st: "live" },
            { h: "claude-pick launcher", b: "plan or API key", st: "live", c: 1 },
            { h: "claude.ai connector", b: "bearer header; OAuth is coming", st: "live", c: 2 },
            { h: "Cloud sessions + terminal", b: "same MCP endpoint", st: "live", c: 2 },
            { h: "OAuth 2.1 sign-in", b: "roadmap step 4", st: "coming", c: 2 } ] } }
      ]
    },
    /* 9 */ {
      id: "apps", title: "The apps", short: "What runs on it",
      goal: "The apps behind the goal: some assembled on AXF, some standalone.",
      scenes: [
        { h: "Expense Tracker", caps: [
            "Expense Tracker is a live ledger app at expenses.amberxai.com.",
            "Tabs, grid and tree views, imports that skip duplicates, paydays and reports.",
            "A Claude assistant can read statement images. It has its own sign-in."],
          v: { t: "cards", items: [
            { h: "Ledger", b: "tabs, grid and tree views", st: "live" },
            { h: "Imports", b: "bank transactions, duplicates skipped", st: "live" },
            { h: "Paydays + reports", b: "weekday paydays, frequency switch", st: "live", c: 1 },
            { h: "Dupe finder", b: "Actions > Dupe", st: "live", c: 1 },
            { h: "Claude assistant", b: "API or Claude Code CLI", st: "live", c: 2 },
            { h: "Statement-image import", b: "several images at once", st: "live", c: 2 } ] } },
        { h: "On the phone", caps: [
            "AXHub brings approvals and the Apps page to the phone.",
            "Patches shows Console, Pilot and axHub as three tabs under one banner.",
            "Voice Vault is a voice-unlocked password vault. AXHub's admin screens are still placeholders."],
          v: { t: "cards", items: [
            { h: "AXHub app", b: "approval alerts, Apps tab", st: "built" },
            { h: "Patches", b: "one banner, three tabs", st: "built", c: 1 },
            { h: "Voice Vault", b: "voice unlock, offline", st: "built", c: 2 },
            { h: "AXHub admin screens", b: "services, jobs, audit, users", st: "planned", c: 2 } ] } },
        { h: "Demo, Studio, and an old line", caps: [
            "The demo at axf.amberxai.com is a bare AXF app, straight from axf init.",
            "AmberX AI Studio is a separate Next.js line that shares Expense's data.",
            "An older PyQt6 desktop line is dormant."],
          v: { t: "cards", items: [
            { h: "axf.amberxai.com", b: "untouched axf init output", st: "live" },
            { h: "studio.amberxai.com", b: "studioX, shares the data volume", st: "live", c: 1 },
            { h: "AmberX (PyQt6)", b: "earlier desktop line", st: "dormant", c: 2 } ] } }
      ]
    },
    /* 10 */ {
      id: "deploy", title: "Push to live", short: "GitHub, Coolify, Traefik, Hostinger",
      goal: "Shipping is automatic, so a finished app reaches people fast.",
      scenes: [
        { h: "Push to main, site goes live", caps: [
            "Push to main, and GitHub Actions starts the deploy workflow.",
            "It reaches the VPS with a restricted key that can only ping or deploy expense.",
            "The VPS builds the container, Traefik serves it, and Actions checks the login page returns 200."],
          v: { t: "flow", nodes: [
            { id: "1", l: "git push to main", k: "me", row: 0, c: 0 },
            { id: "2", l: "GitHub Actions", s: "deploy.yml", k: "ext", row: 1, c: 0 },
            { id: "3", l: "Restricted SSH key", s: "ping, deploy expense", k: "ext", row: 2, c: 1 },
            { id: "4", l: "VPS script", s: "builds the container", k: "infra", row: 3, c: 2 },
            { id: "5", l: "Coolify + Traefik", s: "HTTPS routing", k: "infra", row: 4, c: 2 },
            { id: "6", l: "expenses.amberxai.com", s: "login returns 200", k: "amber", row: 5, c: 2 } ] } },
        { h: "Each app, its own route", caps: [
            "The demo builds in Actions, and the VPS pulls it every two minutes.",
            "Console and Pilot update themselves from GitHub main every five minutes.",
            "axHub is a Coolify app built from its Dockerfile, with volumes for data and projects."],
          v: { t: "cards", items: [
            { h: "Demo site", b: "Actions builds, VPS pulls every 2 min", st: "live" },
            { h: "Console + Pilot", b: "install scripts, 5-minute auto-update", st: "live", c: 1 },
            { h: "axHub", b: "Coolify, Dockerfile, port 8080", st: "live", c: 2 },
            { h: "Android apps", b: "GitHub Actions is the compiler", st: "live", c: 2 } ] } },
        { h: "Hostinger and Traefik", caps: [
            "A subdomain is an A record in Hostinger's DNS, pointing at the VPS.",
            "Coolify's Traefik owns ports 80 and 443, and gives each app HTTPS.",
            "This tour is one more small Coolify app: nginx serving static files."],
          v: { t: "flow", nodes: [
            { id: "d", l: "Hostinger DNS", s: "A record per subdomain", k: "ext", row: 0, c: 0 },
            { id: "v", l: "Hostinger VPS", k: "infra", row: 1, c: 0 },
            { id: "t", l: "Coolify + Traefik", s: "owns ports 80 and 443", k: "infra", row: 2, c: 1 },
            { id: "a", l: "Console", k: "amber", row: 3, c: 1 },
            { id: "b", l: "Pilot", k: "amber", row: 3, c: 1 },
            { id: "x", l: "axHub", k: "hub", row: 3, c: 1 },
            { id: "tour", l: "Tour", k: "amber", st: "planned", row: 3, c: 2 } ] } }
      ]
    },
    /* 11 */ {
      id: "future", title: "Where it's all going", short: "Roadmap and every live URL",
      goal: "Here is what is still ahead on the way to the five-minute goal.",
      scenes: [
        { h: "Closer to the goal", caps: [
            "Closest to the goal: a no-code Asset Designer and an Asset Browser.",
            "Ten or more templates per type, and more stacks in Pilot.",
            "A port engine could bring existing apps onto AXF."],
          v: { t: "cards", items: [
            { h: "Asset Designer", b: "no-code editors", st: "coming" },
            { h: "Asset Browser", b: "browse, preview, hot-swap", st: "coming" },
            { h: "Asset templates", b: "10+ per type", st: "coming", c: 1 },
            { h: "Web + Python stacks in Pilot", b: "placeholders today", st: "coming", c: 1 },
            { h: "Port engine", b: "bring a non-AXF app onto AXF", st: "planned", c: 2 } ] } },
        { h: "axHub ahead", caps: [
            "On axHub: an admin API with OAuth, and a mobile config app.",
            "Push for approvals, and device agents over AXPP.",
            "Later: plugins, an agent host, workflows, multi-user, Postgres."],
          v: { t: "cards", items: [
            { h: "Admin API + OAuth 2.1", b: "step 4", st: "coming" },
            { h: "Mobile config UI (PWA)", b: "step 5", st: "coming" },
            { h: "Push for approvals", b: "not built yet", st: "coming", c: 1 },
            { h: "Device agent (AXPP)", b: "step 6", st: "planned", c: 1 },
            { h: "Plugin API, agent host", b: "steps 8 and later", st: "planned", c: 2 },
            { h: "Workflows, multi-user, Postgres", b: "step 9", st: "planned", c: 2 } ] } },
        { h: "AXF and the apps", caps: [
            "In AXF: web interop contracts, lib-mcp server half, axf-link, a hub admin tab.",
            "Native Android Console and Pilot are on hold, until Brett finishes them."],
          v: { t: "cards", items: [
            { h: "Web interop contracts", b: "port from the Android kernel", st: "planned" },
            { h: "lib-mcp server half, axf-link", b: "AXF to AXF", st: "planned" },
            { h: "Hub admin tab in the console", b: "lib-hub-admin", st: "planned" },
            { h: "Native Android Console + Pilot", b: "Brett will finish later", st: "hold", c: 1 } ] } },
        { h: "The goal, and every live URL", caps: [
            "The goal again: no-code Android and web apps from interchangeable assets.",
            "Same look and behaviour everywhere, aiming at five minutes, wired to a data server.",
            "Live means live today. Coming, planned and on hold are still ahead."],
          v: { t: "urls" }, end: true }
      ]
    }
  ]
};
