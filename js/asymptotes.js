/* =========================================================
   asymptotes.js — real plotted rational graphs + Topic 1–3 stepper
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     REVEAL / HIDE HELPERS
  -------------------------- */
  const showLines = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("hidden-line");
      el.classList.add("shown-line");
    });
  };

  const hideLines = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("shown-line");
      el.classList.add("hidden-line");
    });
  };

  const showFactor = (...els) => {
    els.forEach(el => el?.classList.add("show"));
  };

  const hideFactor = (...els) => {
    els.forEach(el => el?.classList.remove("show"));
  };

  /* -------------------------
     GRAPH UTILITIES (REAL PLOT)
  -------------------------- */

  function mapX(x, xMin, xMax, width) {
    return ((x - xMin) / (xMax - xMin)) * width;
  }
  function mapY(y, yMin, yMax, height) {
    // SVG y grows downward
    return height - ((y - yMin) / (yMax - yMin)) * height;
  }

  function injectGrid(svg, gridGroupId, xMin, xMax, yMin, yMax) {
    const g = document.getElementById(gridGroupId);
    if (!g) return;

    const width = 600;
    const height = 260;

    g.innerHTML = "";

    // minor step 1, major step 2
    const minorStep = 1;
    const majorStep = 2;

    // vertical grid lines
    for (let x = Math.ceil(xMin); x <= xMax; x += minorStep) {
      const isMajor = (x % majorStep === 0);
      const px = mapX(x, xMin, xMax, width);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", px);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", px);
      line.setAttribute("y2", height);
      line.setAttribute("class", isMajor ? "grid-major" : "grid-minor");
      g.appendChild(line);
    }

    // horizontal grid lines
    for (let y = Math.ceil(yMin); y <= yMax; y += minorStep) {
      const isMajor = (y % majorStep === 0);
      const py = mapY(y, yMin, yMax, height);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", 0);
      line.setAttribute("y1", py);
      line.setAttribute("x2", width);
      line.setAttribute("y2", py);
      line.setAttribute("class", isMajor ? "grid-major" : "grid-minor");
      g.appendChild(line);
    }
  }

  function setAxes(svg, xAxisId, yAxisId, xMin, xMax, yMin, yMax) {
    const width = 600;
    const height = 260;

    const xAxis = document.getElementById(xAxisId);
    const yAxis = document.getElementById(yAxisId);

    const y0 = mapY(0, yMin, yMax, height);
    const x0 = mapX(0, xMin, xMax, width);

    if (xAxis) {
      xAxis.setAttribute("x1", 0);
      xAxis.setAttribute("y1", y0);
      xAxis.setAttribute("x2", width);
      xAxis.setAttribute("y2", y0);
    }
    if (yAxis) {
      yAxis.setAttribute("x1", x0);
      yAxis.setAttribute("y1", 0);
      yAxis.setAttribute("x2", x0);
      yAxis.setAttribute("y2", height);
    }
  }

  function setVerticalAsymptote(lineEl, labelEl, xVal, xMin, xMax) {
    const width = 600;
    const height = 260;
    const px = mapX(xVal, xMin, xMax, width);

    lineEl?.setAttribute("x1", px);
    lineEl?.setAttribute("y1", 0);
    lineEl?.setAttribute("x2", px);
    lineEl?.setAttribute("y2", height);

    if (labelEl) {
      labelEl.setAttribute("x", px + 6);
      labelEl.setAttribute("y", 18);
    }
  }

  function setHorizontalAsymptote(lineEl, labelEl, yVal, yMin, yMax) {
    const width = 600;
    const height = 260;
    const py = mapY(yVal, yMin, yMax, height);

    lineEl?.setAttribute("x1", 0);
    lineEl?.setAttribute("y1", py);
    lineEl?.setAttribute("x2", width);
    lineEl?.setAttribute("y2", py);

    if (labelEl) {
      labelEl.setAttribute("x", 10);
      labelEl.setAttribute("y", py - 7);
    }
  }

  function buildPathForInterval(f, a, b, xMin, xMax, yMin, yMax) {
    const width = 600;
    const height = 260;
    const N = 220; // smooth

    let d = "";
    let started = false;

    for (let i = 0; i <= N; i++) {
      const x = a + (i / N) * (b - a);
      let y = f(x);

      if (!isFinite(y) || Math.abs(y) > 1e3) {
        started = false;
        continue;
      }

      const px = mapX(x, xMin, xMax, width);
      const py = mapY(y, yMin, yMax, height);

      if (!started) {
        d += `M ${px.toFixed(2)} ${py.toFixed(2)} `;
        started = true;
      } else {
        d += `L ${px.toFixed(2)} ${py.toFixed(2)} `;
      }
    }
    return d.trim();
  }

  function plotRational({
    f,
    intervals,
    paths,
    svgId,
    gridId,
    xAxisId,
    yAxisId,
    xMin,
    xMax,
    yMin,
    yMax
  }) {
    injectGrid(document.getElementById(svgId), gridId, xMin, xMax, yMin, yMax);
    setAxes(document.getElementById(svgId), xAxisId, yAxisId, xMin, xMax, yMin, yMax);

    intervals.forEach((intv, idx) => {
      const pathEl = document.getElementById(paths[idx]);
      if (!pathEl) return;
      const d = buildPathForInterval(f, intv[0], intv[1], xMin, xMax, yMin, yMax);
      pathEl.setAttribute("d", d);
    });
  }

  /* -------------------------
     STEPPER CORE (unchanged)
  -------------------------- */
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

  /* =========================
     EXAMPLE 1 SETUP + PLOT
  ========================== */

  const as1 = {
    stepText: document.getElementById("as1StepText"),
    result: document.getElementById("as1Result"),
    prev: document.getElementById("as1Prev"),
    next: document.getElementById("as1Next"),
    play: document.getElementById("as1Play"),
    reset: document.getElementById("as1Reset"),

    den: document.getElementById("as1Den"),
    solve: document.getElementById("as1Solve"),
    haText: document.getElementById("as1HaText"),

    va: document.getElementById("as1Va"),
    vaLabel: document.getElementById("as1VaLabel"),
    ha: document.getElementById("as1Ha"),
    haLabel: document.getElementById("as1HaLabel"),
    left: document.getElementById("as1Left"),
    right: document.getElementById("as1Right")
  };

  // Plot settings (matches your other topic scale)
  const as1Range = { xMin: -10, xMax: 10, yMin: -8, yMax: 8 };
  const eps = 0.08;

  // f(x) = (2x+1)/(x-3)
  const f1 = (x) => (2*x + 1) / (x - 3);

  plotRational({
    f: f1,
    intervals: [
      [as1Range.xMin, 3 - eps],
      [3 + eps, as1Range.xMax]
    ],
    paths: ["as1Left", "as1Right"],
    svgId: "as1Graph",
    gridId: "as1Grid",
    xAxisId: "as1XAxis",
    yAxisId: "as1YAxis",
    ...as1Range
  });

  setVerticalAsymptote(as1.va, as1.vaLabel, 3, as1Range.xMin, as1Range.xMax);
  setHorizontalAsymptote(as1.ha, as1.haLabel, 2, as1Range.yMin, as1Range.yMax);

  const resetAs1 = () => {
    hideFactor(as1.den, as1.solve, as1.haText);
    hideLines(as1.va, as1.vaLabel, as1.ha, as1.haLabel, as1.left, as1.right);
  };

  const stepsAs1 = [
    { text: "Step 1: Look at the denominator.", action: () => showFactor(as1.den) },
    { text: "Set denominator = 0: x − 3 = 0 → x = 3.", action: () => showFactor(as1.den, as1.solve) },
    { text: "Vertical asymptote at x = 3.", action: () => showLines(as1.va, as1.vaLabel) },
    { text: "Degrees equal (1 and 1).", action: () => showFactor(as1.haText) },
    { text: "Horizontal asymptote is y = 2.", action: () => showLines(as1.ha, as1.haLabel) },
    { text: "Sketch branches approaching both asymptotes.", action: () => showLines(as1.left, as1.right) },
    {
      text: "Final summary.",
      action: () => {
        showFactor(as1.den, as1.solve, as1.haText);
        showLines(as1.va, as1.vaLabel, as1.ha, as1.haLabel, as1.left, as1.right);
        as1.result.innerHTML = `
          <strong>VA:</strong> x = 3<br>
          <strong>HA:</strong> y = 2
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: as1.stepText,
    resultEl: as1.result,
    prevBtn: as1.prev,
    nextBtn: as1.next,
    playBtn: as1.play,
    resetBtn: as1.reset,
    steps: stepsAs1,
    resetVisuals: resetAs1
  });

  /* =========================
     EXAMPLE 2 SETUP + PLOT
  ========================== */

  const as2 = {
    stepText: document.getElementById("as2StepText"),
    result: document.getElementById("as2Result"),
    prev: document.getElementById("as2Prev"),
    next: document.getElementById("as2Next"),
    play: document.getElementById("as2Play"),
    reset: document.getElementById("as2Reset"),

    fact: document.getElementById("as2Fact"),
    vaText: document.getElementById("as2VaText"),
    haText: document.getElementById("as2HaText"),

    vaA: document.getElementById("as2VaA"),
    vaALabel: document.getElementById("as2VaALabel"),
    vaB: document.getElementById("as2VaB"),
    vaBLabel: document.getElementById("as2VaBLabel"),
    ha: document.getElementById("as2Ha"),
    haLabel: document.getElementById("as2HaLabel"),

    left: document.getElementById("as2Left"),
    mid: document.getElementById("as2Mid"),
    right: document.getElementById("as2Right")
  };

  const as2Range = { xMin: -10, xMax: 10, yMin: -8, yMax: 8 };

  // g(x) = (x^2 + 4)/(2x^2 - 8x) = (x^2+4)/(2x(x-4))
  const g2 = (x) => (x*x + 4) / (2*x*x - 8*x);

  plotRational({
    f: g2,
    intervals: [
      [as2Range.xMin, 0 - eps],
      [0 + eps, 4 - eps],
      [4 + eps, as2Range.xMax]
    ],
    paths: ["as2Left", "as2Mid", "as2Right"],
    svgId: "as2Graph",
    gridId: "as2Grid",
    xAxisId: "as2XAxis",
    yAxisId: "as2YAxis",
    ...as2Range
  });

  setVerticalAsymptote(as2.vaA, as2.vaALabel, 0, as2Range.xMin, as2Range.xMax);
  setVerticalAsymptote(as2.vaB, as2.vaBLabel, 4, as2Range.xMin, as2Range.xMax);
  setHorizontalAsymptote(as2.ha, as2.haLabel, 0.5, as2Range.yMin, as2Range.yMax);

  const resetAs2 = () => {
    hideFactor(as2.fact, as2.vaText, as2.haText);
    hideLines(
      as2.vaA, as2.vaALabel,
      as2.vaB, as2.vaBLabel,
      as2.ha, as2.haLabel,
      as2.left, as2.mid, as2.right
    );
  };

  const stepsAs2 = [
    { text: "Step 1: Factor the denominator.", action: () => showFactor(as2.fact) },
    { text: "2x(x − 4)=0 → x=0 and x=4.", action: () => showFactor(as2.fact, as2.vaText) },
    { text: "Vertical asymptotes at x=0 and x=4.", action: () => showLines(as2.vaA, as2.vaALabel, as2.vaB, as2.vaBLabel) },
    { text: "Degrees equal (2 and 2).", action: () => showFactor(as2.haText) },
    { text: "Horizontal asymptote is y = 1/2.", action: () => showLines(as2.ha, as2.haLabel) },
    { text: "Sketch branches approaching asymptotes.", action: () => showLines(as2.left, as2.mid, as2.right) },
    {
      text: "Final summary.",
      action: () => {
        showFactor(as2.fact, as2.vaText, as2.haText);
        showLines(
          as2.vaA, as2.vaALabel,
          as2.vaB, as2.vaBLabel,
          as2.ha, as2.haLabel,
          as2.left, as2.mid, as2.right
        );
        as2.result.innerHTML = `
          <strong>VA:</strong> x = 0, x = 4<br>
          <strong>HA:</strong> y = 1/2
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: as2.stepText,
    resultEl: as2.result,
    prevBtn: as2.prev,
    nextBtn: as2.next,
    playBtn: as2.play,
    resetBtn: as2.reset,
    steps: stepsAs2,
    resetVisuals: resetAs2
  });

});
