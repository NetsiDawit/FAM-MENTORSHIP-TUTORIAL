----------------------------
//1. Get container
----------------------------
const container = document.getElementById('tutorials');
console.log(20);
// ----------------------------
// 2. Load a single JSON file safely
// ----------------------------
async function loadTutorial(fileName) {
  try {
    const response = await fetch(`/courses/${fileName}`);
    if (!response.ok) throw new Error("File not found: " + fileName);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ----------------------------
// 3. Render a tutorial dynamically
// ----------------------------
async function renderTutorial(fileName) {
  if (!fileName) {
    container.innerHTML = '<p class="no-tutorials">No tutorial selected.</p>';
    return;
  }

  const data = await loadTutorial(fileName);
  if (!data) {
    container.innerHTML = '<p class="no-tutorials">Tutorial not found.</p>';
    return;
  }

  let html = '';
  html +=` <h2 style="text-align:center; margin-bottom:20px;">${data.subject} - ${data.title}</h2>`;
  html += `<div class="tutorial-card">
             <div class="tutorial-desc">${data.description}</div>
             ${data.note ? `<div class="tutorial-note"><strong>Note:</strong> ${data.note}</div>` : ''}
             ${data.fullNotes ? `<div class="tutorial-full-notes">${data.fullNotes.replace(/\n/g, "<br>")}</div>` : ''}
           </div>`;

  container.innerHTML = html;
}

// ----------------------------
// 4. Get tutorial from URL and render
// ----------------------------
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tutorialFile = urlParams.get("tutorial"); // e.g. psychology_chapter1.json
  renderTutorial(tutorialFile);
});






//********************************************************************************************************************************

// ----------------------------
// 1. Get container
// ----------------------------
//  const container = document.getElementById('tutorials');

// // ----------------------------
// // 2. Define which chapters to show
// // Only add the JSON files you want to display
// // ----------------------------
// const tutorialsToShow = [
//   { subject: "Psychology", chapterFile: "psychology_chapter1.json" }, // first chapter
//   { subject: "Psychology", chapterFile: "psychology_chapter2.json" }, // next chapter
//   { subject: "Logic", chapterFile: "logic_chapter1.json" },            // another subject
//   // Add more chapters here anytime 
// ];

// // ----------------------------
// // 3. Load a single JSON file safely
// // ----------------------------
// async function loadTutorial(fileName) {
//   try {
//     const response = await fetch(`courses/${fileName}`);
//     if (!response.ok) throw new Error("File not found: " + fileName);
//     return await response.json();
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// // ----------------------------
// // 4. Render tutorials dynamically
// // ----------------------------
// async function renderTutorials(tutorialList) {
//   if (!tutorialList || tutorialList.length === 0) {
//     // container.innerHTML = '<p class="no-tutorials">No tutorials to show.</p>';
//     container.innerHTML ="";
//     return;
//   }

//   let html = '';

//   for (const item of tutorialList) {
//     const data = await loadTutorial(item.chapterFile);
//     if (!data) continue; // skip if JSON not found

//     html += `<h2 style="text-align:center; margin-bottom:20px;">${data.subject} - ${data.title}</h2>`;
//     html +=` <div class="tutorial-card">
//                <div class="tutorial-desc">${data.description}</div>
//                ${data.note ?` <div class="tutorial-note"><strong>Note:</strong> ${data.note}</div> `: ''}
//                ${data.fullNotes ? `<div class="tutorial-full-notes">${data.fullNotes.replace(/\n/g, "<br>")}</div>` : ''}
//              </div>`;
//   }

//   container.innerHTML = html || '<p class="no-tutorials">No tutorials available yet.</p>';
// }
//    //get the code and render the code 
// window.addEventListener("DOMContentLoaded", () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const tutorialFile = urlParams.get("tutorial");

//   if (tutorialFile) {
//     fetch(/tutorials/${tutorialFile})
//       .then(res => res.json())
//       .then(data => {
//         document.getElementById("title").innerText = data.subject + " - " + data.chapter;
//         document.getElementById("author").innerText = "Prepared by: " + data.prepared_by;
//         document.getElementById("content").innerText = data.fullNotes;
//       })
//       .catch(err => console.error("Failed to load tutorial:", err));
//   }
//    });



// // ----------------------------
// // 5. Execute function
// // ----------------------------
// //
// renderTutorials(tutorialsToShow);


//************************************************************************************************

// // ----------------------------
// // 1. Get container & subject
// // ----------------------------
// const container = document.getElementById('tutorials');
// const urlParams = new URLSearchParams(window.location.search);
// const subject = urlParams.get('subject'); // Example: ?subject=Psychology

// console.log("Abebe beso bela");


// // ----------------------------
// // 2. Fetch JSON safely
// // ----------------------------
// async function loadTutorial(chapterFile) {
//   try {
//     const response = await fetch(`courses/${chapterFile}`);
//     if (!response.ok) {
//       throw new Error(`File not found: ${chapterFile}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error loading JSON:", error);
//     return null;
//   }
// }

// // ----------------------------
// // 3. Render Tutorials
// // ----------------------------
// async function renderTutorials(chapterFiles) {
//   if (!subject) {
//     // container.innerHTML =' <p class="no-tutorials">No subject selected. Please open via your bot.</p>';
//    //show nothing hide content
//     container.innerHTML ="";
//     return;
//   }

//   const tutorials = [];
//   for (const file of chapterFiles) {
//     const data = await loadTutorial(file);
//     if (data.subject.toLowerCase() === subject.toLowerCase()) {
//       tutorials.push(data);
//     }
//   }

//   if (tutorials.length === 0) {
//     container.innerHTML = '<p class="no-tutorials">No tutorials available for ${subject}.</p>';
//     return;
//   }

//  let html = `<h2 style="text-align:center; margin-bottom:20px;">Tutorials for ${subject}</h2>`;
// html += tutorials.map(t => `
//   <div class="tutorial-card">
//     <div class="tutorial-title">${t.title}</div>
//     <div class="tutorial-desc">${t.description}</div>
//     ${t.note ? `<div class="tutorial-note"><strong>Note:</strong> ${t.note}</div> `: ""}
//     ${t.fullNotes ?` <div class="tutorial-full-notes">${t.fullNotes.replace(/\n/g, "<br>")}</div>` : ""}
//   </div>
// `).join('');

// container.innerHTML = html;
// }
// // ----------------------------
// // 4. Call function with files
// // ----------------------------
// renderTutorials([
//   // "psychology_chapter1.json",
//   `${subject.toLowerCase()}_chapter1.json`,
//   // Add more later: "psychology_chapter2.json", ...
// ]);











































