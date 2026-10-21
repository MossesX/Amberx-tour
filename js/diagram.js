/* Visual renderers: cards, animated SVG flows, end-card URL list.
   Every item appears at a time (seconds into the scene) taken from the caption it belongs to.
   ctx = { cs: caption start times, skip: seconds already elapsed in the scene, wide, motion } */
(function () {
  var STL = { live: "Live", built: "Built", coming: "Coming", planned: "Planned", hold: "On hold", target: "Target", dormant: "Dormant" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function f(n) { return (Math.round(n * 100) / 100); }

  function revealAt(item, idx, n, ctx) {
    var cs = ctx.cs, k;
    if (item.c != null) k = Math.min(item.c, cs.length - 1);
    else k = Math.min(cs.length - 1, Math.floor(idx * cs.length / Math.max(n, 1)));
    return cs[k] + 0.15;
  }
  function delay(t, ctx) { return f(t - ctx.skip) + "s"; }

  function cards(v, ctx) {
    var n = v.items.length, dense = n > 5 ? " dense" : "";
    var h = '<div class="cards' + dense + '">';
    v.items.forEach(function (it, i) {
      var st = it.st ? " st-" + it.st : "";
      h += '<div class="card' + st + '" style="animation-delay:' + delay(revealAt(it, i, n, ctx), ctx) + '">' +
        (it.n ? '<span class="num">' + esc(it.n) + '</span>' : '') +
        '<div class="ctext"><div class="ct">' + esc(it.h) + '</div>' + (it.b ? '<div class="cb">' + esc(it.b) + '</div>' : '') + '</div>' +
        (it.st ? '<span class="badge b-' + it.st + '">' + STL[it.st] + '</span>' : '') + '</div>';
    });
    return h + '</div>';
  }

  /* ---------- flow ---------- */
  function clip(c, other, w, h) {
    var dx = other.x - c.x, dy = other.y - c.y;
    if (!dx && !dy) return { x: c.x, y: c.y };
    var tx = dx ? (w / 2 + 3) / Math.abs(dx) : 1e9, ty = dy ? (h / 2 + 3) / Math.abs(dy) : 1e9;
    var t = Math.min(tx, ty);
    return { x: c.x + dx * t, y: c.y + dy * t };
  }

  function layout(v, ctx) {
    var nodes = v.nodes.map(function (n) { return Object.assign({}, n); });
    var free = nodes.some(function (n) { return n.x != null; });
    var W = 360, H;
    if (free) {
      nodes.forEach(function (n) { n.h = n.s ? 44 : 36; n.cx = n.x; n.cy = n.y; });
      H = v.vb || 400;
      return { nodes: nodes, W: W, H: H };
    }
    var next = 0, rows = [];
    nodes.forEach(function (n) { if (n.row == null) n.row = next; next = Math.max(next, n.row) + 1; });
    nodes.forEach(function (n) { (rows[n.row] = rows[n.row] || []).push(n); });
    rows = rows.filter(Boolean);
    var single = rows.every(function (r) { return r.length === 1; });
    var snake = ctx.wide && single && rows.length >= 5;
    var pad = 10, gap = 26;
    if (snake) {
      W = 900;
      var per = Math.ceil(rows.length / 2), w = Math.min(200, (W - 2 * pad - (per - 1) * 46) / per);
      var h0 = 52;
      rows.forEach(function (r, i) {
        var n = r[0], line = i < per ? 0 : 1, col = line === 0 ? i : (per - 1 - (i - per));
        n.w = w; n.h = n.s ? h0 : 40; n.cx = pad + w / 2 + col * (w + 46); n.cy = pad + 30 + line * 110;
      });
      H = 2 * 110 + 20;
      return { nodes: nodes, W: W, H: H, flat: true };
    }
    W = ctx.wide ? 720 : 360;
    var y = pad + 16;
    rows.forEach(function (r) {
      var k = r.length, hasSub = r.some(function (n) { return n.s; });
      var maxW = ctx.wide ? 360 : 280;
      var w = Math.min(maxW, (W - 2 * pad - (k - 1) * 10) / k);
      var h = hasSub && w >= 120 ? 48 : 38;
      r.forEach(function (n, i) { n.w = w; n.h = h; n.cx = W / 2 + (i - (k - 1) / 2) * (w + 10); n.cy = y + h / 2; });
      y += h + gap;
    });
    H = y - gap + pad + 6;
    return { nodes: nodes, W: W, H: H, rows: rows };
  }

  function flow(v, ctx) {
    var L = layout(v, ctx), nodes = L.nodes, byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; if (n.w == null) n.w = 140; });
    var n = nodes.length;
    nodes.forEach(function (nd, i) { nd.t = revealAt(nd, i, n, ctx); });
    var edges = v.edges;
    if (!edges) {
      edges = [];
      var rows = L.rows || [];
      for (var r = 0; r + 1 < rows.length; r++) {
        rows[r].filter(function (x) { return x.link !== false; }).forEach(function (a) {
          rows[r + 1].filter(function (x) { return x.link !== false; }).forEach(function (b) { edges.push([a.id, b.id, "", {}]); });
        });
      }
    }
    var out = '<svg class="flow" viewBox="0 0 ' + L.W + ' ' + L.H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagram">';
    var edgeSvg = "", nodeSvg = "";
    edges.forEach(function (e) {
      var a = byId[e[0]], b = byId[e[1]], o = e[3] || {}, lab = e[2] || "";
      if (!a || !b) return;
      var t = o.c != null ? Math.min(o.c, ctx.cs.length - 1) : null;
      var T = t != null ? ctx.cs[t] + 0.3 : Math.max(a.t, b.t) + 0.25;
      var pts;
      if (o.side) {
        var xr = Math.max(a.cx + a.w / 2, b.cx + b.w / 2) + 22;
        pts = [{ x: a.cx + a.w / 2, y: a.cy }, { x: xr, y: a.cy }, { x: xr, y: b.cy }, { x: b.cx + b.w / 2 + 3, y: b.cy }];
      } else {
        var p1 = clip({ x: a.cx, y: a.cy }, { x: b.cx, y: b.cy }, a.w, a.h);
        var p2 = clip({ x: b.cx, y: b.cy }, { x: a.cx, y: a.cy }, b.w, b.h);
        pts = [p1, p2];
      }
      var d = "M" + pts.map(function (p) { return f(p.x) + " " + f(p.y); }).join(" L");
      var dl = delay(T, ctx);
      edgeSvg += '<path class="edge' + (o.dash ? " dash" : "") + '" d="' + d + '" pathLength="1" style="animation-delay:' + dl + '"/>';
      var q = pts[pts.length - 1], q0 = pts[pts.length - 2], ang = Math.atan2(q.y - q0.y, q.x - q0.x), s = 7;
      function head(px, py, an) {
        var x1 = px - s * Math.cos(an - 0.45), y1 = py - s * Math.sin(an - 0.45), x2 = px - s * Math.cos(an + 0.45), y2 = py - s * Math.sin(an + 0.45);
        return '<polygon class="arrow" points="' + f(px) + ',' + f(py) + ' ' + f(x1) + ',' + f(y1) + ' ' + f(x2) + ',' + f(y2) + '" style="animation-delay:' + delay(T + 0.4, ctx) + '"/>';
      }
      edgeSvg += head(q.x, q.y, ang);
      if (o.bi) { var z = pts[0], z1 = pts[1]; edgeSvg += head(z.x, z.y, Math.atan2(z.y - z1.y, z.x - z1.x)); }
      if (lab) {
        var m = pts[Math.floor((pts.length - 1) / 2)], m2 = pts[Math.floor((pts.length - 1) / 2) + 1] || m;
        var mx = (m.x + m2.x) / 2, my = (m.y + m2.y) / 2, horiz = Math.abs(m2.x - m.x) > Math.abs(m2.y - m.y);
        edgeSvg += '<text class="elabel" x="' + f(horiz ? mx : mx + 8) + '" y="' + f(horiz ? my - 6 : my + 4) + '" text-anchor="' + (horiz ? "middle" : "start") + '" style="animation-delay:' + delay(T + 0.2, ctx) + '">' + esc(lab) + '</text>';
      }
      if (ctx.motion) {
        var begin = f(T + 0.6 - ctx.skip) + "s";
        var rev = pts.slice().reverse(), dr = "M" + rev.map(function (p) { return f(p.x) + " " + f(p.y); }).join(" L");
        edgeSvg += '<circle class="pkt" r="3.4" opacity="0"><set attributeName="opacity" to="1" begin="' + begin + '"/><animateMotion dur="1.9s" begin="' + begin + '" repeatCount="indefinite" path="' + d + '"/></circle>';
        if (o.bi) edgeSvg += '<circle class="pkt pkt2" r="3" opacity="0"><set attributeName="opacity" to="1" begin="' + begin + '"/><animateMotion dur="1.9s" begin="' + f(T + 1.55 - ctx.skip) + 's" repeatCount="indefinite" path="' + dr + '"/></circle>';
      }
    });
    nodes.forEach(function (nd) {
      var x = nd.cx - nd.w / 2, y = nd.cy - nd.h / 2, st = nd.st ? " st-" + nd.st : "";
      var fsL = Math.max(10, Math.min(14.5, (nd.w - 14) / (String(nd.l).length * 0.58)));
      var sub = nd.s && nd.w >= 100;
      var fsS = sub ? Math.max(8.5, Math.min(11, (nd.w - 14) / (String(nd.s).length * 0.55))) : 0;
      nodeSvg += '<g class="node k-' + (nd.k || "amber") + st + '" style="animation-delay:' + delay(nd.t, ctx) + ';transform-origin:' + f(nd.cx) + 'px ' + f(nd.cy) + 'px">' +
        '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(nd.w) + '" height="' + f(nd.h) + '" rx="11"/>' +
        '<text class="nl" x="' + f(nd.cx) + '" y="' + f(nd.cy + (sub ? -4 : 5)) + '" text-anchor="middle" font-size="' + f(fsL) + '">' + esc(nd.l) + '</text>' +
        (sub ? '<text class="ns" x="' + f(nd.cx) + '" y="' + f(nd.cy + 12) + '" text-anchor="middle" font-size="' + f(fsS) + '">' + esc(nd.s) + '</text>' : '') +
        (nd.st ? '<g class="tag"><rect x="' + f(x + nd.w - 58) + '" y="' + f(y - 7) + '" width="52" height="14" rx="7"/><text x="' + f(x + nd.w - 32) + '" y="' + f(y + 3.5) + '" text-anchor="middle">' + STL[nd.st].toUpperCase() + '</text></g>' : '') +
        '</g>';
    });
    return out + edgeSvg + nodeSvg + '</svg>';
  }

  function urls(v, ctx) {
    var h = '<div class="urls"><div class="goalbox" style="animation-delay:' + delay(0.1, ctx) + '"><b>The goal</b> ' + esc(window.TOUR.goalShort) + '</div>', list = window.TOUR.urls;
    list.forEach(function (u, i) {
      var d = delay(revealAt({}, i, list.length, ctx), ctx);
      var host = u.url.replace(/^https:\/\//, "");
      h += u.url
        ? '<a class="url" href="' + esc(u.url) + '" target="_blank" rel="noopener" style="animation-delay:' + d + '"><b>' + esc(u.name) + '</b><span>' + esc(host) + '</span><i>' + esc(u.note) + '</i></a>'
        : '<div class="url nolink" style="animation-delay:' + d + '"><b>' + esc(u.name) + '</b><span></span><i>' + esc(u.note) + '</i></div>';
    });
    return h + '</div>';
  }

  window.TourVisual = function (v, ctx) {
    if (v.t === "cards") return cards(v, ctx);
    if (v.t === "flow") return flow(v, ctx);
    if (v.t === "urls") return urls(v, ctx);
    return "";
  };
  window.TourStatusLabel = STL;
})();
