/* =========================================================
   exponential.js — Exponential Functions + Repeated Multiplication
   Real plotted curves + stepper format matching Topics 1–6
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Helpers (same reveal style)
  ------------------------------ */
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

  const showFactor = (...els) => els.forEach(el => el?.classList.add("show"));
  const hideFactor = (...els) => els.forEach(el => el?.classList.remove("show"));

  const showPoint = (...els) => els.forEach(el => el?.classList.add("show"));
  const hidePoint = (...els) => els.forEach(el => el?.classList.remove("show"));

  const showCurve = (el) => el?.classList.add("show");
  const hideCurve = (el) => el?.classList.remove("show");

  /* ------------------------------
     Stepper engine (Topics 1–6)
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
     REAL EXPONENTIAL CURVE PLOTTING
     SVG viewBox: 0 0 640 360
     Axes in HTML:
       y-axis at x=80
       x-axis at y=300
     So origin (0,0) in math is (80,300).
     We also inferred scaleY=20 px/unit from intercept placement.
  ========================================================= */

  function toSvgCoords(x, y, originX, originY, scaleX, scaleY) {
    return {
      sx: originX + x * scaleX,
      sy: originY - y * scaleY
    };
  }

  function buildExpPath({
    f,
    xMin, xMax,
    step = 0.02,
    originX, originY,
    scaleX, scaleY,
    yClip = 18
  }) {
    let d = "";
    let started = false;

    for (let x = xMin; x <= xMax; x += step) {
      const y = f(x);

      if (!isFinite(y)) {
        started = false;
        continue;
      }

      // clip extreme growth so the curve doesn't spike ugly
      if (y > yClip) {
        started = false;
        continue;
      }

      const { sx, sy } = toSvgCoords(x, y, originX, originY, scaleX, scaleY);

      if (sy < -200 || sy > 1000) {
        started = false;
        continue;
      }

      if (!started) {
        d += `M ${sx.toFixed(2)} ${sy.toFixed(2)} `;
        started = true;
      } else {
        d += `L ${sx.toFixed(2)} ${sy.toFixed(2)} `;
      }
    }

    return d.trim();
  }

  /* =========================================================
     EXAMPLE 1
     f(x)=3*2^x  (growth)
  ========================================================= */

  const ex1 = {
    stepText: document.getElementById("ex1StepText"),
    result: document.getElementById("ex1Result"),
    prev: document.getElementById("ex1Prev"),
    next: document.getElementById("ex1Next"),
    play: document.getElementById("ex1Play"),
    reset: document.getElementById("ex1Reset"),

    start: document.getElementById("ex1Start"),
    base: document.getElementById("ex1Base"),
    pattern: document.getElementById("ex1Pattern"),

    r1: document.getElementById("ex1r1"),
    r2: document.getElementById("ex1r2"),
    r3: document.getElementById("ex1r3"),
    r4: document.getElementById("ex1r4"),

    haLabel: document.getElementById("ex1HaLabel"),
    yInt: document.getElementById("ex1Yint"),
    yIntLabel: document.getElementById("ex1YintLabel"),

    curve: document.getElementById("ex1Curve")
  };

  const resetEx1 = () => {
    hideFactor(ex1.start, ex1.base, ex1.pattern);
    hideLines(ex1.r1, ex1.r2, ex1.r3, ex1.r4);
    hideLines(ex1.haLabel);
    hidePoint(ex1.yInt, ex1.yIntLabel);
    hideLines(ex1.curve);
    hideCurve(ex1.curve);
    ex1.curve.setAttribute("d", "");
    ex1.result.innerHTML = "";
  };

  const f1 = (x) => 3 * Math.pow(2, x);

  function drawExample1Curve() {
    const d = buildExpPath({
      f: f1,
      xMin: -1,
      xMax: 6,
      step: 0.02,
      originX: 80,
      originY: 300,
      scaleX: 80,
      scaleY: 20,
      yClip: 20
    });
    ex1.curve.setAttribute("d", d);
  }

  const ex1Steps = [
    { text: "Step 1: Identify the starting value a.", action: () => showFactor(ex1.start) },
    { text: "Step 2: Identify the base b (multiplier).", action: () => showFactor(ex1.base) },
    { text: "Step 3: This means repeated multiplication by 2.", action: () => showFactor(ex1.pattern) },

    { text: "Step 4: Build a table of values.", action: () => showLines(ex1.r1) },
    { text: "Each step multiplies by 2.", action: () => showLines(ex1.r2) },
    { text: "Continue the repeated multiplication.", action: () => showLines(ex1.r3) },
    { text: "Growth keeps doubling.", action: () => showLines(ex1.r4) },

    { text: "Step 5: Exponential graphs approach y = 0.", action: () => showLines(ex1.haLabel) },

    { text: "Step 6: Plot the y-intercept (0,3).", action: () => showPoint(ex1.yInt, ex1.yIntLabel) },

    { text: "Step 7: Plot the real exponential curve.", action: () => {
        drawExample1Curve();
        showLines(ex1.curve);
        showCurve(ex1.curve);
      }
    },

    { text: "Final summary for Example 1.", action: () => {
        drawExample1Curve();
        showFactor(ex1.start, ex1.base, ex1.pattern);
        showLines(ex1.r1, ex1.r2, ex1.r3, ex1.r4, ex1.haLabel, ex1.curve);
        showPoint(ex1.yInt, ex1.yIntLabel);
        showCurve(ex1.curve);

        ex1.result.innerHTML = `
          <strong>Growth Function:</strong> f(x)=3·2^x<br>
          <strong>a=3:</strong> starting value / y-int<br>
          <strong>b=2:</strong> multiplier each step<br>
          <strong>HA:</strong> y=0
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: ex1.stepText,
    resultEl: ex1.result,
    prevBtn: ex1.prev,
    nextBtn: ex1.next,
    playBtn: ex1.play,
    resetBtn: ex1.reset,
    steps: ex1Steps,
    resetVisuals: resetEx1
  });


  /* =========================================================
     EXAMPLE 2
     g(x)=5*(1/3)^x  (decay)
  ========================================================= */

  const ex2 = {
    stepText: document.getElementById("ex2StepText"),
    result: document.getElementById("ex2Result"),
    prev: document.getElementById("ex2Prev"),
    next: document.getElementById("ex2Next"),
    play: document.getElementById("ex2Play"),
    reset: document.getElementById("ex2Reset"),

    start: document.getElementById("ex2Start"),
    base: document.getElementById("ex2Base"),
    pattern: document.getElementById("ex2Pattern"),

    r1: document.getElementById("ex2r1"),
    r2: document.getElementById("ex2r2"),
    r3: document.getElementById("ex2r3"),
    r4: document.getElementById("ex2r4"),

    haLabel: document.getElementById("ex2HaLabel"),
    yInt: document.getElementById("ex2Yint"),
    yIntLabel: document.getElementById("ex2YintLabel"),

    curve: document.getElementById("ex2Curve")
  };

  const resetEx2 = () => {
    hideFactor(ex2.start, ex2.base, ex2.pattern);
    hideLines(ex2.r1, ex2.r2, ex2.r3, ex2.r4);
    hideLines(ex2.haLabel);
    hidePoint(ex2.yInt, ex2.yIntLabel);
    hideLines(ex2.curve);
    hideCurve(ex2.curve);
    ex2.curve.setAttribute("d", "");
    ex2.result.innerHTML = "";
  };

  const f2 = (x) => 5 * Math.pow(1/3, x);

  function drawExample2Curve() {
    const d = buildExpPath({
      f: f2,
      xMin: -1,
      xMax: 6,
      step: 0.02,
      originX: 80,
      originY: 300,
      scaleX: 80,
      scaleY: 20,
      yClip: 20
    });
    ex2.curve.setAttribute("d", d);
  }

  const ex2Steps = [
    { text: "Step 1: Identify starting value a.", action: () => showFactor(ex2.start) },
    { text: "Step 2: Identify base b (multiplier).", action: () => showFactor(ex2.base) },
    { text: "Step 3: This means repeated multiplication by 1/3.", action: () => showFactor(ex2.pattern) },

    { text: "Step 4: Build a table of values.", action: () => showLines(ex2.r1) },
    { text: "Multiply by 1/3 each step.", action: () => showLines(ex2.r2) },
    { text: "Continue decay pattern.", action: () => showLines(ex2.r3) },
    { text: "Values approach 0.", action: () => showLines(ex2.r4) },

    { text: "Step 5: Exponential graphs approach y = 0.", action: () => showLines(ex2.haLabel) },

    { text: "Step 6: Plot the y-intercept (0,5).", action: () => showPoint(ex2.yInt, ex2.yIntLabel) },

    { text: "Step 7: Plot the real decay curve.", action: () => {
        drawExample2Curve();
        showLines(ex2.curve);
        showCurve(ex2.curve);
      }
    },

    { text: "Final summary for Example 2.", action: () => {
        drawExample2Curve();
        showFactor(ex2.start, ex2.base, ex2.pattern);
        showLines(ex2.r1, ex2.r2, ex2.r3, ex2.r4, ex2.haLabel, ex2.curve);
        showPoint(ex2.yInt, ex2.yIntLabel);
        showCurve(ex2.curve);

        ex2.result.innerHTML = `
          <strong>Decay Function:</strong> g(x)=5·(1/3)^x<br>
          <strong>a=5:</strong> starting value / y-int<br>
          <strong>b=1/3:</strong> multiplier each step<br>
          <strong>HA:</strong> y=0
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: ex2.stepText,
    resultEl: ex2.result,
    prevBtn: ex2.prev,
    nextBtn: ex2.next,
    playBtn: ex2.play,
    resetBtn: ex2.reset,
    steps: ex2Steps,
    resetVisuals: resetEx2
  });

});
