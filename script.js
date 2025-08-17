

// ----------------------------
// 1. Get container & subject
// ----------------------------
const container = document.getElementById('tutorials');
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get('subject'); // Example: ?subject=Psychology

console.log("Abebe beso bela");

const data = {
  subject: "Psychology",
  title: "Chapter 1",
  description: "Intro to Psychology",
  fullNotes: "Step one - Defining the Problem\nStep two - Formulating the Hypothesis"
};
renderTutorials([data]);
// ----------------------------
// 2. Fetch JSON safely
// ----------------------------
async function loadTutorial(chapterFile) {
  try {
    const response = await fetch('courses/${chapterFile}');
    if (!response.ok) {
      throw new Error('File not found: ${chapterFile}');
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
}

// ----------------------------
// 3. Render Tutorials
// ----------------------------
async function renderTutorials(chapterFiles) {
  if (!subject) {
    container.innerHTML =' <p class="no-tutorials">No subject selected. Please open via your bot.</p>';
    return;
  }

  const tutorials = [];
  for (const file of chapterFiles) {
    const data = await loadTutorial(file);
    if (data.subject.toLowerCase() === subject.toLowerCase()) {
      tutorials.push(data);
    }
  }

  if (tutorials.length === 0) {
    container.innerHTML = '<p class="no-tutorials">No tutorials available for ${subject}.</p>';
    return;
  }

  let html =' <h2 style="text-align:center; margin-bottom:20px;">Tutorials for ${subject}</h2>';
  html += tutorials.map(t => 
   '<div class="tutorial-card">
      <div class="tutorial-title">${t.title}</div>
      <div class="tutorial-desc">${t.description}</div>
      ${t.note ? <div class="tutorial-note"><strong>Note:</strong> ${t.note}</div> : ""}
      ${t.fullNotes ? <div class="tutorial-full-notes">${t.fullNotes.replace(/\n/g, "<br>")}</div> : ""}
    </div>'
 ).join('');

  container.innerHTML = html;
}

// ----------------------------
// 4. Call function with files
// ----------------------------
renderTutorials([
  "psychology_chapter1.json",
  // Add more later: "psychology_chapter2.json", ...
]);
































