/* =========================================================
   rational-functions.js (UPDATED)
   Accurate graph plotting + Desmos-style grid
   Two animated examples with independent steppers.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Helpers ---------- */

  const show = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("hidden-line");
      el.classList.add("shown-line");
    });
  };

  const hide = (...els) => {
    els.forEach(el => {
      if (!el) return;
      el.classList.remove("shown-line");
      el.classList.add("hidden-line");
    });
  };

  const makeStepper = ({
    stepTextEl,
    resultEl,
    prevBtn,
    nextBtn,
    playBtn,
    resetBtn,
    steps,
    resetVisuals,
    initText
  }) => {

    let stepIndex = 0;
    let playing = false;
    let timer = null;

    const applyStep = (i) => {
      stepIndex = i;
      const s = steps[stepIndex];
      stepTextEl.textContent = s.text;
      s.action();

      prevBtn.disabled = stepIndex === 0;
      nextBtn.disabled = stepIndex === steps.length - 1;
    };

    const rebuildTo = (targetIndex) => {
      resetVisuals();
      resultEl.innerHTML = "";
      for (let k = 0; k <= targetIndex; k++) {
        steps[k].action();
      }
      stepTextEl.textContent = steps[targetIndex].text;

      prevBtn.disabled = targetIndex === 0;
      nextBtn.disabled = targetIndex === steps.length - 1;
      stepIndex = targetIndex;
    };

    const next = () => {
      if (stepIndex < steps.length - 1) applyStep(stepIndex + 1);
    };

    const prev = () => {
      if (stepIndex > 0) rebuildTo(stepIndex - 1);
    };

    const stopPlay = () => {
      playing = false;
      playBtn.textContent = "Play";
      if (timer) clearInterval(timer);
      timer = null;
    };

    const startPlay = () => {
      if (playing) return;
      playing = true;
      playBtn.textContent = "Pause";

      timer = setInterval(() => {
        if (stepIndex >= steps.length - 1) {
          stopPlay();
          return;
        }
        next();
      }, 1200);
    };

    const reset = () => {
      stopPlay();
      resetVisuals();
      resultEl.innerHTML = "";
      applyStep(0);
      stepTextEl.textContent = initText;
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    resetBtn.addEventListener("click", reset);
    playBtn.addEventListener("click", () => playing ? stopPlay() : startPlay());

    resetVisuals();
    applyStep(0);
    stepTextEl.textContent = initText;
  };

  /* ---------- Graph System ---------- */

  const ORIGIN = { x: 300, y: 130 };
  const SCALE = 30; // 30px = 1 unit

  const toSvgX = x => ORIGIN.x + x * SCALE;
  const toSvgY = y => ORIGIN.y - y * SCALE;

  function injectGrid(svg) {
    const minorStep = SCALE / 2;  // 0.5 units
    const majorStep = SCALE;      // 1 unit

    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Vertical lines
    for (let x = 0; x <= 600; x += minorStep) {
      const isMajor = (x % majorStep === 0);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("x2", x);
      line.setAttribute("y1", 0);
      line.setAttribute("y2", 260);
      line.setAttribute("class", isMajor ? "grid-major" : "grid-minor");
      gridGroup.appendChild(line);
    }

    // Horizontal lines
    for (let y = 0; y <= 260; y += minorStep) {
      const isMajor = (y % majorStep === 0);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("x1", 0);
      line.setAttribute("x2", 600);
      line.setAttribute("class", isMajor ? "grid-major" : "grid-minor");
      gridGroup.appendChild(line);
    }

    svg.insertBefore(gridGroup, svg.firstChild);
  }

  function buildPath(fn, xStart, xEnd, step = 0.05, skipIf = () => false) {
    let d = "";
    let started = false;

    for (let x = xStart; x <= xEnd; x += step) {
      if (skipIf(x)) { started = false; continue; }

      const y = fn(x);
      if (!Number.isFinite(y)) { started = false; continue; }

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

  /* =========================================================
     EXAMPLE 1 SETUP
     f(x) = (x+1)/(x-2)
     ========================================================= */

  const rf1Graph = document.getElementById("rf1Graph");
  injectGrid(rf1Graph);

  const rf1Fn = x => (x + 1) / (x - 2);

  // graph pieces
  const rf1Va      = document.getElementById("rf1Va");
  const rf1VaLabel = document.getElementById("rf1VaLabel");
  const rf1Ha      = document.getElementById("rf1Ha");
  const rf1HaLabel = document.getElementById("rf1HaLabel");
  const rf1Left    = document.getElementById("rf1Left");
  const rf1Right   = document.getElementById("rf1Right");
  const rf1Xint    = document.getElementById("rf1Xint");
  const rf1Yint    = document.getElementById("rf1Yint");

  // Set exact positions
  const rf1VAx = toSvgX(2);
  rf1Va.setAttribute("x1", rf1VAx);
  rf1Va.setAttribute("x2", rf1VAx);
  rf1Va.setAttribute("y1", 0);
  rf1Va.setAttribute("y2", 260);
  rf1VaLabel.setAttribute("x", rf1VAx + 6);
  rf1VaLabel.setAttribute("y", 18);

  const rf1HAy = toSvgY(1);
  rf1Ha.setAttribute("x1", 0);
  rf1Ha.setAttribute("x2", 600);
  rf1Ha.setAttribute("y1", rf1HAy);
  rf1Ha.setAttribute("y2", rf1HAy);
  rf1HaLabel.setAttribute("x", 10);
  rf1HaLabel.setAttribute("y", rf1HAy - 6);

  // Intercepts
  rf1Xint.setAttribute("cx", toSvgX(-1));
  rf1Xint.setAttribute("cy", toSvgY(0));

  rf1Yint.setAttribute("cx", toSvgX(0));
  rf1Yint.setAttribute("cy", toSvgY(-0.5));

  // Accurate curves
  rf1Left.setAttribute("d", buildPath(rf1Fn, -9.5, 1.9, 0.05, x => Math.abs(x - 2) < 0.03));
  rf1Right.setAttribute("d", buildPath(rf1Fn, 2.1, 9.5, 0.05, x => Math.abs(x - 2) < 0.03));

  const rf1Pieces = [rf1Va, rf1VaLabel, rf1Ha, rf1HaLabel, rf1Left, rf1Right, rf1Xint, rf1Yint];
  const rf1ResetVisuals = () => hide(...rf1Pieces);

  const rf1StepText = document.getElementById("rf1StepText");
  const rf1Result   = document.getElementById("rf1Result");
  const rf1Prev = document.getElementById("rf1Prev");
  const rf1Next = document.getElementById("rf1Next");
  const rf1Play = document.getElementById("rf1Play");
  const rf1Reset= document.getElementById("rf1Reset");

  const rf1Steps = [
    { text: "Step 1: Domain restrictions — the denominator cannot be 0.", action: () => {} },
    { text: "Set denominator = 0: x − 2 = 0 → x = 2 is excluded.", action: () => {} },
    { text: "Step 2: Vertical asymptote at x = 2 (no factor cancels).", action: () => show(rf1Va, rf1VaLabel) },
    { text: "Step 3: Horizontal asymptote — degrees are equal (1 and 1).", action: () => {} },
    { text: "Leading coefficient ratio 1/1 → HA: y = 1.", action: () => show(rf1Ha, rf1HaLabel) },
    { text: "Step 4: x-intercept — numerator = 0 → x + 1 = 0 → x = −1.", action: () => show(rf1Xint) },
    { text: "Step 5: y-intercept — plug x = 0 → f(0)=1/(−2)=−1/2.", action: () => show(rf1Yint) },
    { text: "Step 6: Sketch branches approaching asymptotes.", action: () => show(rf1Left, rf1Right) },
    {
      text: "Final: Full analysis summary.",
      action: () => {
        rf1Result.innerHTML = `
          <strong>Domain:</strong> x ≠ 2<br>
          <strong>VA:</strong> x = 2<br>
          <strong>HA:</strong> y = 1<br>
          <strong>x-intercept:</strong> (−1, 0)<br>
          <strong>y-intercept:</strong> (0, −1/2)
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: rf1StepText,
    resultEl: rf1Result,
    prevBtn: rf1Prev,
    nextBtn: rf1Next,
    playBtn: rf1Play,
    resetBtn: rf1Reset,
    steps: rf1Steps,
    resetVisuals: rf1ResetVisuals,
    initText: "Press Next or Play to begin the analysis."
  });

  /* =========================================================
     EXAMPLE 2 SETUP
     g(x) = (x²-9)/(x²-3x) → (x+3)/x with hole at x=3
     ========================================================= */

  const rf2Graph = document.getElementById("rf2Graph");
  injectGrid(rf2Graph);

  const rf2Fn = x => (x + 3) / x;

  const rf2StepText = document.getElementById("rf2StepText");
  const rf2Result   = document.getElementById("rf2Result");
  const rf2Prev = document.getElementById("rf2Prev");
  const rf2Next = document.getElementById("rf2Next");
  const rf2Play = document.getElementById("rf2Play");
  const rf2Reset= document.getElementById("rf2Reset");

  // factoring/cancel stage
  const rf2NumFact    = document.getElementById("rf2NumFact");
  const rf2DenFact    = document.getElementById("rf2DenFact");
  const rf2CancelNote = document.getElementById("rf2CancelNote");
  const rf2Simplified = document.getElementById("rf2Simplified");

  // graph pieces
  const rf2Va        = document.getElementById("rf2Va");
  const rf2VaLabel   = document.getElementById("rf2VaLabel");
  const rf2Ha        = document.getElementById("rf2Ha");
  const rf2HaLabel   = document.getElementById("rf2HaLabel");
  const rf2Hole      = document.getElementById("rf2Hole");
  const rf2HoleInner = document.getElementById("rf2HoleInner");
  const rf2HoleLabel = document.getElementById("rf2HoleLabel");
  const rf2Left      = document.getElementById("rf2Left");
  const rf2Right     = document.getElementById("rf2Right");
  const rf2Xint      = document.getElementById("rf2Xint");
  const rf2XintLabel = document.getElementById("rf2XintLabel");

  // VA x=0
  const rf2VAx = toSvgX(0);
  rf2Va.setAttribute("x1", rf2VAx);
  rf2Va.setAttribute("x2", rf2VAx);
  rf2Va.setAttribute("y1", 0);
  rf2Va.setAttribute("y2", 260);
  rf2VaLabel.setAttribute("x", rf2VAx + 8);
  rf2VaLabel.setAttribute("y", 18);

  // HA y=1
  const rf2HAy = toSvgY(1);
  rf2Ha.setAttribute("x1", 0);
  rf2Ha.setAttribute("x2", 600);
  rf2Ha.setAttribute("y1", rf2HAy);
  rf2Ha.setAttribute("y2", rf2HAy);
  rf2HaLabel.setAttribute("x", 10);
  rf2HaLabel.setAttribute("y", rf2HAy - 6);

  // Hole at (3,2)
  rf2Hole.setAttribute("cx", toSvgX(3));
  rf2Hole.setAttribute("cy", toSvgY(2));
  rf2HoleInner.setAttribute("cx", toSvgX(3));
  rf2HoleInner.setAttribute("cy", toSvgY(2));
  rf2HoleLabel.setAttribute("x", toSvgX(3) + 10);
  rf2HoleLabel.setAttribute("y", toSvgY(2) - 6);

  // x-intercept (-3,0)
  rf2Xint.setAttribute("cx", toSvgX(-3));
  rf2Xint.setAttribute("cy", toSvgY(0));
  rf2XintLabel.setAttribute("x", toSvgX(-3) - 25);
  rf2XintLabel.setAttribute("y", toSvgY(0) + 20);

  // Accurate curves (skip near x=0)
  rf2Left.setAttribute("d", buildPath(rf2Fn, -9.5, -0.1, 0.05, x => Math.abs(x) < 0.03));
  rf2Right.setAttribute("d", buildPath(rf2Fn, 0.1, 9.5, 0.05, x => Math.abs(x) < 0.03));

  const rf2Pieces = [
    rf2NumFact, rf2DenFact, rf2CancelNote, rf2Simplified,
    rf2Va, rf2VaLabel, rf2Ha, rf2HaLabel,
    rf2Hole, rf2HoleInner, rf2HoleLabel,
    rf2Left, rf2Right, rf2Xint, rf2XintLabel
  ];

  const rf2ResetVisuals = () => {
    hide(...rf2Pieces);
    rf2NumFact.classList.remove("strike", "animate");
    rf2DenFact.classList.remove("strike", "animate");
  };

  const rf2Steps = [
    {
      text: "Step 1: Factor numerator and denominator.",
      action: () => show(rf2NumFact, rf2DenFact)
    },
    {
      text: "Step 2: Find domain restrictions from original denominator.",
      action: () => show(rf2NumFact, rf2DenFact)
    },
    {
      text: "Denominator x(x−3)=0 → x=0 or x=3 are excluded.",
      action: () => show(rf2NumFact, rf2DenFact)
    },
    {
      text: "Step 3: Cancel common factor (x−3).",
      action: () => {
        show(rf2NumFact, rf2DenFact, rf2CancelNote);
        rf2NumFact.classList.add("strike");
        rf2DenFact.classList.add("strike");
        setTimeout(() => {
          rf2NumFact.classList.add("animate");
          rf2DenFact.classList.add("animate");
        }, 50);
      }
    },
    {
      text: "After canceling, the simplified function is g(x) = (x+3)/x.",
      action: () => {
        show(rf2NumFact, rf2DenFact, rf2CancelNote, rf2Simplified);
        rf2NumFact.classList.add("strike", "animate");
        rf2DenFact.classList.add("strike", "animate");
      }
    },
    {
      text: "Step 4: The canceled factor means a hole at x=3.",
      action: () => {
        show(rf2Simplified);
        show(rf2Hole, rf2HoleInner, rf2HoleLabel);
      }
    },
    {
      text: "Step 5: Vertical asymptote at x=0 (denominator still zero).",
      action: () => show(rf2Va, rf2VaLabel, rf2Simplified, rf2Hole, rf2HoleInner, rf2HoleLabel)
    },
    {
      text: "Step 6: Horizontal asymptote from equal degrees → y=1.",
      action: () => show(rf2Va, rf2VaLabel, rf2Ha, rf2HaLabel, rf2Simplified, rf2Hole, rf2HoleInner, rf2HoleLabel)
    },
    {
      text: "Step 7: x-intercept from simplified numerator x+3=0 → x=−3.",
      action: () => show(rf2Xint, rf2XintLabel, rf2Va, rf2VaLabel, rf2Ha, rf2HaLabel, rf2Hole, rf2HoleInner, rf2HoleLabel)
    },
    {
      text: "Step 8: Draw the branches approaching asymptotes.",
      action: () => show(rf2Left, rf2Right, rf2Xint, rf2XintLabel, rf2Va, rf2VaLabel, rf2Ha, rf2HaLabel, rf2Hole, rf2HoleInner, rf2HoleLabel)
    },
    {
      text: "Final: Full analysis summary.",
      action: () => {
        show(rf2Left, rf2Right, rf2Xint, rf2XintLabel, rf2Va, rf2VaLabel, rf2Ha, rf2HaLabel, rf2Hole, rf2HoleInner, rf2HoleLabel);
        rf2Result.innerHTML = `
          <strong>Domain:</strong> x ≠ 0, 3<br>
          <strong>Hole:</strong> (3, 2)<br>
          <strong>VA:</strong> x = 0<br>
          <strong>HA:</strong> y = 1<br>
          <strong>x-intercept:</strong> (−3, 0)<br>
          <strong>y-intercept:</strong> none
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: rf2StepText,
    resultEl: rf2Result,
    prevBtn: rf2Prev,
    nextBtn: rf2Next,
    playBtn: rf2Play,
    resetBtn: rf2Reset,
    steps: rf2Steps,
    resetVisuals: rf2ResetVisuals,
    initText: "Press Next or Play to begin the analysis."
  });

});
