// =========================================================
// topic-nav.js — Shared navigation for all topic pages
// Fully upgraded for smoother UX + accessibility + robustness
// =========================================================

// Full topic list (order defines prev/next)
const TOPICS = [
  { num: "01", title: "Synthetic Division", file: "synthetic-division.html" },
  { num: "02", title: "Rational Functions Overview", file: "rational-functions.html" },
  { num: "03", title: "Domain of Rational Functions", file: "domain.html" },
  { num: "04", title: "Vertical & Horizontal Asymptotes", file: "asymptotes.html" },
  { num: "05", title: "Graphing Rational Functions", file: "graphing.html" },
  { num: "06", title: "Rational Inequalities", file: "inequalities.html" },
  { num: "07", title: "Exponential Functions", file: "exponential.html" },
  { num: "08", title: "Compound Interest (Discrete)", file: "compound-interest.html" },
  { num: "09", title: "Inverse Functions", file: "inverses.html" },
  { num: "10", title: "Logarithmic Functions", file: "logarithms.html" },
];

// ---------------------------------------------------------
// Helper: return index of currently viewed topic
// ---------------------------------------------------------
function getCurrentTopicIndex() {
  const path = window.location.pathname;
  const currentFile = path.split("/").pop().toLowerCase();
  return TOPICS.findIndex(t => t.file.toLowerCase() === currentFile);
}

// ---------------------------------------------------------
// Helper: safely navigate with fade-out animation
// ---------------------------------------------------------
function navigateWithFade(url) {
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = url;
  }, 140);
}

// ---------------------------------------------------------
// Main initializer
// ---------------------------------------------------------
function initTopicNav() {
  const prevBtn = document.getElementById("prevTopicBtn");
  const nextBtn = document.getElementById("nextTopicBtn");
  const select = document.getElementById("topicSelect");

  // If page has no topic nav section, stop quietly
  if (!prevBtn || !nextBtn || !select) return;

  const currentIndex = getCurrentTopicIndex();

  // -------------------------------------------------------
  // If page file isn't in TOPICS list: redirect user home
  // This prevents broken nav for misnamed files
  // -------------------------------------------------------
  if (currentIndex === -1) {
    console.warn("Topic not recognized. Returning to home.");
    window.location.href = "../index.html";
    return;
  }

  // -------------------------------------------------------
  // Build dropdown menu
  // -------------------------------------------------------
  select.innerHTML = "";
  TOPICS.forEach((t, i) => {
    const option = document.createElement("option");
    option.value = t.file;
    option.textContent = `${t.num} — ${t.title}`;
    if (i === currentIndex) option.selected = true;
    select.appendChild(option);
  });

  // -------------------------------------------------------
  // Previous button behavior
  // -------------------------------------------------------
  const prevTopic = TOPICS[currentIndex - 1];
  if (prevTopic) {
    prevBtn.disabled = false;
    prevBtn.addEventListener("click", () => navigateWithFade(prevTopic.file));
  } else {
    prevBtn.disabled = true;
    prevBtn.style.opacity = "0.35";
    prevBtn.style.cursor = "not-allowed";
  }

  // -------------------------------------------------------
  // Next button behavior
  // -------------------------------------------------------
  const nextTopic = TOPICS[currentIndex + 1];
  if (nextTopic) {
    nextBtn.disabled = false;
    nextBtn.addEventListener("click", () => navigateWithFade(nextTopic.file));
  } else {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.35";
    nextBtn.style.cursor = "not-allowed";
  }

  // -------------------------------------------------------
  // Dropdown Jump-To behavior
  // -------------------------------------------------------
  select.addEventListener("change", (e) => {
    navigateWithFade(e.target.value);
  });
}

// Fire after content loads
document.addEventListener("DOMContentLoaded", () => {
  // Smooth fade-in effect
  document.body.style.transition = "opacity 0.25s ease";
  document.body.style.opacity = "1";

  initTopicNav();
});
