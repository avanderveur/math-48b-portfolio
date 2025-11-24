/* =========================================================
   graphing.js — Graphing Rational Functions (FULL)
   Matches graphing.html IDs exactly
   Two animated examples with real plotted curves
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Helpers
  ------------------------------ */
  const showLines = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("hidden-line");
      el.classList.add("shown-line");
      el.classList.add("show");
    });
  };

  const hideLines = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("shown-line", "show");
      el.classList.add("hidden-line");
    });
  };

  const showFactor = (...els) => els.forEach(el => el?.classList.add("show"));
  const hideFactor = (...els) => els.forEach(el => el?.classList.remove("show"));

  /* ------------------------------
     Shared Stepper Engine
  ------------------------------ */
  function makeStepper({
    stepTextEl, resultEl,
    prevBtn, nextBtn, playBtn, resetBtn,
    steps, resetVisuals,
    initText = "Press Next or Play to start."
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
      stepTextEl.textContent = initText;
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    playBtn.addEventListener("click", () => playing ? stop() : play());
    resetBtn.addEventListener("click", reset);

    resetVisuals();
    apply(0);
    stepTextEl.textContent = initText;
  }

  /* ------------------------------
     SVG Plot Utilities
  ------------------------------ */
  const ORIGIN = { x: 320, y: 180 };
  const SCALE  = 40; // px per 1 unit

  const toSvgX = (x) => ORIGIN.x + x * SCALE;
  const toSvgY = (y) => ORIGIN.y - y * SCALE;

  function buildPath(fn, xStart, xEnd, step = 0.02, skipIf = () => false) {
    let d = "";
    let started = false;

    for (let x = xStart; x <= xEnd; x += step) {
      if (skipIf(x)) { started = false; continue; }

      const y = fn(x);
      if (!Number.isFinite(y) || Math.abs(y) > 50) {
        started = false;
        continue;
      }

      const sx = toSvgX(x);
      const sy = toSvgY(y);

      if (!started) {
        d += `M ${sx} ${sy} `;
        started = true;
      } else {
        d += `L ${sx} ${sy} `;
      }
    }

    return d.trim();
  }

  function setLineX(lineEl, xVal) {
    const px = toSvgX(xVal);
    lineEl?.setAttribute("x1", px);
    lineEl?.setAttribute("x2", px);
    lineEl?.setAttribute("y1", 0);
    lineEl?.setAttribute("y2", 360);
    return px;
  }

  function setLineY(lineEl, yVal) {
    const py = toSvgY(yVal);
    lineEl?.setAttribute("x1", 0);
    lineEl?.setAttribute("x2", 640);
    lineEl?.setAttribute("y1", py);
    lineEl?.setAttribute("y2", py);
    return py;
  }

  /* =========================================================
     EXAMPLE 1
     f(x) = (x+2)/(x-1)
  ========================================================= */

  const gr1 = {
    stepText: document.getElementById("gr1StepText"),
    result:   document.getElementById("gr1Result"),
    prev:     document.getElementById("gr1Prev"),
    next:     document.getElementById("gr1Next"),
    play:     document.getElementById("gr1Play"),
    reset:    document.getElementById("gr1Reset"),

    domain:  document.getElementById("gr1Domain"),
    vaText:  document.getElementById("gr1VaText"),
    haText:  document.getElementById("gr1HaText"),
    xText:   document.getElementById("gr1XText"),
    yText:   document.getElementById("gr1YText"),

    va:      document.getElementById("gr1Va"),
    vaLabel: document.getElementById("gr1VaLabel"),
    ha:      document.getElementById("gr1Ha"),
    haLabel: document.getElementById("gr1HaLabel"),

    xint:      document.getElementById("gr1Xint"),
    xintLabel: document.getElementById("gr1XintLabel"),
    yint:      document.getElementById("gr1Yint"),
    yintLabel: document.getElementById("gr1YintLabel"),

    curve: document.getElementById("gr1Curve")
  };

  const f1 = (x) => (x + 2) / (x - 1);
  const eps1 = 0.05;

  // Asymptotes
  const gr1VAx = setLineX(gr1.va, 1);
  gr1.vaLabel?.setAttribute("x", gr1VAx + 6);

  const gr1HAy = setLineY(gr1.ha, 1);
  gr1.haLabel?.setAttribute("y", gr1HAy - 8);

  // Intercepts
  gr1.xint?.setAttribute("cx", toSvgX(-2));
  gr1.xint?.setAttribute("cy", toSvgY(0));
  gr1.xintLabel?.setAttribute("x", toSvgX(-2) - 25);
  gr1.xintLabel?.setAttribute("y", toSvgY(0) + 20);

  gr1.yint?.setAttribute("cx", toSvgX(0));
  gr1.yint?.setAttribute("cy", toSvgY(-2));
  gr1.yintLabel?.setAttribute("x", toSvgX(0) + 10);
  gr1.yintLabel?.setAttribute("y", toSvgY(-2) + 18);

  // Curve (break at VA)
  gr1.curve?.setAttribute(
    "d",
    buildPath(f1, -8, 8, 0.02, x => Math.abs(x - 1) < eps1)
  );

  const resetGr1 = () => {
    hideFactor(gr1.domain, gr1.vaText, gr1.haText, gr1.xText, gr1.yText);
    hideLines(
      gr1.va, gr1.vaLabel,
      gr1.ha, gr1.haLabel,
      gr1.xint, gr1.xintLabel,
      gr1.yint, gr1.yintLabel,
      gr1.curve
    );
  };

  const stepsGr1 = [
    { text: "Step 1: Denominator cannot be 0 → domain restriction x ≠ 1.", action: () => showFactor(gr1.domain) },
    { text: "Step 2: Vertical asymptote at x = 1.", action: () => { showFactor(gr1.vaText); showLines(gr1.va, gr1.vaLabel); } },
    { text: "Step 3: Degrees equal → horizontal asymptote y = 1.", action: () => { showFactor(gr1.haText); showLines(gr1.ha, gr1.haLabel); } },
    { text: "Step 4: x-intercept: numerator = 0 → x = −2.", action: () => { showFactor(gr1.xText); showLines(gr1.xint, gr1.xintLabel); } },
    { text: "Step 5: y-intercept: f(0)=−2.", action: () => { showFactor(gr1.yText); showLines(gr1.yint, gr1.yintLabel); } },
    { text: "Step 6: Draw curve approaching asymptotes.", action: () => showLines(gr1.curve) },
    {
      text: "Final summary.",
      action: () => {
        showFactor(gr1.domain, gr1.vaText, gr1.haText, gr1.xText, gr1.yText);
        showLines(gr1.va, gr1.vaLabel, gr1.ha, gr1.haLabel, gr1.xint, gr1.xintLabel, gr1.yint, gr1.yintLabel, gr1.curve);
        gr1.result.innerHTML = `
          <strong>Domain:</strong> x ≠ 1<br>
          <strong>VA:</strong> x = 1<br>
          <strong>HA:</strong> y = 1<br>
          <strong>x-intercept:</strong> (−2, 0)<br>
          <strong>y-intercept:</strong> (0, −2)
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: gr1.stepText,
    resultEl: gr1.result,
    prevBtn: gr1.prev,
    nextBtn: gr1.next,
    playBtn: gr1.play,
    resetBtn: gr1.reset,
    steps: stepsGr1,
    resetVisuals: resetGr1
  });

  /* =========================================================
     EXAMPLE 2
     g(x) = (x^2-4)/(x^2-5x+6)
          = (x+2)/(x-3) with hole at x=2
  ========================================================= */

  const gr2 = {
    stepText: document.getElementById("gr2StepText"),
    result:   document.getElementById("gr2Result"),
    prev:     document.getElementById("gr2Prev"),
    next:     document.getElementById("gr2Next"),
    play:     document.getElementById("gr2Play"),
    reset:    document.getElementById("gr2Reset"),

    fact:     document.getElementById("gr2Fact"),
    domain:   document.getElementById("gr2Domain"),
    holeText: document.getElementById("gr2HoleText"),
    vaText:   document.getElementById("gr2VaText"),
    haText:   document.getElementById("gr2HaText"),

    va:      document.getElementById("gr2Va"),
    vaLabel: document.getElementById("gr2VaLabel"),
    ha:      document.getElementById("gr2Ha"),
    haLabel: document.getElementById("gr2HaLabel"),

    hole:      document.getElementById("gr2Hole"),
    holeInner: document.getElementById("gr2HoleInner"),
    holeLabel: document.getElementById("gr2HoleLabel"),

    xint:      document.getElementById("gr2Xint"),
    xintLabel: document.getElementById("gr2XintLabel"),

    curve: document.getElementById("gr2Curve")
  };

  const g2simp = (x) => (x + 2) / (x - 3);
  const eps2 = 0.05;

  // Asymptotes
  const gr2VAx = setLineX(gr2.va, 3);
  gr2.vaLabel?.setAttribute("x", gr2VAx + 6);

  const gr2HAy = setLineY(gr2.ha, 1);
  gr2.haLabel?.setAttribute("y", gr2HAy - 8);

  // Hole at (2, -4)
  gr2.hole?.setAttribute("cx", toSvgX(2));
  gr2.hole?.setAttribute("cy", toSvgY(-4));
  gr2.holeInner?.setAttribute("cx", toSvgX(2));
  gr2.holeInner?.setAttribute("cy", toSvgY(-4));
  gr2.holeLabel?.setAttribute("x", toSvgX(2) + 10);
  gr2.holeLabel?.setAttribute("y", toSvgY(-4) - 8);

  // x-intercept (-2,0)
  gr2.xint?.setAttribute("cx", toSvgX(-2));
  gr2.xint?.setAttribute("cy", toSvgY(0));
  gr2.xintLabel?.setAttribute("x", toSvgX(-2) - 25);
  gr2.xintLabel?.setAttribute("y", toSvgY(0) + 20);

  // Curve (break at VA and hole)
  gr2.curve?.setAttribute(
    "d",
    buildPath(g2simp, -8, 8, 0.02, x =>
      Math.abs(x - 3) < eps2 || Math.abs(x - 2) < eps2
    )
  );

  const resetGr2 = () => {
    hideFactor(gr2.fact, gr2.domain, gr2.holeText, gr2.vaText, gr2.haText);
    hideLines(
      gr2.va, gr2.vaLabel,
      gr2.ha, gr2.haLabel,
      gr2.hole, gr2.holeInner, gr2.holeLabel,
      gr2.xint, gr2.xintLabel,
      gr2.curve
    );
  };

  const stepsGr2 = [
    { text: "Step 1: Factor numerator/denominator.", action: () => showFactor(gr2.fact) },
    { text: "Step 2: Domain restrictions from original denominator → x ≠ 2, 3.", action: () => showFactor(gr2.fact, gr2.domain) },
    {
      text: "Step 3: Cancel common factor (x−2) → creates a hole at x=2.",
      action: () => showFactor(gr2.fact, gr2.domain, gr2.holeText)
    },
    { text: "Step 4: Vertical asymptote at x=3.", action: () => { showFactor(gr2.vaText); showLines(gr2.va, gr2.vaLabel); } },
    { text: "Step 5: Horizontal asymptote y=1 (equal degrees).", action: () => { showFactor(gr2.haText); showLines(gr2.ha, gr2.haLabel); } },
    { text: "Step 6: x-intercept from simplified numerator: x=−2.", action: () => showLines(gr2.xint, gr2.xintLabel) },
    { text: "Step 7: Plot curve approaching asymptotes + skipping the hole.", action: () => showLines(gr2.curve, gr2.hole, gr2.holeInner, gr2.holeLabel) },
    {
      text: "Final summary.",
      action: () => {
        showFactor(gr2.fact, gr2.domain, gr2.holeText, gr2.vaText, gr2.haText);
        showLines(
          gr2.va, gr2.vaLabel,
          gr2.ha, gr2.haLabel,
          gr2.hole, gr2.holeInner, gr2.holeLabel,
          gr2.xint, gr2.xintLabel,
          gr2.curve
        );
        gr2.result.innerHTML = `
          <strong>Domain:</strong> x ≠ 2, 3<br>
          <strong>Hole:</strong> (2, −4)<br>
          <strong>VA:</strong> x = 3<br>
          <strong>HA:</strong> y = 1<br>
          <strong>x-intercept:</strong> (−2, 0)
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: gr2.stepText,
    resultEl: gr2.result,
    prevBtn: gr2.prev,
    nextBtn: gr2.next,
    playBtn: gr2.play,
    resetBtn: gr2.reset,
    steps: stepsGr2,
    resetVisuals: resetGr2
  });

});
