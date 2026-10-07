/* ==========================================================================
   Home page figure: a small graph laid out by a gentle force simulation.
   Vertices can be dragged; each edge is shaded by its edge-girth, the length
   of a shortest cycle through it (infinite when the edge lies on no cycle).
   Markup and colors: _includes/graph-figure.html, _sass/layout/_site.scss
   ========================================================================== */

(function () {
  "use strict";

  var figure = document.querySelector(".graph-figure");
  if (!figure) return;
  var canvas = figure.querySelector("canvas");
  var ctx = canvas && canvas.getContext("2d");
  if (!ctx) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A triangle, a 4-cycle and a 5-cycle chained through cut vertices, then a pendant tree
  var N = 13;
  var EDGES = [
    [0, 1], [1, 2], [2, 0],
    [2, 3], [3, 4], [4, 5], [5, 2],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 5],
    [9, 10], [10, 11], [10, 12]
  ];

  var adjacency = [];
  for (var v = 0; v < N; v++) adjacency.push([]);
  EDGES.forEach(function (e) {
    adjacency[e[0]].push(e[1]);
    adjacency[e[1]].push(e[0]);
  });

  // Edge-girth of uv: one more than the distance from u to v once the edge uv is removed
  function edgeGirth(u, w) {
    var dist = [];
    for (var i = 0; i < N; i++) dist.push(-1);
    var queue = [u];
    dist[u] = 0;
    while (queue.length) {
      var x = queue.shift();
      for (var k = 0; k < adjacency[x].length; k++) {
        var y = adjacency[x][k];
        if ((x === u && y === w) || (x === w && y === u)) continue;
        if (dist[y] < 0) {
          dist[y] = dist[x] + 1;
          if (y === w) return dist[y] + 1;
          queue.push(y);
        }
      }
    }
    return Infinity;
  }

  var girth = EDGES.map(function (e) { return edgeGirth(e[0], e[1]); });

  // Caption: the edge-girth sequence, written g^(m) with m the multiplicity of g
  var sequence = figure.querySelector(".graph-figure__sequence");
  if (sequence) {
    var counts = {};
    girth.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; });
    var values = Object.keys(counts).map(Number).sort(function (a, b) { return a - b; });
    sequence.textContent = "edge-girth sequence (";
    values.forEach(function (g, index) {
      if (index > 0) sequence.appendChild(document.createTextNode(", "));
      sequence.appendChild(document.createTextNode(g === Infinity ? "∞" : String(g)));
      var sup = document.createElement("sup");
      sup.textContent = "(" + counts[g] + ")";
      sequence.appendChild(sup);
    });
    sequence.appendChild(document.createTextNode(")"));
  }

  /* Colors come from CSS custom properties so that they follow the site theme */
  var colors = {};
  function readColors() {
    var style = getComputedStyle(figure);
    var read = function (name) { return style.getPropertyValue(name).trim(); };
    colors.ink = read("--graph-ink");
    colors.halo = read("--graph-halo");
    colors.girth = { 3: read("--graph-girth-3"), 4: read("--graph-girth-4"), 5: read("--graph-girth-5") };
    colors.inf = read("--graph-girth-inf");
  }
  function edgeColor(g) {
    if (g === Infinity) return colors.inf;
    return colors.girth[g] || colors.girth[5];
  }

  /* Geometry */
  var W = 0;
  var H = 0;
  var nodes = [];
  var dragged = null;
  var hovered = null;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initNodes() {
    nodes = [];
    for (var i = 0; i < N; i++) {
      var angle = (2 * Math.PI * i) / N;
      nodes.push({
        x: W / 2 + Math.cos(angle) * 60 + (Math.random() - 0.5) * 10,
        y: H / 2 + Math.sin(angle) * 40 + (Math.random() - 0.5) * 10,
        vx: 0,
        vy: 0,
        phase: Math.random() * 2 * Math.PI,
        speed: 0.35 + Math.random() * 0.45
      });
    }
    for (var step = 0; step < 400; step++) tick(1, false);
  }

  /* Physics: pairwise repulsion, springs along edges, a weak pull to the center,
     and an optional slow wander that keeps the drawing alive */
  var time = 0;
  var MARGIN = 10;

  function tick(dt, wander) {
    var L = Math.max(26, Math.min(46, Math.min(W, H) / 5));
    var cx = W / 2;
    var cy = H / 2;
    var i, j, a, b, dx, dy, d, f;

    for (i = 0; i < N; i++) {
      nodes[i].fx = (cx - nodes[i].x) * 0.004;
      nodes[i].fy = (cy - nodes[i].y) * 0.008;
    }
    for (i = 0; i < N; i++) {
      for (j = i + 1; j < N; j++) {
        a = nodes[i];
        b = nodes[j];
        dx = b.x - a.x;
        dy = b.y - a.y;
        d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        f = (0.8 * L * L) / (d * d);
        a.fx -= (dx / d) * f;
        a.fy -= (dy / d) * f;
        b.fx += (dx / d) * f;
        b.fy += (dy / d) * f;
      }
    }
    EDGES.forEach(function (e) {
      var p = nodes[e[0]];
      var q = nodes[e[1]];
      var ex = q.x - p.x;
      var ey = q.y - p.y;
      var len = Math.sqrt(ex * ex + ey * ey) || 0.01;
      var s = 0.05 * (len - L);
      p.fx += (ex / len) * s;
      p.fy += (ey / len) * s;
      q.fx -= (ex / len) * s;
      q.fy -= (ey / len) * s;
    });

    var damping = Math.pow(0.82, dt);
    for (i = 0; i < N; i++) {
      a = nodes[i];
      if (a === dragged) {
        a.vx = 0;
        a.vy = 0;
        continue;
      }
      if (wander) {
        a.fx += Math.sin(time * a.speed + a.phase) * 0.05;
        a.fy += Math.cos(time * a.speed * 1.3 + a.phase) * 0.05;
      }
      a.vx = (a.vx + a.fx * dt) * damping;
      a.vy = (a.vy + a.fy * dt) * damping;
      var speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      if (speed > 6) {
        a.vx *= 6 / speed;
        a.vy *= 6 / speed;
      }
      a.x = Math.min(W - MARGIN, Math.max(MARGIN, a.x + a.vx * dt));
      a.y = Math.min(H - MARGIN, Math.max(MARGIN, a.y + a.vy * dt));
    }
  }

  function kineticEnergy() {
    var e = 0;
    nodes.forEach(function (n) { e += n.vx * n.vx + n.vy * n.vy; });
    return e;
  }

  /* Drawing */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    EDGES.forEach(function (e, k) {
      var a = nodes[e[0]];
      var b = nodes[e[1]];
      var finite = girth[k] !== Infinity;
      ctx.strokeStyle = edgeColor(girth[k]);
      ctx.lineWidth = finite ? 1.6 : 1.2;
      ctx.setLineDash(finite ? [] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    nodes.forEach(function (n) {
      var active = n === dragged || n === hovered;
      ctx.fillStyle = colors.ink;
      ctx.beginPath();
      ctx.arc(n.x, n.y, active ? 5 : 3.6, 0, 2 * Math.PI);
      ctx.fill();
      if (active) {
        ctx.strokeStyle = colors.halo;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 9, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  }

  /* Animation loop: runs while the figure is on screen; with reduced motion
     it only runs until the layout settles after a drag */
  var running = false;
  var onScreen = true;
  var last = 0;

  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min((now - last) / 16.67, 3) : 1;
    last = now;
    time += dt / 60;
    var wander = !reduceMotion.matches;
    tick(dt, wander);
    draw();
    if (!onScreen || (!wander && !dragged && kineticEnergy() < 0.01)) {
      running = false;
      last = 0;
      return;
    }
    window.requestAnimationFrame(frame);
  }

  function start() {
    if (running || !onScreen || !W) return;
    running = true;
    last = 0;
    window.requestAnimationFrame(frame);
  }

  /* Pointer interaction (mouse, pen and touch) */
  function pointerPosition(event) {
    var rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function nodeAt(p) {
    var best = null;
    var bestDistance = 14 * 14;
    nodes.forEach(function (n) {
      var d = (n.x - p.x) * (n.x - p.x) + (n.y - p.y) * (n.y - p.y);
      if (d < bestDistance) {
        best = n;
        bestDistance = d;
      }
    });
    return best;
  }

  canvas.addEventListener("pointerdown", function (event) {
    var p = pointerPosition(event);
    var n = nodeAt(p);
    if (!n) return;
    event.preventDefault();
    dragged = n;
    dragged.x = p.x;
    dragged.y = p.y;
    canvas.style.cursor = "grabbing";
    try { canvas.setPointerCapture(event.pointerId); } catch (err) { /* capture is optional */ }
    start();
  });

  canvas.addEventListener("pointermove", function (event) {
    var p = pointerPosition(event);
    if (dragged) {
      dragged.x = Math.min(W - MARGIN, Math.max(MARGIN, p.x));
      dragged.y = Math.min(H - MARGIN, Math.max(MARGIN, p.y));
      if (!running) draw();
      return;
    }
    var n = nodeAt(p);
    if (n !== hovered) {
      hovered = n;
      canvas.style.cursor = n ? "grab" : "";
      if (!running) draw();
    }
  });

  function release(event) {
    if (!dragged) return;
    dragged = null;
    canvas.style.cursor = hovered ? "grab" : "";
    try { canvas.releasePointerCapture(event.pointerId); } catch (err) { /* already released */ }
    start();
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", function () {
    if (dragged || !hovered) return;
    hovered = null;
    canvas.style.cursor = "";
    if (!running) draw();
  });

  /* Setup: size, colors, theme changes, visibility */
  readColors();

  function onResize() {
    var firstLayout = !W;
    resize();
    if (!W) return;
    if (firstLayout || !nodes.length) initNodes();
    nodes.forEach(function (n) {
      n.x = Math.min(W - MARGIN, Math.max(MARGIN, n.x));
      n.y = Math.min(H - MARGIN, Math.max(MARGIN, n.y));
    });
    draw();
    start();
  }

  if (window.ResizeObserver) {
    new ResizeObserver(onResize).observe(canvas);
  } else {
    window.addEventListener("resize", onResize);
  }
  onResize();

  new MutationObserver(function () {
    readColors();
    if (!running && W) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start();
    }).observe(canvas);
  }

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", start);
  }
})();
