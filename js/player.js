// Walkthrough player: chapter index from video/chapters.json, captions toggle, and a playback speed slider
// with presets (remembered per browser).
(() => {
  const v = document.getElementById("v");
  const rate = document.getElementById("rate");
  const out = document.getElementById("rateOut");
  const presets = [...document.querySelectorAll(".presets button")];
  const list = document.getElementById("chapters");
  const ccOn = document.getElementById("ccOn");

  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, x) => { try { localStorage.setItem(k, x); } catch { /* private mode */ } } };

  function setRate(r) {
    r = Math.min(2, Math.max(0.5, Number(r) || 1));
    v.playbackRate = r; v.defaultPlaybackRate = r;
    rate.value = String(r);
    out.textContent = `${r.toFixed(r % 1 ? 2 : 0).replace(/0$/, "")}×`;
    presets.forEach((b) => b.classList.toggle("on", Math.abs(Number(b.dataset.rate) - r) < 0.001));
    store.set("tour-rate", String(r));
  }
  rate.addEventListener("input", () => setRate(rate.value));
  presets.forEach((b) => b.addEventListener("click", () => setRate(b.dataset.rate)));
  v.addEventListener("loadedmetadata", () => setRate(rate.value));
  setRate(store.get("tour-rate") || 1);

  ccOn.addEventListener("change", () => { for (const t of v.textTracks) t.mode = ccOn.checked ? "showing" : "hidden"; });

  // Say so only when the file is really missing (a codec error in one browser is not "missing").
  fetch("video/walkthrough.mp4", { method: "HEAD" }).then((r) => { if (!r.ok) document.getElementById("missing").hidden = false; })
    .catch(() => { document.getElementById("missing").hidden = false; });

  fetch("video/chapters.json").then((r) => (r.ok ? r.json() : null)).then((data) => {
    if (!data) return;
    const items = data.chapters.map((c) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.innerHTML = `<span class="t">${fmt(c.start)}</span><span></span>`;
      b.lastChild.textContent = c.title;
      b.addEventListener("click", () => { v.currentTime = c.start + 0.05; v.play().catch(() => {}); });
      li.appendChild(b); list.appendChild(li);
      return { c, b };
    });
    v.addEventListener("timeupdate", () => {
      let on = 0;
      items.forEach((x, i) => { if (v.currentTime >= x.c.start) on = i; });
      items.forEach((x, i) => x.b.classList.toggle("on", i === on));
    });
  }).catch(() => {});
})();
