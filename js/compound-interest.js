/* =========================================================
   compound-interest.js — Discrete Compound Interest
   Real plotted curves + labeled grid graphs
   Stepper matches Topics 1–7
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Helpers (same reveal style)
  ------------------------------ */
  const showLines = (...els) => els.forEach(el => {
    if (!el) return;
    el.classList.remove("hidden-line");
    el.classList.add("shown-line");
  });

  const hideLines = (...els) => els.forEach(el => {
    if (!el) return;
    el.classList.remove("shown-line");
    el.classList.add("hidden-line");
  });

  const showFactor = (...els) => els.forEach(el => el?.classList.add("show"));
  const hideFactor = (...els) => els.forEach(el => el?.classList.remove("show"));

  const showPoint = (...els) => els.forEach(el => el?.classList.add("show"));
  const hidePoint = (...els) => els.forEach(el => el?.classList.remove("show"));

  const showCurve = (el) => el?.classList.add("show");
  const hideCurve = (el) => el?.classList.remove("show");

  /* ------------------------------
     Stepper engine (Topics 1–7)
  ------------------------------ */
  function makeStepper({
    stepTextEl, resultEl,
    prevBtn, nextBtn, playBtn, resetBtn,
    steps, resetVisuals
  }) {
    let i = 0;
    let playing = false;
    let timer = null;

    const apply = (idx) => {
      i = idx;
      const s = steps[i];
      stepTextEl.textContent = s.text;
      s.action();

      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === steps.length - 1;
    };

    const rebuildTo = (target) => {
      resetVisuals();
      resultEl.innerHTML = "";
      for (let k = 0; k <= target; k++) steps[k].action();
      stepTextEl.textContent = steps[target].text;

      i = target;
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === steps.length - 1;
    };

    const next = () => { if (i < steps.length - 1) apply(i + 1); };
    const prev = () => { if (i > 0) rebuildTo(i - 1); };

    const stop = () => {
      playing = false;
      playBtn.textContent = "Play";
      if (timer) clearInterval(timer);
      timer = null;
    };

    const play = () => {
      if (playing) return;
      playing = true;
      playBtn.textContent = "Pause";
      timer = setInterval(() => {
        if (i >= steps.length - 1) { stop(); return; }
        next();
      }, 1100);
    };

    const reset = () => {
      stop();
      resetVisuals();
      resultEl.innerHTML = "";
      apply(0);
      stepTextEl.textContent = "Press Next or Play to start.";
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    playBtn.addEventListener("click", () => playing ? stop() : play());
    resetBtn.addEventListener("click", reset);

    resetVisuals();
    apply(0);
  }

  /* =========================================================
     Math + formatting
  ========================================================= */
  const A = (P, r, n, t) => P * Math.pow(1 + r/n, n*t);
  const money = (v) => `$${v.toFixed(2)}`;

  /* =========================================================
     SVG Graph Builder (with labeled grid)
  ========================================================= */
  function buildGraph({
    svg, gridG, axesG, ticksG, pointsG, curveEl,
    yearsMax, yMax, yStep,
    f, pointsYears
  }) {
    const W = 640, H = 360;
    const left = 90, right = 20, top = 25, bottom = 45;
    const x0 = left;
    const y0 = H - bottom;
    const xMaxPx = W - right;
    const yTopPx = top;

    const plotW = xMaxPx - x0;
    const plotH = y0 - yTopPx;

    const scaleX = plotW / yearsMax;
    const scaleY = plotH / yMax;

    const toSvg = (x, y) => ({
      sx: x0 + x * scaleX,
      sy: y0 - y * scaleY
    });

    /* ---- grid ---- */
    gridG.innerHTML = "";
    const xTicks = yearsMax; // 0..yearsMax each 1 year
    for (let i = 0; i <= xTicks; i++) {
      const x = x0 + i * scaleX;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", yTopPx);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y0);
      line.setAttribute("class", `grid-line ${i % 2 === 0 ? "bold" : ""}`);
      gridG.appendChild(line);
    }

    for (let y = 0; y <= yMax; y += yStep) {
      const { sy } = toSvg(0, y);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x0);
      line.setAttribute("y1", sy);
      line.setAttribute("x2", xMaxPx);
      line.setAttribute("y2", sy);
      line.setAttribute("class", `grid-line ${y % (yStep * 2) === 0 ? "bold" : ""}`);
      gridG.appendChild(line);
    }

    /* ---- axes ---- */
    axesG.innerHTML = "";
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", x0);
    xAxis.setAttribute("y1", y0);
    xAxis.setAttribute("x2", xMaxPx);
    xAxis.setAttribute("y2", y0);
    xAxis.setAttribute("class", "axis");
    axesG.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", x0);
    yAxis.setAttribute("y1", yTopPx);
    yAxis.setAttribute("x2", x0);
    yAxis.setAttribute("y2", y0);
    yAxis.setAttribute("class", "axis");
    axesG.appendChild(yAxis);

    /* ---- ticks + labels ---- */
    ticksG.innerHTML = "";

    // x ticks + labels
    for (let i = 0; i <= xTicks; i++) {
      const x = x0 + i * scaleX;

      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", x); tick.setAttribute("y1", y0);
      tick.setAttribute("x2", x); tick.setAttribute("y2", y0 + 6);
      tick.setAttribute("class", "tick");
      ticksG.appendChild(tick);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x - 3);
      label.setAttribute("y", y0 + 20);
      label.setAttribute("class", "tick-label");
      label.textContent = i;
      ticksG.appendChild(label);
    }

    // y ticks + labels
    for (let y = 0; y <= yMax; y += yStep) {
      const { sy } = toSvg(0, y);

      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", x0 - 6); tick.setAttribute("y1", sy);
      tick.setAttribute("x2", x0); tick.setAttribute("y2", sy);
      tick.setAttribute("class", "tick");
      ticksG.appendChild(tick);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x0 - 10);
      label.setAttribute("y", sy + 5);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "tick-label");
      label.textContent = y;
      ticksG.appendChild(label);
    }

    // axis labels
    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute("x", xMaxPx - 10);
    xLabel.setAttribute("y", y0 + 35);
    xLabel.setAttribute("text-anchor", "end");
    xLabel.setAttribute("class", "axis-label");
    xLabel.textContent = "Years";
    ticksG.appendChild(xLabel);

    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute("x", x0 + 8);
    yLabel.setAttribute("y", yTopPx + 16);
    yLabel.setAttribute("class", "axis-label");
    yLabel.textContent = "Amount ($)";
    ticksG.appendChild(yLabel);

    /* ---- curve ---- */
    let d = "";
    let started = false;

    for (let t = 0; t <= yearsMax; t += 0.02) {
      const y = f(t);
      const { sx, sy } = toSvg(t, y);

      if (!isFinite(y) || sy < yTopPx - 200) {
        started = false; continue;
      }

      if (!started) {
        d += `M ${sx.toFixed(2)} ${sy.toFixed(2)} `;
        started = true;
      } else {
        d += `L ${sx.toFixed(2)} ${sy.toFixed(2)} `;
      }
    }
    curveEl.setAttribute("d", d.trim());

    /* ---- points ---- */
    pointsG.innerHTML = "";
    pointsYears.forEach((yr) => {
      const val = f(yr);
      const { sx, sy } = toSvg(yr, val);

      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", sx);
      c.setAttribute("cy", sy);
      c.setAttribute("r", 5.5);
      c.setAttribute("class", "point show");
      pointsG.appendChild(c);
    });
  }

  /* =========================================================
     EXAMPLE 1 setup
  ========================================================= */
  const ci1 = {
    stepText: document.getElementById("ci1StepText"),
    result: document.getElementById("ci1Result"),
    prev: document.getElementById("ci1Prev"),
    next: document.getElementById("ci1Next"),
    play: document.getElementById("ci1Play"),
    reset: document.getElementById("ci1Reset"),

    formula: document.getElementById("ci1Formula"),
    factor: document.getElementById("ci1Factor"),
    exp: document.getElementById("ci1Exp"),

    rows: [
      document.getElementById("ci1r0"),
      document.getElementById("ci1r1"),
      document.getElementById("ci1r2"),
      document.getElementById("ci1r3"),
      document.getElementById("ci1r4")
    ],
    vals: [
      document.getElementById("ci1v0"),
      document.getElementById("ci1v1"),
      document.getElementById("ci1v2"),
      document.getElementById("ci1v3"),
      document.getElementById("ci1v4")
    ],

    svg: document.getElementById("ci1Graph"),
    gridG: document.getElementById("ci1Grid"),
    axesG: document.getElementById("ci1Axes"),
    ticksG: document.getElementById("ci1Ticks"),
    pointsG: document.getElementById("ci1Points"),
    curve: document.getElementById("ci1Curve")
  };

  const P1 = 2000, r1 = 0.05, n1 = 12, t1Max = 4;
  const f1 = (t) => A(P1, r1, n1, t);

  // fill table values
  [0,1,2,3,4].forEach((yr, idx) => {
    ci1.vals[idx].textContent = money(f1(yr));
  });

  function drawCI1Graph() {
    buildGraph({
      svg: ci1.svg,
      gridG: ci1.gridG,
      axesG: ci1.axesG,
      ticksG: ci1.ticksG,
      pointsG: ci1.pointsG,
      curveEl: ci1.curve,
      yearsMax: t1Max,
      yMax: 2600,
      yStep: 500,
      f: f1,
      pointsYears: [0,1,2,3,4]
    });
  }

  const resetCI1 = () => {
    hideFactor(ci1.formula, ci1.factor, ci1.exp);
    hideLines(...ci1.rows);
    hideLines(ci1.gridG, ci1.axesG, ci1.ticksG, ci1.curve, ci1.pointsG);
    hideCurve(ci1.curve);
    ci1.result.innerHTML = "";
  };

  const ci1Steps = [
    { text: "Step 1: Substitute P, r, n, t into the formula.", action: () => showFactor(ci1.formula) },
    { text: "Step 2: Compute the growth factor (1 + r/n).", action: () => showFactor(ci1.factor) },
    { text: "Step 3: Compute exponent nt.", action: () => showFactor(ci1.exp) },

    { text: "Step 4: Build a year-by-year table.", action: () => showLines(ci1.rows[0]) },
    { text: "After 1 year.", action: () => showLines(ci1.rows[1]) },
    { text: "After 2 years.", action: () => showLines(ci1.rows[2]) },
    { text: "After 3 years.", action: () => showLines(ci1.rows[3]) },
    { text: "After 4 years.", action: () => showLines(ci1.rows[4]) },

    { text: "Step 5: Plot the curve and key yearly points.", action: () => {
        drawCI1Graph();
        showLines(ci1.gridG, ci1.axesG, ci1.ticksG, ci1.curve, ci1.pointsG);
        showCurve(ci1.curve);
      }
    },

    { text: "Final summary for Example 1.", action: () => {
        drawCI1Graph();
        showFactor(ci1.formula, ci1.factor, ci1.exp);
        showLines(ci1.gridG, ci1.axesG, ci1.ticksG, ci1.curve, ci1.pointsG, ...ci1.rows);
        showCurve(ci1.curve);

        ci1.result.innerHTML = `
          <strong>A(4):</strong> ${money(f1(4))}<br>
          Monthly compounding (n=12) applies the growth factor 48 times.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: ci1.stepText,
    resultEl: ci1.result,
    prevBtn: ci1.prev,
    nextBtn: ci1.next,
    playBtn: ci1.play,
    resetBtn: ci1.reset,
    steps: ci1Steps,
    resetVisuals: resetCI1
  });

  /* =========================================================
     EXAMPLE 2 setup
  ========================================================= */
  const ci2 = {
    stepText: document.getElementById("ci2StepText"),
    result: document.getElementById("ci2Result"),
    prev: document.getElementById("ci2Prev"),
    next: document.getElementById("ci2Next"),
    play: document.getElementById("ci2Play"),
    reset: document.getElementById("ci2Reset"),

    formula: document.getElementById("ci2Formula"),
    factor: document.getElementById("ci2Factor"),
    exp: document.getElementById("ci2Exp"),

    rows: [
      document.getElementById("ci2r0"),
      document.getElementById("ci2r2"),
      document.getElementById("ci2r4"),
      document.getElementById("ci2r6")
    ],
    vals: [
      document.getElementById("ci2v0"),
      document.getElementById("ci2v2"),
      document.getElementById("ci2v4"),
      document.getElementById("ci2v6")
    ],

    svg: document.getElementById("ci2Graph"),
    gridG: document.getElementById("ci2Grid"),
    axesG: document.getElementById("ci2Axes"),
    ticksG: document.getElementById("ci2Ticks"),
    pointsG: document.getElementById("ci2Points"),
    curve: document.getElementById("ci2Curve")
  };

  const P2 = 5000, r2 = 0.08, n2 = 4, t2Max = 6;
  const f2 = (t) => A(P2, r2, n2, t);

  [0,2,4,6].forEach((yr, idx) => {
    ci2.vals[idx].textContent = money(f2(yr));
  });

  function drawCI2Graph() {
    buildGraph({
      svg: ci2.svg,
      gridG: ci2.gridG,
      axesG: ci2.axesG,
      ticksG: ci2.ticksG,
      pointsG: ci2.pointsG,
      curveEl: ci2.curve,
      yearsMax: t2Max,
      yMax: 9000,
      yStep: 1000,
      f: f2,
      pointsYears: [0,2,4,6]
    });
  }

  const resetCI2 = () => {
    hideFactor(ci2.formula, ci2.factor, ci2.exp);
    hideLines(...ci2.rows);
    hideLines(ci2.gridG, ci2.axesG, ci2.ticksG, ci2.curve, ci2.pointsG);
    hideCurve(ci2.curve);
    ci2.result.innerHTML = "";
  };

  const ci2Steps = [
    { text: "Step 1: Substitute P, r, n, t into the formula.", action: () => showFactor(ci2.formula) },
    { text: "Step 2: Compute the growth factor (1 + r/n).", action: () => showFactor(ci2.factor) },
    { text: "Step 3: Compute exponent nt.", action: () => showFactor(ci2.exp) },

    { text: "Step 4: Build a table of values.", action: () => showLines(ci2.rows[0]) },
    { text: "After 2 years.", action: () => showLines(ci2.rows[1]) },
    { text: "After 4 years.", action: () => showLines(ci2.rows[2]) },
    { text: "After 6 years.", action: () => showLines(ci2.rows[3]) },

    { text: "Step 5: Plot the curve and key points.", action: () => {
        drawCI2Graph();
        showLines(ci2.gridG, ci2.axesG, ci2.ticksG, ci2.curve, ci2.pointsG);
        showCurve(ci2.curve);
      }
    },

    { text: "Final summary for Example 2.", action: () => {
        drawCI2Graph();
        showFactor(ci2.formula, ci2.factor, ci2.exp);
        showLines(ci2.gridG, ci2.axesG, ci2.ticksG, ci2.curve, ci2.pointsG, ...ci2.rows);
        showCurve(ci2.curve);

        ci2.result.innerHTML = `
          <strong>A(6):</strong> ${money(f2(6))}<br>
          Quarterly compounding (n=4) applies the growth factor 24 times.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: ci2.stepText,
    resultEl: ci2.result,
    prevBtn: ci2.prev,
    nextBtn: ci2.next,
    playBtn: ci2.play,
    resetBtn: ci2.reset,
    steps: ci2Steps,
    resetVisuals: resetCI2
  });

});
