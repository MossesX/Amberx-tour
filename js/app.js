/* Tour engine: timeline, scene rendering, controls, narration. Content is in js/script.js. */
(function () {
  "use strict";
  var T = window.TOUR;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SPEAKABLE = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  /* ---------- timeline ---------- */
  function capSecs(text) { var w = text.trim().split(/\s+/).length; return Math.max(3.4, w / 2.9 + 0.8); }
  var scenes = [], chapters = [], total = 0;
  T.chapters.forEach(function (ch, ci) {
    var list = [{ title: true, h: ch.title, caps: [ch.goal], v: null }].concat(ch.scenes);
    var c0 = total;
    list.forEach(function (sc, si) {
      var starts = [], t = 0;
      sc.caps.forEach(function (c) { starts.push(t); t += capSecs(c); });
      var tail = sc.end ? 8 : 0.5;
      var s = { ci: ci, si: si, h: sc.h, caps: sc.caps, v: sc.v, title: !!sc.title, end: !!sc.end, cs: starts, dur: t + tail, start: total, idx: scenes.length };
      scenes.push(s); total += s.dur;
    });
    chapters.push({ ci: ci, title: ch.title, short: ch.short, goal: ch.goal, start: c0, end: total, first: scenes.length - list.length });
  });
  window.TOUR_TIMELINE = { total: total, chapters: chapters.map(function (c) { return { title: c.title, start: c.start, dur: c.end - c.start }; }), scenes: scenes.length, sceneStarts: scenes.map(function (s) { return { ci: s.ci, start: s.start, dur: s.dur, h: s.h }; }) };

  /* ---------- state ---------- */
  var t = 0, playing = true, cur = -1, capI = -1, narrate = false, last = 0, ended = false;
  var sceneEl = $("scene"), stage = $("stage");

  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function sceneAt(x) {
    for (var i = scenes.length - 1; i >= 0; i--) if (x >= scenes[i].start) return i;
    return 0;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function isWide() { return window.innerWidth / Math.max(1, window.innerHeight) > 1.25 && window.innerWidth >= 700; }

  /* ---------- rendering ---------- */
  function render(i, skip) {
    var s = scenes[i], ch = chapters[s.ci];
    cur = i; capI = -1;
    var ctx = { cs: s.cs, skip: skip || 0, wide: isWide(), motion: !reduce };
    var html;
    if (s.title) {
      html = '<div class="title-card"><div class="chno">' + String(s.ci + 1).padStart(2, "0") + '</div>' +
        '<h1 class="big">' + esc(s.h) + '</h1>' +
        '<div class="serves"><span>How this serves the goal</span><p id="cap">' + esc(s.caps[0]) + '</p></div></div>';
    } else {
      html = '<div class="ctag">Chapter ' + (s.ci + 1) + ' · ' + esc(ch.title) + '</div><h1>' + esc(s.h) + '</h1>' +
        '<div class="visual">' + window.TourVisual(s.v, ctx) + '</div><p class="cap" id="cap"></p>';
    }
    sceneEl.className = "scene" + (s.title ? " is-title" : "") + (s.end ? " is-end" : "");
    sceneEl.innerHTML = html;
    sceneEl.classList.remove("in"); void sceneEl.offsetWidth; sceneEl.classList.add("in");
    $("chapLabel").textContent = (s.ci + 1) + " / " + chapters.length + " · " + ch.title;
    document.querySelectorAll("#chapList li").forEach(function (li, k) { li.classList.toggle("on", k === s.ci); });
    applyPause();
  }
  function applyPause() {
    stage.classList.toggle("paused", !playing);
    var svg = sceneEl.querySelector("svg.flow");
    if (svg && svg.pauseAnimations) { try { playing ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) {} }
  }
  function updateCaption(local) {
    var s = scenes[cur], k = 0;
    for (var j = s.cs.length - 1; j >= 0; j--) if (local >= s.cs[j]) { k = j; break; }
    if (k === capI) return;
    capI = k;
    var el = $("cap");
    if (el && !s.title) { el.classList.remove("swap"); void el.offsetWidth; el.textContent = s.caps[k]; el.classList.add("swap"); }
    speak(s.caps[k]);
  }

  /* ---------- narration (Web Speech API, off by default) ---------- */
  function speak(text) {
    if (!SPEAKABLE) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (!narrate || !playing) return;
    try { var u = new SpeechSynthesisUtterance(text.replace(/asset at-1/g, "asset at 1")); u.rate = 1.1; u.lang = "en-US"; speechSynthesis.speak(u); } catch (e) {}
  }
  function setNarrate(on) {
    narrate = on;
    var b = $("btnSpeak"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", "Narration " + (on ? "on" : "off"));
    try { localStorage.setItem("tour.narrate", on ? "1" : "0"); } catch (e) {}
    if (on) { var s = scenes[cur]; speak(s.caps[Math.max(0, capI)]); } else if (SPEAKABLE) { try { speechSynthesis.cancel(); } catch (e) {} }
  }

  /* ---------- transport ---------- */
  var ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z"/></svg>';
  var ICON_REPLAY = '<svg viewBox="0 0 24 24"><path d="M5 12a7 7 0 1 0 2.2-5.1M5 4v4h4"/></svg>';
  function setPlaying(p) {
    playing = p;
    var b = $("btnPlay");
    b.innerHTML = ended ? ICON_REPLAY : (p ? ICON_PAUSE : ICON_PLAY);
    b.setAttribute("aria-label", ended ? "Replay" : (p ? "Pause" : "Play"));
    applyPause();
    if (!p && SPEAKABLE) { try { speechSynthesis.cancel(); } catch (e) {} }
    if (p && narrate && cur >= 0) speak(scenes[cur].caps[Math.max(0, capI)]);
  }
  function seek(x) {
    t = Math.min(Math.max(0, x), total - 0.001);
    ended = false;
    var i = sceneAt(t);
    render(i, t - scenes[i].start);
    updateCaption(t - scenes[i].start);
    update();
    setPlaying(playing);
  }
  function goScene(i) { i = Math.min(Math.max(0, i), scenes.length - 1); seek(scenes[i].start + 0.01); }
  function next() { goScene(cur + 1); }
  function prev() { goScene(t - scenes[cur].start > 2.5 ? cur : cur - 1); }
  function goChapter(k) { k = Math.min(Math.max(0, k), chapters.length - 1); seek(chapters[k].start + 0.01); }
  function toggle() {
    if (ended) { seek(0); setPlaying(true); return; }
    setPlaying(!playing); flash(playing ? ICON_PLAY : ICON_PAUSE);
  }
  function flash(icon) { var f = $("flash"); f.innerHTML = icon; f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); }

  function update() {
    var pct = t / total * 100;
    $("fill").style.width = pct + "%"; $("knob").style.left = pct + "%";
    $("time").textContent = fmt(t) + " / " + fmt(total);
    $("bar").setAttribute("aria-valuenow", Math.round(pct));
    $("bar").setAttribute("aria-valuetext", fmt(t) + " of " + fmt(total) + ", " + chapters[scenes[cur].ci].title);
  }
  function frame(now) {
    var dt = Math.min(0.25, (now - last) / 1000); last = now;
    if (playing && !ended) {
      t += dt;
      if (t >= total) {
        t = total; ended = true; playing = false; setPlaying(false);
        update(); requestAnimationFrame(frame); return;
      }
      var i = sceneAt(t);
      if (i !== cur) render(i, t - scenes[i].start);
      updateCaption(t - scenes[i].start);
      update();
    }
    requestAnimationFrame(frame);
  }

  /* ---------- build UI ---------- */
  var marks = "";
  chapters.forEach(function (c) { if (c.start > 0) marks += '<i style="left:' + (c.start / total * 100) + '%"></i>'; });
  $("marks").innerHTML = marks;
  var list = "";
  chapters.forEach(function (c) {
    list += '<li><button data-ch="' + c.ci + '"><span class="n">' + (c.ci + 1) + '</span><span class="tt"><b>' + esc(c.title) + '</b><small>' + esc(c.short) + '</small></span><span class="d">' + fmt(c.start) + '</span></button></li>';
  });
  $("chapList").innerHTML = list;

  function openMenu(on) { $("sheet").hidden = !on; if (on) { var a = document.querySelector("#chapList li.on button"); if (a) a.focus(); } }
  $("btnMenu").onclick = function () { openMenu(true); };
  $("sheetClose").onclick = $("sheetBg").onclick = function () { openMenu(false); };
  $("chapList").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-ch]"); if (!b) return;
    openMenu(false); goChapter(+b.dataset.ch);
  });
  $("btnPlay").onclick = toggle;
  $("btnPrev").onclick = prev; $("btnNext").onclick = next;
  $("edgeL").onclick = prev; $("edgeR").onclick = next;
  if (SPEAKABLE) $("btnSpeak").onclick = function () { setNarrate(!narrate); }; else $("btnSpeak").hidden = true;

  /* progress bar: tap or drag */
  var bar = $("bar"), drag = false;
  function barSeek(e) { var r = bar.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * total); }
  bar.addEventListener("pointerdown", function (e) { drag = true; bar.setPointerCapture(e.pointerId); barSeek(e); });
  bar.addEventListener("pointermove", function (e) { if (drag) barSeek(e); });
  bar.addEventListener("pointerup", function () { drag = false; });
  bar.addEventListener("pointercancel", function () { drag = false; });
  bar.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { seek(t + 10); e.preventDefault(); e.stopPropagation(); }
    if (e.key === "ArrowLeft") { seek(t - 10); e.preventDefault(); e.stopPropagation(); }
  });

  /* centre tap = play/pause; swipe = scenes */
  sceneEl.addEventListener("click", function (e) { if (e.target.closest("a")) return; toggle(); });
  var sx = 0, sy = 0, st = 0;
  stage.addEventListener("touchstart", function (e) { var p = e.changedTouches[0]; sx = p.clientX; sy = p.clientY; st = Date.now(); }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    var p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50 && Date.now() - st < 700) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var menuOpen = !$("sheet").hidden;
    if (e.key === "Escape") { openMenu(false); return; }
    if (menuOpen) return;
    var k = e.key;
    if (k === " " || k === "Spacebar" || k === "k") { if (document.activeElement && document.activeElement.tagName === "A") return; e.preventDefault(); toggle(); }
    else if (k === "ArrowRight") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (k === "ArrowDown") { e.preventDefault(); goChapter(cur >= 0 ? scenes[cur].ci + 1 : 1); }
    else if (k === "ArrowUp") { e.preventDefault(); goChapter(scenes[cur].ci - (t - chapters[scenes[cur].ci].start > 3 ? 0 : 1)); }
    else if (k === "n" || k === "N") { if (SPEAKABLE) setNarrate(!narrate); }
    else if (k === "m" || k === "M") { openMenu(true); }
    else if (k === "Home") { seek(0); }
  });
  document.addEventListener("visibilitychange", function () { last = performance.now(); });
  var rz; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { if (cur >= 0) { var s = scenes[cur]; render(cur, t - s.start); capI = -1; updateCaption(t - s.start); } }, 150); });
  if (window.matchMedia) { try { matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", function (e) { reduce = e.matches; }); } catch (e) {} }

  /* ---------- start ---------- */
  try { if (localStorage.getItem("tour.narrate") === "1" && SPEAKABLE) { narrate = true; var b = $("btnSpeak"); b.classList.add("on"); b.setAttribute("aria-pressed", "true"); b.setAttribute("aria-label", "Narration on"); } } catch (e) {}
  var start = 0, h = location.hash;
  var m = /^#c(\d+)$/.exec(h), m2 = /^#t=(\d+)$/.exec(h);
  if (m) start = chapters[Math.min(chapters.length, Math.max(1, +m[1])) - 1].start; else if (m2) start = +m2[1];
  window.TOUR_API = { seek: seek, toggle: toggle, state: function () { return { t: t, playing: playing, scene: cur, ended: ended }; } };
  seek(start);
  setPlaying(true);
  last = performance.now();
  requestAnimationFrame(frame);
})();
