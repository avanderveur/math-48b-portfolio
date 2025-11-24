/* =========================================================
   logarithms.js — Logarithms Topic
   Stepper format matching Topics 1–9 + real log curve
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Reveal helpers
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

  /* ------------------------------
     Stepper engine (same as others)
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
     EXAMPLE 1 — log_3(81)
  ========================================================= */

  const log1 = {
    stepText: document.getElementById("log1StepText"),
    result: document.getElementById("log1Result"),
    prev: document.getElementById("log1Prev"),
    next: document.getElementById("log1Next"),
    play: document.getElementById("log1Play"),
    reset: document.getElementById("log1Reset"),

    s1: document.getElementById("log1s1"),
    s2: document.getElementById("log1s2"),
    s3: document.getElementById("log1s3"),
    s4: document.getElementById("log1s4"),
  };

  const resetLog1 = () => {
    hideFactor(log1.s1, log1.s2, log1.s3, log1.s4);
    log1.result.innerHTML = "";
  };

  const log1Steps = [
    { text: "Step 1: Write the log equation.", action: () => showFactor(log1.s1) },
    { text: "Step 2: Convert to exponential form.", action: () => showFactor(log1.s2) },
    { text: "Step 3: Recognize 81 as a power of 3.", action: () => showFactor(log1.s3) },
    { text: "Step 4: Solve for y.", action: () => showFactor(log1.s4) },
    { text: "Final result.", action: () => {
        showFactor(log1.s1, log1.s2, log1.s3, log1.s4);
        log1.result.innerHTML = `
          <strong>log₃(81) = 4</strong><br>
          Because 3⁴ = 81.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: log1.stepText,
    resultEl: log1.result,
    prevBtn: log1.prev,
    nextBtn: log1.next,
    playBtn: log1.play,
    resetBtn: log1.reset,
    steps: log1Steps,
    resetVisuals: resetLog1
  });

  /* =========================================================
     EXAMPLE 2 — 5^x = 1/125
  ========================================================= */

  const log2 = {
    stepText: document.getElementById("log2StepText"),
    result: document.getElementById("log2Result"),
    prev: document.getElementById("log2Prev"),
    next: document.getElementById("log2Next"),
    play: document.getElementById("log2Play"),
    reset: document.getElementById("log2Reset"),

    s1: document.getElementById("log2s1"),
    s2: document.getElementById("log2s2"),
    s3: document.getElementById("log2s3"),
    s4: document.getElementById("log2s4"),
  };

  const resetLog2 = () => {
    hideFactor(log2.s1, log2.s2, log2.s3, log2.s4);
    log2.result.innerHTML = "";
  };

  const log2Steps = [
    { text: "Step 1: Start with the exponential equation.", action: () => showFactor(log2.s1) },
    { text: "Step 2: Convert to logarithmic form.", action: () => showFactor(log2.s2) },
    { text: "Step 3: Rewrite 1/125 as a power of 5.", action: () => showFactor(log2.s3) },
    { text: "Step 4: Solve for x.", action: () => showFactor(log2.s4) },
    { text: "Final result.", action: () => {
        showFactor(log2.s1, log2.s2, log2.s3, log2.s4);
        log2.result.innerHTML = `
          <strong>x = −3</strong><br>
          Because 5⁻³ = 1/125.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: log2.stepText,
    resultEl: log2.result,
    prevBtn: log2.prev,
    nextBtn: log2.next,
    playBtn: log2.play,
    resetBtn: log2.reset,
    steps: log2Steps,
    resetVisuals: resetLog2
  });

  /* =========================================================
     REAL LOG CURVE (base 2)
     SVG viewBox: 0 0 640 360
     origin is (80,300)
     scaleX = 80 px/unit
     scaleY = 40 px/unit
  ========================================================= */

  function toSvgCoords(x, y, originX, originY, scaleX, scaleY) {
    return {
      sx: originX + x * scaleX,
      sy: originY - y * scaleY
    };
  }

  function buildLogPath({
    f,
    xMin, xMax,
    step = 0.02,
    originX, originY,
    scaleX, scaleY,
    yMinClip = -5,
    yMaxClip = 5
  }) {
    let d = "";
    let started = false;

    for (let x = xMin; x <= xMax; x += step) {
      const y = f(x);
      if (!isFinite(y)) { started = false; continue; }
      if (y < yMinClip || y > yMaxClip) { started = false; continue; }

      const { sx, sy } = toSvgCoords(x, y, originX, originY, scaleX, scaleY);

      if (!started) {
        d += `M ${sx.toFixed(2)} ${sy.toFixed(2)} `;
        started = true;
      } else {
        d += `L ${sx.toFixed(2)} ${sy.toFixed(2)} `;
      }
    }

    return d.trim();
  }

  const logCurve = document.getElementById("logCurve");
  if (logCurve) {
    const fLog2 = (x) => Math.log(x) / Math.log(2);

    const d = buildLogPath({
      f: fLog2,
      xMin: 0.08,
      xMax: 6.5,
      step: 0.02,
      originX: 80,
      originY: 300,
      scaleX: 80,
      scaleY: 40
    });

    logCurve.setAttribute("d", d);
  }

});
