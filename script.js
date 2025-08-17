// 1. All Tutorial Data
// ----------------------------
const TUTORIALS = [
  {
    subject: "Math",
    title: "Algebra Part 1",
    description: "Introduction to Algebra",
    note: "Remember to practice the exercises at the end of each step.",
    steps: ["Step 1: Variables", "Step 2: Equations"],
  },
  {
    subject: "Psychology",
    title: "Chapter ONE",
    description: "Essence of Psychology",
    note: "full parts of chapter😍",
    steps: ["Step 1:learning", "Step 2: Key Theories"],
  },
];
// ----------------------------
// 2. Utilities
// ----------------------------
function formatSteps(steps) {
  return '<ol class="tutorial-steps">' + steps.map(s => <li>${s}</li>).join('') + '</ol>';
}

// ----------------------------
// 3. Render Tutorials
// ----------------------------
function renderTutorials() {

  container.innerHTML =
    (
      <h2 style="text-align:center; margin-bottom:20px;">
        Tutorials for ${subject}
      </h2>
    ) +
    visibleTutorials
      .map((t) => (
        <div class="tutorial-card">
          <div class="tutorial-title">${t.title}</div>
          <div class="tutorial-desc">${t.description}</div>$
          {t.note ? (
            <div class="tutorial-note">
              <strong>Note:</strong> ${t.note}
            </div>
          ) : (
            ""
          )}
          ${formatSteps(t.steps)}
        </div>
      ))
      .join("");
  const container = document.getElementById('tutorials');
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get('subject');

  if (!subject) {
    container.innerHTML = <p class="no-tutorials">No subject selected. Please open via your bot.</p>;
    return;
  }

  const visibleTutorials = TUTORIALS.filter(t => t.subject.toLowerCase() === subject.toLowerCase());

  if (visibleTutorials.length === 0) {
    container.innerHTML = <p class="no-tutorials">No tutorials available for ${subject}.</p>;
    return;
  }

  container.innerHTML = <h2 style="text-align:center; margin-bottom:20px;">Tutorials for ${subject}</h2> +
    visibleTutorials.map(t => 
      <div class="tutorial-card">
        <div class="tutorial-title">${t.title}</div>
        <div class="tutorial-desc">${t.description}</div>
        ${formatSteps(t.steps)}
      </div>
    ).join('');
}

renderTutorials();