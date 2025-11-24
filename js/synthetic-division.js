/* =========================================================
   synthetic-division.js — animated synthetic division
   Builds the table + reveals steps with highlights
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const examples = [
    {
      name: "(2x³ − 3x² + 4x − 5) ÷ (x − 2)",
      c: 2,
      coeffs: [2, -3, 4, -5]
    },
    {
      name: "(3x³ + 5x² − 2x + 8) ÷ (x + 1)",
      c: -1,
      coeffs: [3, 5, -2, 8]
    }
  ];

  const select = document.getElementById("exampleSelect");
  const table = document.getElementById("syntheticTable");
  const stepText = document.getElementById("stepText");
  const resultText = document.getElementById("resultText");

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const playBtn = document.getElementById("playBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (!table) return;

  let currentExample = examples[0];
  let steps = [];
  let stepIndex = 0;
  let playing = false;
  let timer = null;

  // Populate dropdown
  examples.forEach((ex, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = ex.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    currentExample = examples[Number(select.value)];
    initExample();
  });

  function buildEmptyTable(coeffs, c){
    table.innerHTML = "";

    const coeffRow = document.createElement("tr");
    coeffRow.className = "coeff-row";

    const mulRow = document.createElement("tr");
    mulRow.className = "mul-row";

    const sumRow = document.createElement("tr");
    sumRow.className = "sum-row";

    // left column
    const leftCoeff = document.createElement("td");
    leftCoeff.textContent = c;
    coeffRow.appendChild(leftCoeff);

    const leftMul = document.createElement("td");
    leftMul.textContent = "";
    mulRow.appendChild(leftMul);

    const leftSum = document.createElement("td");
    leftSum.textContent = "";
    sumRow.appendChild(leftSum);

    // coefficient cells
    coeffs.forEach((val, i)=>{
      const top = document.createElement("td");
      top.textContent = val;
      top.dataset.row = "top";
      top.dataset.i = i;

      const mid = document.createElement("td");
      mid.textContent = "";
      mid.classList.add("hidden");
      mid.dataset.row = "mid";
      mid.dataset.i = i;

      const bot = document.createElement("td");
      bot.textContent = "";
      bot.classList.add("hidden");
      bot.dataset.row = "bot";
      bot.dataset.i = i;

      coeffRow.appendChild(top);
      mulRow.appendChild(mid);
      sumRow.appendChild(bot);
    });

    table.appendChild(coeffRow);
    table.appendChild(mulRow);
    table.appendChild(sumRow);
  }

  function computeSteps(coeffs, c){
    const steps = [];
    const bottom = [];
    const middle = Array(coeffs.length).fill(null);

    steps.push({ type:"setup", text:`Set up coefficients and c = ${c}.` });

    bottom[0] = coeffs[0];
    steps.push({
      type:"bringDown",
      i:0,
      value:bottom[0],
      text:`Bring down the first coefficient: ${bottom[0]}.`
    });

    for(let i=1; i<coeffs.length; i++){
      const product = bottom[i-1] * c;
      middle[i] = product;
      steps.push({
        type:"multiply",
        i,
        value:product,
        text:`Multiply ${bottom[i-1]} × ${c} = ${product}.`
      });

      const sum = coeffs[i] + product;
      bottom[i] = sum;
      steps.push({
        type:"add",
        i,
        value:sum,
        text:`Add: ${coeffs[i]} + ${product} = ${sum}.`
      });
    }

    steps.push({
      type:"final",
      bottom,
      text:`Bottom row gives quotient coefficients; last value is remainder.`
    });

    return steps;
  }

  function clearHighlights(){
    table.querySelectorAll("td").forEach(td=>{
      td.classList.remove("active");
    });
  }

  function highlight(row, i){
    clearHighlights();
    const cell = table.querySelector(`td[data-row="${row}"][data-i="${i}"]`);
    if(cell) cell.classList.add("active");
  }

  function showCell(row, i, value){
    const cell = table.querySelector(`td[data-row="${row}"][data-i="${i}"]`);
    if(!cell) return;
    cell.textContent = value;
    cell.classList.remove("hidden");
    cell.classList.add("shown");
  }

  function applyStep(step){
    stepText.textContent = step.text;

    if(step.type === "bringDown"){
      highlight("bot", step.i);
      showCell("bot", step.i, step.value);
    }

    if(step.type === "multiply"){
      highlight("mid", step.i);
      showCell("mid", step.i, step.value);
    }

    if(step.type === "add"){
      highlight("bot", step.i);
      showCell("bot", step.i, step.value);
    }

    if(step.type === "final"){
      clearHighlights();
      const newCoeffs = step.bottom.slice(0, -1);
      const remainder = step.bottom[step.bottom.length - 1];
      resultText.innerHTML =
        `<strong>Quotient coefficients:</strong> ${newCoeffs.join(", ")}<br>
         <strong>Remainder:</strong> <span class="remainder">${remainder}</span>`;
    }
  }

  function showStep(i){
    stepIndex = i;
    applyStep(steps[stepIndex]);

    prevBtn.disabled = stepIndex === 0;
    nextBtn.disabled = stepIndex === steps.length - 1;
  }

  function next(){
    if(stepIndex < steps.length - 1) showStep(stepIndex + 1);
  }

  function prev(){
    if(stepIndex > 0){
      initExample();          // rebuild empty table
      for(let k=0; k<stepIndex-1; k++){
        applyStep(steps[k]);  // re-apply earlier steps
      }
      showStep(stepIndex - 1);
    }
  }

  function reset(){
    stopPlay();
    initExample();
    resultText.innerHTML = "";
    stepText.textContent = "Press “Play” or “Next” to begin.";
  }

  function startPlay(){
    if(playing) return;
    playing = true;
    playBtn.textContent = "Pause";

    timer = setInterval(()=>{
      if(stepIndex >= steps.length - 1){
        stopPlay();
        return;
      }
      next();
    }, 1200);
  }

  function stopPlay(){
    playing = false;
    playBtn.textContent = "Play";
    if(timer) clearInterval(timer);
    timer = null;
  }

  function initExample(){
    buildEmptyTable(currentExample.coeffs, currentExample.c);
    steps = computeSteps(currentExample.coeffs, currentExample.c);
    stepIndex = 0;
    showStep(0);
  }

  // Bind buttons
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  resetBtn.addEventListener("click", reset);
  playBtn.addEventListener("click", ()=> playing ? stopPlay() : startPlay());

  // Start first example
  initExample();
});
