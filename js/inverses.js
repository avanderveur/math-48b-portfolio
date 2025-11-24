/* =========================================================
   inverses.js — Inverse Functions + Reflection Over y = x
   Real plotted curves + stepper format matching Topics 1–8
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
      // some elements also use .show in CSS
      el.classList.add("show");
    });
  };

  const hideLines = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("shown-line");
      el.classList.remove("show");
      el.classList.add("hidden-line");
    });
  };

  const showFactor = (...els) => els.forEach(el => el?.classList.add("show"));
  const hideFactor = (...els) => els.forEach(el => el?.classList.remove("show"));

  const showCurve = (el) => el?.classList.add("show");
  const hideCurve = (el) => el?.classList.remove("show");

  /* ------------------------------
     Stepper engine (Topics 1–8)
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
     SVG coordinate system for inverses graphs
     viewBox: 0 0 640 360
     axes:
       x-axis at y=300
       y-axis at x=320
     use origin (0,0) => (320,300)
     scale: 40 px per unit
  ========================================================= */
  const ORIGIN_X = 320;
  const ORIGIN_Y = 300;
  const SCALE = 40;

  function toSvg(x, y) {
    return {
      sx: ORIGIN_X + x * SCALE,
      sy: ORIGIN_Y - y * SCALE
    };
  }

  function buildPath(f, xMin, xMax, step = 0.02, yClip = 8) {
    let d = "";
    let started = false;

    for (let x = xMin; x <= xMax; x += step) {
      const y = f(x);

      if (!isFinite(y) || y > yClip || y < -yClip) {
        started = false;
        continue;
      }

      const { sx, sy } = toSvg(x, y);
      if (sy < -200 || sy > 1000) { started = false; continue; }

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
     f(x)=2x+3
     f^-1(x)=(x-3)/2
  ========================================================= */

  const inv1 = {
    stepText: document.getElementById("inv1StepText"),
    result: document.getElementById("inv1Result"),
    prev: document.getElementById("inv1Prev"),
    next: document.getElementById("inv1Next"),
    play: document.getElementById("inv1Play"),
    reset: document.getElementById("inv1Reset"),

    s1: document.getElementById("inv1s1"),
    s2: document.getElementById("inv1s2"),
    s3: document.getElementById("inv1s3"),
    s4: document.getElementById("inv1s4"),

    refLine: document.getElementById("inv1RefLine"),
    refLabel: document.getElementById("inv1RefLabel"),

    curveF: document.getElementById("inv1CurveF"),
    curveInv: document.getElementById("inv1CurveInv"),
    labelF: document.getElementById("inv1LabelF"),
    labelInv: document.getElementById("inv1LabelInv"),

    pt: document.getElementById("inv1Pt"),
    ptLabel: document.getElementById("inv1PtLabel"),
    ptRef: document.getElementById("inv1PtRef"),
    ptRefLabel: document.getElementById("inv1PtRefLabel")
  };

  const resetInv1 = () => {
    hideFactor(inv1.s1, inv1.s2, inv1.s3, inv1.s4);
    hideLines(inv1.refLine, inv1.refLabel);
    hideLines(inv1.curveF, inv1.curveInv, inv1.labelF, inv1.labelInv);
    hideLines(inv1.pt, inv1.ptLabel, inv1.ptRef, inv1.ptRefLabel);
    hideCurve(inv1.curveF);
    hideCurve(inv1.curveInv);
    inv1.curveF.setAttribute("d", "");
    inv1.curveInv.setAttribute("d", "");
    inv1.result.innerHTML = "";
  };

  const f1 = (x) => 2 * x + 3;
  const finv1 = (x) => (x - 3) / 2;

  function drawInv1() {
    // f line
    const dF = buildPath(f1, -5, 5, 0.05, 8);
    inv1.curveF.setAttribute("d", dF);

    // inverse line
    const dInv = buildPath(finv1, -5, 5, 0.05, 8);
    inv1.curveInv.setAttribute("d", dInv);

    // place example point (1,5) and reflection (5,1)
    const p = toSvg(1, 5);
    const pr = toSvg(5, 1);

    inv1.pt.setAttribute("cx", p.sx);
    inv1.pt.setAttribute("cy", p.sy);
    inv1.ptLabel.setAttribute("x", p.sx + 10);
    inv1.ptLabel.setAttribute("y", p.sy + 5);

    inv1.ptRef.setAttribute("cx", pr.sx);
    inv1.ptRef.setAttribute("cy", pr.sy);
    inv1.ptRefLabel.setAttribute("x", pr.sx + 10);
    inv1.ptRefLabel.setAttribute("y", pr.sy - 5);
  }

  const inv1Steps = [
    { text: "Step 1: Start with y = f(x).", action: () => showFactor(inv1.s1) },
    { text: "Step 2: Swap x and y.", action: () => showFactor(inv1.s2) },
    { text: "Step 3: Solve for y.", action: () => showFactor(inv1.s3) },
    { text: "Step 4: Rename y as f⁻¹(x).", action: () => showFactor(inv1.s4) },

    {
      text: "Step 5: Reveal reflection line y = x.",
      action: () => showLines(inv1.refLine, inv1.refLabel)
    },

    {
      text: "Step 6: Plot f(x) and f⁻¹(x).",
      action: () => {
        drawInv1();
        showLines(inv1.curveF, inv1.labelF);
        showCurve(inv1.curveF);
        showLines(inv1.curveInv, inv1.labelInv);
        showCurve(inv1.curveInv);
      }
    },

    {
      text: "Step 7: Show a point and its reflected partner.",
      action: () => {
        drawInv1();
        showLines(inv1.pt, inv1.ptLabel, inv1.ptRef, inv1.ptRefLabel);
      }
    },

    {
      text: "Final summary for Example 1.",
      action: () => {
        drawInv1();
        showFactor(inv1.s1, inv1.s2, inv1.s3, inv1.s4);
        showLines(
          inv1.refLine, inv1.refLabel,
          inv1.curveF, inv1.labelF,
          inv1.curveInv, inv1.labelInv,
          inv1.pt, inv1.ptLabel, inv1.ptRef, inv1.ptRefLabel
        );
        showCurve(inv1.curveF);
        showCurve(inv1.curveInv);

        inv1.result.innerHTML = `
          <strong>Inverse:</strong> f⁻¹(x) = (x − 3)/2<br>
          Points swap: (1,5) ↔ (5,1)<br>
          Graphs reflect across y = x.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: inv1.stepText,
    resultEl: inv1.result,
    prevBtn: inv1.prev,
    nextBtn: inv1.next,
    playBtn: inv1.play,
    resetBtn: inv1.reset,
    steps: inv1Steps,
    resetVisuals: resetInv1
  });


  /* =========================================================
     EXAMPLE 2
     g(x)=(x-1)^3 + 2
     g^-1(x)=cuberoot(x-2)+1
  ========================================================= */

  const inv2 = {
    stepText: document.getElementById("inv2StepText"),
    result: document.getElementById("inv2Result"),
    prev: document.getElementById("inv2Prev"),
    next: document.getElementById("inv2Next"),
    play: document.getElementById("inv2Play"),
    reset: document.getElementById("inv2Reset"),

    s1: document.getElementById("inv2s1"),
    s2: document.getElementById("inv2s2"),
    s3: document.getElementById("inv2s3"),
    s4: document.getElementById("inv2s4"),

    refLine: document.getElementById("inv2RefLine"),
    refLabel: document.getElementById("inv2RefLabel"),

    curveF: document.getElementById("inv2CurveF"),
    curveInv: document.getElementById("inv2CurveInv"),
    labelF: document.getElementById("inv2LabelF"),
    labelInv: document.getElementById("inv2LabelInv"),
  };

  const resetInv2 = () => {
    hideFactor(inv2.s1, inv2.s2, inv2.s3, inv2.s4);
    hideLines(inv2.refLine, inv2.refLabel);
    hideLines(inv2.curveF, inv2.curveInv, inv2.labelF, inv2.labelInv);
    hideCurve(inv2.curveF);
    hideCurve(inv2.curveInv);
    inv2.curveF.setAttribute("d", "");
    inv2.curveInv.setAttribute("d", "");
    inv2.result.innerHTML = "";
  };

  const g2 = (x) => Math.pow(x - 1, 3) + 2;
  const ginv2 = (x) => Math.cbrt(x - 2) + 1;

  function drawInv2() {
    // Plot around the "interesting" center area
    const dF = buildPath(g2, -2, 4, 0.02, 8);
    const dInv = buildPath(ginv2, -2, 8, 0.02, 8);
    inv2.curveF.setAttribute("d", dF);
    inv2.curveInv.setAttribute("d", dInv);
  }

  const inv2Steps = [
    { text: "Step 1: Start with y = g(x).", action: () => showFactor(inv2.s1) },
    { text: "Step 2: Swap x and y.", action: () => showFactor(inv2.s2) },
    { text: "Step 3: Solve for y (cube root).", action: () => showFactor(inv2.s3) },
    { text: "Step 4: Rename y as g⁻¹(x).", action: () => showFactor(inv2.s4) },

    {
      text: "Step 5: Reveal reflection line y = x.",
      action: () => showLines(inv2.refLine, inv2.refLabel)
    },

    {
      text: "Step 6: Plot g(x) and its inverse g⁻¹(x).",
      action: () => {
        drawInv2();
        showLines(inv2.curveF, inv2.labelF);
        showCurve(inv2.curveF);
        showLines(inv2.curveInv, inv2.labelInv);
        showCurve(inv2.curveInv);
      }
    },

    {
      text: "Final summary for Example 2.",
      action: () => {
        drawInv2();
        showFactor(inv2.s1, inv2.s2, inv2.s3, inv2.s4);
        showLines(
          inv2.refLine, inv2.refLabel,
          inv2.curveF, inv2.labelF,
          inv2.curveInv, inv2.labelInv
        );
        showCurve(inv2.curveF);
        showCurve(inv2.curveInv);

        inv2.result.innerHTML = `
          <strong>Inverse:</strong> g⁻¹(x)=∛(x − 2) + 1<br>
          This inverse undoes the cube by taking a cube root.<br>
          Graphs reflect across y = x.
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: inv2.stepText,
    resultEl: inv2.result,
    prevBtn: inv2.prev,
    nextBtn: inv2.next,
    playBtn: inv2.play,
    resetBtn: inv2.reset,
    steps: inv2Steps,
    resetVisuals: resetInv2
  });

});
