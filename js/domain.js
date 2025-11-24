/* =========================================================
   domain.js — two animated domain steppers
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const showLines = (...els) => {
    els.forEach(el=>{
      if(!el) return;
      el.classList.remove("hidden-line");
      el.classList.add("shown-line");
    });
  };

  const hideLines = (...els) => {
    els.forEach(el=>{
      if(!el) return;
      el.classList.remove("shown-line");
      el.classList.add("hidden-line");
    });
  };

  const showFactor = (...els) => {
    els.forEach(el=>{
      if(!el) return;
      el.classList.add("show");
    });
  };

  const hideFactor = (...els) => {
    els.forEach(el=>{
      if(!el) return;
      el.classList.remove("show");
    });
  };

  function makeStepper({
    stepTextEl, resultEl,
    prevBtn, nextBtn, playBtn, resetBtn,
    steps, resetVisuals
  }){
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
      for(let k=0; k<=target; k++) steps[k].action();
      stepTextEl.textContent = steps[target].text;
      i = target;
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === steps.length - 1;
    };

    const next = ()=> { if(i < steps.length-1) apply(i+1); };
    const prev = ()=> { if(i>0) rebuildTo(i-1); };

    const stop = ()=>{
      playing=false;
      playBtn.textContent="Play";
      if(timer) clearInterval(timer);
      timer=null;
    };

    const play = ()=>{
      if(playing) return;
      playing=true;
      playBtn.textContent="Pause";
      timer=setInterval(()=>{
        if(i>=steps.length-1){ stop(); return; }
        next();
      }, 1100);
    };

    const reset = ()=>{
      stop();
      resetVisuals();
      resultEl.innerHTML="";
      apply(0);
      stepTextEl.textContent="Press Next or Play to start.";
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    playBtn.addEventListener("click", ()=> playing? stop(): play());
    resetBtn.addEventListener("click", reset);

    resetVisuals();
    apply(0);
  }

  /* =========================
     EXAMPLE 1
  ========================== */

  const dom1StepText = document.getElementById("dom1StepText");
  const dom1Result   = document.getElementById("dom1Result");
  const dom1Prev     = document.getElementById("dom1Prev");
  const dom1Next     = document.getElementById("dom1Next");
  const dom1Play     = document.getElementById("dom1Play");
  const dom1Reset    = document.getElementById("dom1Reset");

  const dom1Den   = document.getElementById("dom1Den");
  const dom1Fact  = document.getElementById("dom1Fact");

  const dom1ExA = document.getElementById("dom1ExA");
  const dom1ExB = document.getElementById("dom1ExB");
  const dom1LeftShade  = document.getElementById("dom1LeftShade");
  const dom1MidShade   = document.getElementById("dom1MidShade");
  const dom1RightShade = document.getElementById("dom1RightShade");

  const dom1ResetVisuals = () => {
    hideFactor(dom1Den, dom1Fact);
    hideLines(dom1ExA, dom1ExB, dom1LeftShade, dom1MidShade, dom1RightShade);
  };

  const dom1Steps = [
    { text:"Step 1: Focus on the denominator x² − 9.", action:()=> showFactor(dom1Den) },
    { text:"Step 2: Factor the denominator.", action:()=> showFactor(dom1Den, dom1Fact) },
    { text:"x² − 9 = (x − 3)(x + 3).", action:()=> showFactor(dom1Den, dom1Fact) },
    { text:"Step 3: Set each factor = 0 → x = 3 and x = −3.", action:()=> showFactor(dom1Den, dom1Fact) },
    { text:"Exclude x = −3 and x = 3 from the domain.", action:()=> {
        showFactor(dom1Den, dom1Fact);
        showLines(dom1ExA, dom1ExB);
      }
    },
    { text:"Domain intervals are everything else.", action:()=> {
        showFactor(dom1Den, dom1Fact);
        showLines(dom1ExA, dom1ExB, dom1LeftShade, dom1MidShade, dom1RightShade);
      }
    },
    { text:"Final domain statement.", action:()=> {
        showFactor(dom1Den, dom1Fact);
        showLines(dom1ExA, dom1ExB, dom1LeftShade, dom1MidShade, dom1RightShade);
        dom1Result.innerHTML = "<strong>Domain:</strong> all real numbers except x = −3 and x = 3.";
      }
    }
  ];

  makeStepper({
    stepTextEl: dom1StepText,
    resultEl: dom1Result,
    prevBtn: dom1Prev,
    nextBtn: dom1Next,
    playBtn: dom1Play,
    resetBtn: dom1Reset,
    steps: dom1Steps,
    resetVisuals: dom1ResetVisuals
  });

  /* =========================
     EXAMPLE 2
  ========================== */

  const dom2StepText = document.getElementById("dom2StepText");
  const dom2Result   = document.getElementById("dom2Result");
  const dom2Prev     = document.getElementById("dom2Prev");
  const dom2Next     = document.getElementById("dom2Next");
  const dom2Play     = document.getElementById("dom2Play");
  const dom2Reset    = document.getElementById("dom2Reset");

  const dom2Den   = document.getElementById("dom2Den");
  const dom2Solve = document.getElementById("dom2Solve");

  const dom2ExA = document.getElementById("dom2ExA");
  const dom2ExB = document.getElementById("dom2ExB");
  const dom2ExC = document.getElementById("dom2ExC");
  const dom2Shade1 = document.getElementById("dom2Shade1");
  const dom2Shade2 = document.getElementById("dom2Shade2");
  const dom2Shade3 = document.getElementById("dom2Shade3");
  const dom2Shade4 = document.getElementById("dom2Shade4");

  const dom2ResetVisuals = () => {
    hideFactor(dom2Den, dom2Solve);
    hideLines(dom2ExA, dom2ExB, dom2ExC, dom2Shade1, dom2Shade2, dom2Shade3, dom2Shade4);
  };

  const dom2Steps = [
    { text:"Step 1: Look at the denominator.", action:()=> showFactor(dom2Den) },
    { text:"Denominator is already fully factored: x(x − 5)(x + 1).", action:()=> showFactor(dom2Den) },
    { text:"Step 2: Set each factor = 0.", action:()=> showFactor(dom2Den, dom2Solve) },
    { text:"Solutions: x = −1, 0, 5.", action:()=> showFactor(dom2Den, dom2Solve) },
    { text:"Exclude those x-values (open circles).", action:()=> {
        showFactor(dom2Den, dom2Solve);
        showLines(dom2ExA, dom2ExB, dom2ExC);
      }
    },
    { text:"Everything else is in the domain (interval shading).", action:()=> {
        showFactor(dom2Den, dom2Solve);
        showLines(dom2ExA, dom2ExB, dom2ExC, dom2Shade1, dom2Shade2, dom2Shade3, dom2Shade4);
      }
    },
    { text:"Final domain statement.", action:()=> {
        showFactor(dom2Den, dom2Solve);
        showLines(dom2ExA, dom2ExB, dom2ExC, dom2Shade1, dom2Shade2, dom2Shade3, dom2Shade4);
        dom2Result.innerHTML = "<strong>Domain:</strong> all real numbers except x = −1, 0, 5.";
      }
    }
  ];

  makeStepper({
    stepTextEl: dom2StepText,
    resultEl: dom2Result,
    prevBtn: dom2Prev,
    nextBtn: dom2Next,
    playBtn: dom2Play,
    resetBtn: dom2Reset,
    steps: dom2Steps,
    resetVisuals: dom2ResetVisuals
  });

});
