// The narrated walkthrough: chapters of scenes. Each scene has the words the voice says (`say`) and what the
// browser does while it says them (`act`). Scenes only open and show things; the one write is creating the
// empty "Tour demo" project in Build Pilot (Brett's OK, Oct 22 2026; reused if it exists, never built). Facts come from the CLAUDE.md files of AmberX-AXF,
// Build-Pilot and axHub; keep them in step when those change.

const HUB = "https://axhub.amberxai.com";
const CONSOLE = "https://console.amberxai.com";
const PILOT = "https://pilot.amberxai.com";

export const CHAPTERS = [
  {
    id: "purpose", title: "The purpose", start: PILOT,
    scenes: [
      { say: "This is a live walkthrough of the AmberX developer tools, recorded in a real browser on the real sites.", act: (h) => h.wait(500) },
      { say: "The purpose is simple. Build apps quickly, assembled by spec instead of written by hand.", act: (h) => h.point("text=Design an app") },
      { say: "You pick a stack, pick the features you want, and add pre-built libraries. When something does not exist yet, Claude can add it as a new feature.", act: (h) => h.point("text=Android") },
      { say: "Spec-driven, not code-driven. The AmberX build engine turns that spec into a working Android or web app, and every piece is an interchangeable asset that looks and behaves the same on each platform.", act: (h) => h.scroll(300) },
      { say: "Four parts make this work. The AmberX AXF framework, the Dev Console, Build Pilot, and axHub. We will go through every one of them.", act: (h) => h.scroll(-300) },
    ],
  },
  {
    id: "wall", title: "One sign-in for everything", start: null, signedOut: true,
    scenes: [
      { say: "Every developer app sits behind one sign-in, axHub's wall. Opening the Dev Console without a session sends you to axHub first.", act: (h) => h.go(CONSOLE) },
      { say: "Sign in once on axHub, and the console, Build Pilot and the hub's own pages all open. Machines keep using their own tokens; browsers use this session.", act: (h) => h.signIn() },
      { say: "Here we are, straight back in the Dev Console.", act: (h) => h.wait(1500) },
    ],
  },
  {
    id: "console", title: "The Dev Console", start: CONSOLE, banners: "minimized",
    scenes: [
      { say: "The Dev Console is the control room for the AmberX framework. It runs the build engine, the plan and the build queue.", act: (h) => h.point("text=Plan") },
      { say: "Across the top are live status pieces, each one a plugin: the Claude badge for the AI connection, the main build status, and the alerts bell.", act: (h) => h.point("button:has-text('Alerts')") },
      { say: "Banners report what needs attention: codebase changes still in progress, and setup issues found by the systems check, each with a fix button.", act: (h) => h.point(".fx-banner-frame") },
      { say: "The home page shows the plan, the build queue, coverage, and the open project.", act: (h) => h.scroll(400) },
      { say: "The application menu reaches everything: Console, Builds, Framework, Plugins, Apps, View and Help.", act: (h) => h.scroll(-400).then(() => h.openMenu("Console")) },
      { say: "From the Console menu you can see approvals waiting on axHub, ask the AI assistant, or open a shell terminal on the server.", act: (h) => h.wait(2500).then(() => h.esc()) },
    ],
  },
  {
    id: "builds", title: "Builds, models and the pending list", start: CONSOLE,
    scenes: [
      { say: "The Builds menu is where work is tracked.", act: (h) => h.openMenu("Builds") },
      { say: "Pending builds is the pending build list: work that is parked until the right model is available, or that can be built with Opus now.", act: (h) => h.menuItem("Pending builds") },
      { say: "Every item has a status, the model it is pinned to, the date it was added or built, notes and sub prompts. Before any build starts, this list is checked.", act: (h) => h.scroll(400) },
      { say: "The rule for models is simple. Fable for the deepest work, like kernel internals and cross-port contracts. Opus for everything else. Sonnet only when Opus is clearly not needed.", act: (h) => h.scroll(-400) },
      { say: "Fable rebuilds lists everything first built with Opus that is waiting for a Fable rebuild, with its branch, a differences report and a brief to copy.", act: (h) => h.menu("Builds", "Fable rebuilds") },
      { say: "Build manager puts everything still to build in one list, Building now shows what is running, and Built shows what each finished build cost and how long it took.", act: (h) => h.menu("Builds", "Built (cost + time)") },
      { say: "Codebase changes is the log of every change to the framework, and Main build shows the health of the main branch.", act: (h) => h.menu("Builds", "Codebase changes (log)") },
    ],
  },
  {
    id: "framework", title: "The AmberX AXF framework", start: PILOT, pre: (h) => h.view("Assets"),
    scenes: [
      { say: "Underneath it all is the AmberX AXF framework. Every piece of the interface is an asset: color themes, style themes, layouts, menus, toolbars, banners, buttons and more.", act: (h) => h.point("text=Color theme") },
      { say: "Assets are hot-swappable. Each slot has its options side by side, and swapping one changes the whole app live, with no rebuild.", act: (h) => h.scroll(500) },
      { say: "Style themes, layouts, menus and toolbars swap the same way. The same asset files run on the web port and the Android port, which is why apps look and behave the same on both.", act: (h) => h.scroll(700) },
      { say: "Under Framework, Standards holds the project rules. Every project carries a manifest, and nothing is loaded or compiled without a valid one.", act: (h) => h.go(CONSOLE).then(() => h.menu("Framework", "Standards", "Projects")) },
    ],
  },
  {
    id: "plugins", title: "Console plugins", start: CONSOLE,
    scenes: [
      { say: "Almost everything you have seen is a plugin. The Plugins menu lists them all.", act: (h) => h.openMenu("Plugins") },
      { say: "The Plugin Manager shows every installed plugin, its version, what it hooks into, and lets you switch plugins on and off.", act: (h) => h.menuItem("Plugin Manager") },
      { say: "New plugins install from the shared plugin catalog on axHub, checked before they are installed.", act: (h) => h.menu("Plugins", "Install from the catalog…") },
      { say: "The systems check tests the console's tokens, keys and connections: GitHub, the Anthropic API, Hostinger, Coolify and axHub.", act: (h) => h.menu("Plugins", "Systems check", "Systems check") },
      { say: "The theme manager rolls color, style and layout themes, with a token tree, locks and saved presets.", act: (h) => h.menu("Plugins", "Theme manager") },
      { say: "Snapshots take, compare and restore copies of a container's files, and a restore saves the current state first. Container access is the only part of the console allowed to reach other containers, through a locked-down proxy.", act: (h) => h.menu("Plugins", "Snapshots") },
      { say: "The AI assistant and the agent manager bring Claude into the console: chat, agents with personas, skills and tools, and live sessions.", act: (h) => h.menu("Plugins", "Agents", "Agent manager") },
      { say: "MCP servers connects the console to outside tools and calls them, with a confirm step for anything destructive. The feature assistant drafts new plan entries from a plain description.", act: (h) => h.menu("Plugins", "MCP servers", "MCP servers") },
      { say: "New project starts a project with a validated manifest from the start.", act: (h) => h.menu("Plugins", "New project") },
    ],
  },
  {
    id: "pilot-home", title: "Build Pilot: pick a stack", start: PILOT,
    scenes: [
      { say: "Now the heart of the purpose: Build Pilot, the no-code app designer.", act: (h) => h.point("text=Design an app") },
      { say: "Pick a stack. Android with Kotlin and Jetpack Compose is ready today. React, Next.js and Python desktop are planned.", act: (h) => h.point("text=Web (React)") },
      { say: "Each stack's plugins become the steps of the design. Build Pilot never writes app code itself. It composes a spec for the AmberX build engine.", act: (h) => h.point("text=Start Android project") },
      { say: "Let us start a demo project called Tour demo.", act: (h) => h.startDemoProject("Tour demo") },
    ],
  },
  {
    id: "pilot-design", title: "Build Pilot: assemble by spec", start: PILOT, pre: (h) => h.openDemoProject("Tour demo"),
    scenes: [
      { say: "App setup names the app and picks a boilerplate to start from. Every boilerplate shows its screens, features, modules and libraries before you choose.", act: (h) => h.scroll(300) },
      { say: "A live preview floats beside the designer and follows every choice as you make it.", act: (h) => h.scroll(-300) },
      { say: "Next, the look: a default asset for every slot, from color theme to toolbar. Use this look everywhere applies it to the developer apps too.", act: (h) => h.nextStep() },
      { say: "Features: framework modules and installable libraries, each with its own options.", act: (h) => h.nextStep() },
      { say: "Pick a module and everything it depends on is picked too and highlighted, so nothing is missing. Unpicking removes what is no longer needed.", act: (h) => h.scroll(400) },
      { say: "The feature manager offers two ways to assemble: the assembling agent, or manual mode with no AI at all. Both pass the same gate, checked against the engine's catalog.", act: (h) => h.nextStep() },
      { say: "Chrome pieces like the banner and toolbar have their own designers, with a live mock.", act: (h) => h.scroll(400) },
      { say: "Build options are the engine's switches.", act: (h) => h.nextStep() },
      { say: "Custom features: describe what you need, and Add with Claude turns it into checked steps, either existing parts or a new library proposal you approve before it is built.", act: (h) => h.nextStep() },
      { say: "The last step builds the app with the AmberX build engine, validates it, and can build an Android APK on GitHub Actions to download. We stop here: that is the five-minute path from spec to app.", act: (h) => h.nextStep() },
    ],
  },
  {
    id: "pilot-more", title: "Build Pilot: plugins, AI, assets and roles", start: PILOT,
    scenes: [
      { say: "Build Pilot is driven by plugins too. Each plugin lists the stacks it serves, and new ones install from the catalog.", act: (h) => h.view("Plugins") },
      { say: "The Assistant hosts Claude with your choice of provider, or you can work in manual mode.", act: (h) => h.view("Assistant") },
      { say: "Agents: the agent library with skills, personas, lingo, tools and workflows, and add-ons that extend them.", act: (h) => h.view("Agents") },
      { say: "Assets: every slot the framework offers, from themes and layouts to banners, clocks, search bars and badges, each one swappable.", act: (h) => h.view("Assets") },
      { say: "Roles: guest, user and admin, with a permission matrix you can try live.", act: (h) => h.view("Roles") },
      { say: "And settings for appearance, account, connections, the AI assistant and plugins.", act: (h) => h.view("Settings") },
    ],
  },
  {
    id: "axhub", title: "axHub: the connector hub", start: `${HUB}/auth/account`,
    scenes: [
      { say: "axHub is the connector hub. To Claude it is one MCP server. Behind it sit the VPS shell, GitHub, Hostinger, and the developer apps.", act: (h) => h.wait(1500) },
      { say: "Credentials live in an encrypted, write-only vault. Claude never sees them.", act: (h) => h.point("text=Change password") },
      { say: "Users holds the accounts and their permissions for the wall.", act: (h) => h.go(`${HUB}/auth/admin/users`) },
      { say: "Apps is the catalog of every AmberX app, with downloads for the Android builds.", act: (h) => h.go(`${HUB}/apps`) },
      { say: "Approvals: anything risky, like a shell command or a GitHub write, is held here until a person approves it. The AI can never approve its own call, and every approval works once and expires after thirty minutes.", act: (h) => h.go(`${HUB}/auth/admin/approvals`) },
      { say: "On the phone, the AXHub Android app checks this list every thirty seconds and raises an alert for each new approval. Tap it, unlock with your fingerprint, and approve on the hub's own page.", act: (h) => h.wait(2000) },
    ],
  },
  {
    id: "together", title: "How it fits together", start: CONSOLE,
    scenes: [
      { say: "The pieces work as one. The Apps menu opens Build Pilot and axHub as tabs inside the console.", act: (h) => h.openMenu("Apps").then(() => h.menuItem("axHub", 1500)) },
      { say: "The developer apps share one look, stored on axHub's data server. Change it in one app and the others follow, live.", act: (h) => h.esc().then(() => h.go(PILOT)).then(() => h.view("Assets")) },
      { say: "Build Pilot composes the spec, the console's build engine builds it, GitHub Actions makes the APK, and axHub's Apps page hands it to your phone.", act: (h) => h.go(`${HUB}/apps`) },
      { say: "And Claude reaches all of it through axHub, with a person approving anything that changes the world.", act: (h) => h.go(`${HUB}/auth/admin/approvals`) },
      { say: "Coming next: web stacks in Build Pilot, a no-code asset designer, and push approvals from axHub. That is AmberX: apps assembled by spec, in minutes.", act: (h) => h.go(PILOT) },
    ],
  },
];
