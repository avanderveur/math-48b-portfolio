/* =========================================================
   inequalities.js — Rational Inequalities + Sign Charts
   Same stepper format as Topics 1–5
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Helpers (same style)
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

  // swap dot type if needed (strict vs inclusive)
  const makeOpenDot = (el) => {
    if (!el) return;
    el.classList.remove("closed-dot");
    el.classList.add("open-dot");
  };
  const makeClosedDot = (el) => {
    if (!el) return;
    el.classList.remove("open-dot");
    el.classList.add("closed-dot");
  };

  /* ------------------------------
     Stepper engine (Topics 1–5)
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
     EXAMPLE 1
     (x+1)/(x-2) > 0
     critical points: -1 (zero), 2 (undefined)
     signs: + , - , +
     solution: (-∞,-1) ∪ (2,∞)
     NOTE: strict >0 so -1 is OPEN, 2 OPEN.
  ========================================================= */

  const in1 = {
    stepText: document.getElementById("in1StepText"),
    result: document.getElementById("in1Result"),
    prev: document.getElementById("in1Prev"),
    next: document.getElementById("in1Next"),
    play: document.getElementById("in1Play"),
    reset: document.getElementById("in1Reset"),

    zero: document.getElementById("in1Zero"),
    undef: document.getElementById("in1Undef"),
    crit: document.getElementById("in1Crit"),

    labelNeg1: document.getElementById("in1LabelNeg1"),
    label2: document.getElementById("in1Label2"),
    dotNeg1: document.getElementById("in1DotNeg1"),
    dot2: document.getElementById("in1Dot2"),

    intA: document.getElementById("in1IntA"),
    intB: document.getElementById("in1IntB"),
    intC: document.getElementById("in1IntC"),

    signA: document.getElementById("in1SignA"),
    signB: document.getElementById("in1SignB"),
    signC: document.getElementById("in1SignC"),

    rowA: document.getElementById("in1RowA"),
    rowB: document.getElementById("in1RowB"),
    rowC: document.getElementById("in1RowC")
  };

  const resetIn1 = () => {
    hideFactor(in1.zero, in1.undef, in1.crit);

    hideLines(
      in1.labelNeg1, in1.label2,
      in1.dotNeg1, in1.dot2,
      in1.intA, in1.intB, in1.intC,
      in1.signA, in1.signB, in1.signC,
      in1.rowA, in1.rowB, in1.rowC
    );

    // restore dot types to default state before steps
    makeClosedDot(in1.dotNeg1); // we'll flip to open during steps
    makeOpenDot(in1.dot2);

    in1.result.innerHTML = "";
  };

  const stepsIn1 = [
    { text: "Step 1: Find zeros of the numerator.", action: () => showFactor(in1.zero) },
    { text: "Step 2: Find zeros of the denominator (undefined points).", action: () => showFactor(in1.undef) },
    { text: "Step 3: Critical points are −1 and 2.", action: () => showFactor(in1.crit) },

    {
      text: "Step 4: Place critical points on the number line.",
      action: () => {
        // strict > 0 → zero is NOT included → open dot at -1
        makeOpenDot(in1.dotNeg1);

        showLines(
          in1.labelNeg1, in1.label2,
          in1.dotNeg1, in1.dot2
        );
      }
    },

    {
      text: "Step 5: Test each interval to determine signs.",
      action: () => {
        showLines(in1.signA, in1.signB, in1.signC);
        showLines(in1.rowA, in1.rowB, in1.rowC);
      }
    },

    {
      text: "Intervals with '+' satisfy > 0 (left and right).",
      action: () => {
        showLines(in1.intA, in1.intC);
      }
    },

    {
      text: "Final solution.",
      action: () => {
        showFactor(in1.zero, in1.undef, in1.crit);
        showLines(
          in1.labelNeg1, in1.label2,
          in1.dotNeg1, in1.dot2,
          in1.signA, in1.signB, in1.signC,
          in1.rowA, in1.rowB, in1.rowC,
          in1.intA, in1.intC
        );

        in1.result.innerHTML = `
          <strong>Solution:</strong>
          (-∞, -1) ∪ (2, ∞)
          <br><small>Both endpoints are excluded because the inequality is strict (&gt; 0).</small>
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: in1.stepText,
    resultEl: in1.result,
    prevBtn: in1.prev,
    nextBtn: in1.next,
    playBtn: in1.play,
    resetBtn: in1.reset,
    steps: stepsIn1,
    resetVisuals: resetIn1
  });


  /* =========================================================
     EXAMPLE 2
     (x−3)(x+2)/(x+1) ≤ 0
     critical points: -2, -1, 3
     signs:  - , + , - , +
     solution: (-∞,-2] ∪ (-1,3]
     NOTE: ≤0 includes zeros (-2 and 3 closed), excludes -1 open.
  ========================================================= */

  const in2 = {
    stepText: document.getElementById("in2StepText"),
    result: document.getElementById("in2Result"),
    prev: document.getElementById("in2Prev"),
    next: document.getElementById("in2Next"),
    play: document.getElementById("in2Play"),
    reset: document.getElementById("in2Reset"),

    zeros: document.getElementById("in2Zeros"),
    undef: document.getElementById("in2Undef"),
    crit: document.getElementById("in2Crit"),

    labelNeg2: document.getElementById("in2LabelNeg2"),
    labelNeg1: document.getElementById("in2LabelNeg1"),
    label3: document.getElementById("in2Label3"),

    dotNeg2: document.getElementById("in2DotNeg2"),
    dotNeg1: document.getElementById("in2DotNeg1"),
    dot3: document.getElementById("in2Dot3"),

    intA: document.getElementById("in2IntA"),
    intB: document.getElementById("in2IntB"),
    intC: document.getElementById("in2IntC"),
    intD: document.getElementById("in2IntD"),

    signA: document.getElementById("in2SignA"),
    signB: document.getElementById("in2SignB"),
    signC: document.getElementById("in2SignC"),
    signD: document.getElementById("in2SignD"),

    rowA: document.getElementById("in2RowA"),
    rowB: document.getElementById("in2RowB"),
    rowC: document.getElementById("in2RowC"),
    rowD: document.getElementById("in2RowD")
  };

  const resetIn2 = () => {
    hideFactor(in2.zeros, in2.undef, in2.crit);

    hideLines(
      in2.labelNeg2, in2.labelNeg1, in2.label3,
      in2.dotNeg2, in2.dotNeg1, in2.dot3,
      in2.intA, in2.intB, in2.intC, in2.intD,
      in2.signA, in2.signB, in2.signC, in2.signD,
      in2.rowA, in2.rowB, in2.rowC, in2.rowD
    );

    // restore dot types
    makeClosedDot(in2.dotNeg2); // included
    makeOpenDot(in2.dotNeg1);   // never included (denom zero)
    makeClosedDot(in2.dot3);    // included

    in2.result.innerHTML = "";
  };

  const stepsIn2 = [
    { text: "Step 1: Zeros of numerator are x = −2 and x = 3.", action: () => showFactor(in2.zeros) },
    { text: "Step 2: Denominator zero gives x = −1 (undefined).", action: () => showFactor(in2.undef) },
    { text: "Step 3: Critical points are −2, −1, 3.", action: () => showFactor(in2.crit) },

    {
      text: "Step 4: Place critical points on the number line.",
      action: () => {
        showLines(
          in2.labelNeg2, in2.labelNeg1, in2.label3,
          in2.dotNeg2, in2.dotNeg1, in2.dot3
        );
      }
    },

    {
      text: "Step 5: Test intervals → build sign chart (−, +, −, +).",
      action: () => {
        showLines(in2.signA, in2.signB, in2.signC, in2.signD);
        showLines(in2.rowA, in2.rowB, in2.rowC, in2.rowD);
      }
    },

    {
      text: "Intervals with '−' satisfy ≤ 0 (leftmost and middle-right).",
      action: () => {
        showLines(in2.intA, in2.intC);
      }
    },

    {
      text: "Final solution.",
      action: () => {
        showFactor(in2.zeros, in2.undef, in2.crit);
        showLines(
          in2.labelNeg2, in2.labelNeg1, in2.label3,
          in2.dotNeg2, in2.dotNeg1, in2.dot3,
          in2.signA, in2.signB, in2.signC, in2.signD,
          in2.rowA, in2.rowB, in2.rowC, in2.rowD,
          in2.intA, in2.intC
        );

        in2.result.innerHTML = `
          <strong>Solution:</strong>
          (-∞, -2] ∪ (-1, 3]
          <br><small>-2 and 3 are included because ≤ allows zeros. -1 is excluded because it makes the denominator 0.</small>
        `;
      }
    }
  ];

  makeStepper({
    stepTextEl: in2.stepText,
    resultEl: in2.result,
    prevBtn: in2.prev,
    nextBtn: in2.next,
    playBtn: in2.play,
    resetBtn: in2.reset,
    steps: stepsIn2,
    resetVisuals: resetIn2
  });

});
