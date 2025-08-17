// ----------------------------
// 1. All Tutorial Data
// ----------------------------
// const TUTORIALS = [
//   // --- Chapter 1 ---
//   {
//     subject: "Psychology",
//     title: "Chapter 1: Experimental Research",
//     description: "Introduction to Psychology and Key Concepts",
//     note: "Step one - Defining the Problem, Step two - Formulating the Hypothesis, Step three - Testing the Hypothesis, Step four - Drawing Conclusions, Step five - Reporting Results",
//     steps: [
//       "chapter one - esence of psychology",
//       "chapter two - sensation and perception ",
//       "chapter three - learning and theories of learning",
//       "chapter four - memory and forgetting",
//       "chapter five - motivation and emotions",
//        "chapter six - personality",
//        "chapter seven - psychological disorders and treatement techniques",
//     ],
//     fullNotes: 
// እነዚህን አምስት ሳይንሳዊ ጥናት ሂደቶች ፃፍ ላይ ሊመጡ ይችላሉ ☺

// Limitations of Experimental Research: 
// - Complex real-world issues may not be easily studied in the laboratory
// - Experimental research has its own limitations
// - Artificial situations may produce results different from real-life environments
// - Experimental group, control group, independent & dependent variables must be considered carefully

// Chapter 2 will continue with experimental groups and control groups.

//   },

//   // --- Chapter 2 ---
//   {
//     subject: "Psychology",
//     title: "Chapter 2: Research Methods",
//     description: "Understanding Research Methods in Psychology",
//     note: "Research methods in psychology: Major types of research methods",
//     steps: [
//       "Step 1 - Descriptive Research",
//       "Step 2 - Naturalistic Observation",
//       "Step 3 - Case Study"
//     ],
//     fullNotes: 
// እነዚህ ከClinical ያነሱ ችግሮችን ልክ እንደ ማማከር አይነት psychology ናቸው
// - Descriptive Research: The researcher records observations systematically (case studies, surveys, naturalistic observation)
// - Naturalistic Observation: Observing subjects in their natural environment to get real (not artificial) behavior
// - Case Study: Studying an individual in great detail; provides a lot of data on a single case

// Advantages: Collects rich information for analysis.
// Limitations: May be biased depending on observer.

//   },

//   // --- Chapter 3 ---
//   {
//     subject: "Psychology",
//     title: "Chapter 3: Advanced Experimental Research",
//     description: "Further insights into experimental design",
//     note: "Step one - Defining the Problem, Step two - Formulating the Hypothesis, Step three - Testing the Hypothesis, Step four - Drawing Conclusions, Step five - Reporting Results",
//     steps: [
//       "Step one - Defining the Problem",
//       "Step two - Formulating the Hypothesis",
//       "Step three - Testing the Hypothesis",
//       "Step four - Drawing Conclusions",
//       "Step five - Reporting Results"
//     ],
//     fullNotes: 
// እነዚህን አምስት ሳይንሳዊ ጥናት ሂደቶች ፃፍ ላይ ሊመጡ ይችላሉ ☺️

// Limitations of Experimental Research: 
// - Real-world issues may not be fully studied in the lab
// - Experiments may produce artificial results
// - Always check experimental design including independent & dependent variables

// Chapter 4 will start next.

//   }
// ];

// noteElement.innerHTML = data.fullNotes.replace(/\n/g, "<br>");

// // ----------------------------
// // 2. Utilities
// // ----------------------------
// function formatSteps(steps) {
//   return '<ol class="tutorial-steps">' + steps.map(s => <li>${s}</li>).join('') + '</ol>';
// }

// // ----------------------------
// // 3. Render Tutorials
// // ----------------------------
// function renderTutorials() {
//   const container = document.getElementById('tutorials');
//   const urlParams = new URLSearchParams(window.location.search);
//   const subject = urlParams.get('subject');

//   if (!subject) {
//     container.innerHTML = '<p class="no-tutorials">No subject selected. Please open via your bot.</p>';
//     return;
//   }

//   const visibleTutorials = TUTORIALS.filter(
//     t => t.subject.toLowerCase() === subject.toLowerCase()
//   );

//   if (visibleTutorials.length === 0) {
//     container.innerHTML = <p class="no-tutorials">No tutorials available for ${subject}.</p>;
//     return;
//   }

// let html = <h2 style="text-align:center; margin-bottom:20px;">Tutorials for ${subject}</h2>;
//   html += visibleTutorials
//     .map(t => {
//       return 
//       <div class="tutorial-card">
//         <div class="tutorial-title">${t.title}</div>
//         <div class="tutorial-desc">${t.description}</div>
//         ${t.note ? <div class="tutorial-note"><strong>Note:</strong> ${t.note}</div> : ''}
//         ${formatSteps(t.steps)}
//         ${t.fullNotes ? <div class="tutorial-full-notes">${t.fullNotes}</div> : ''}
//       </div>
//       ;
//     })
//     .join('');

//   container.innerHTML = html;
// }

// renderTutorials();




// ----------------------------
// 1. Get container & subject
// ----------------------------
const container = document.getElementById('tutorials');
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get('subject'); // e.g., ?subject=Psychology

// ----------------------------
// 2. Fetch a tutorial JSON file
// ----------------------------
async function loadTutorial(chapterFile) {
  try {
    // const response = await fetch('courses/${chapterFile}');
       const response = await fetch('courses/psychology_chapter1.json');
    if (!response.ok) throw new Error('File not found: ' + chapterFile);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ----------------------------
// 3. Render tutorials
// ----------------------------
async function renderTutorials(chapterFiles) {
  if (!subject) {
    container.innerHTML = <p class="no-tutorials">No subject selected. Please open via your bot.</p>;
    return;
  }

  // Load all chapters sequentially
  const tutorials = [];
  for (const file of chapterFiles) {
    const data = await loadTutorial(file);
    if (data && data.subject.toLowerCase() === subject.toLowerCase()) {
      tutorials.push(data);
    }
  }

  if (tutorials.length === 0) {
    container.innerHTML = <p class="no-tutorials">No tutorials available for ${subject}</p>;
    return;
  }

  // Build HTML
  let html = <h2 style="text-align:center; margin-bottom:20px;">Tutorials for ${subject}</h2>;
  html += tutorials.map(t =>
    <div class="tutorial-card">
      <div class="tutorial-title">${t.title}</div>
      <div class="tutorial-desc">${t.description}</div>
      ${t.note ? <div class="tutorial-note"><strong>Note:</strong><br>${t.note.replace(/\n/g, '<br>')}</div> : ''}
      ${t.fullNotes ? <div class="tutorial-full-notes">${t.fullNotes.replace(/\n/g, '<br>')}</div> : ''}
    </div>
  ).join('');

  container.innerHTML = html;
}

// ----------------------------
// 4. Call the function
// Only include the chapters you want to show
// Example: currently only chapter 1
// Later you can add more: 'psychology_chapter2.json', etc.
// ----------------------------
renderTutorials([
  'courses/psychology_chapter1.json'
]);

























