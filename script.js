// Get container
let container = document.getElementById("tutorials");

// Load tutorial securely from your server with token
async function loadTutorial(fileName) {
  try {
    const response = await fetch(
      `https://fam-mentorship-tutorial.onrender.com/tutorial/${fileName}?token=SECURE123`,
      { credentials: "include" }
    );

    if (!response.ok) throw new Error("Tutorial not found or access denied");

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}


// Render tutorial as image
async function renderTutorial(fileName) {
  if (!fileName) {
    container.innerHTML = '<p class="no-tutorials">No tutorial selected.</p>';
    return;
  }

  const data = await loadTutorial(fileName);
  if (!data) {
    container.innerHTML =
      '<p class="no-tutorials">Tutorial not found or access denied.</p>';
    return;
  }

  // Build HTML
  let html ='';
  html += `<h2 style="text-align:center; margin-bottom:20px;">${data.subject} - ${data.chapter}</h2>`;
  html += `<div class="tutorial-card">
             <div class="tutorial-desc">${data.description}</div>
             ${data.prepared_by ? `<div class="tutorial-prepared"><strong>Prepared by:</strong> ${data.prepared_by}</div>` : ""}
             ${data.note ? `<div class="tutorial-note"><strong>Note:</strong> ${data.note}</div>` : ""}
             ${data.fullNotes ? `<div class="tutorial-full-notes">${data.fullNotes.replace(/\n/g, "<br>")}</div>` : ""}
           </div>`;

  container.innerHTML = html;

  // Convert HTML to image via html2canvas
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html2canvas(container, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      }).then((canvas) => {
        container.innerHTML = "";
        container.appendChild(canvas);
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";
      });
    });
  });
}

// Get tutorial from URL params
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tutorialFile = urlParams.get("tutorial"); // e.g. psychology_chapter1.json
  renderTutorial(tutorialFile);
});






//*********************************************************************************************************************************************
//----------------------------
//1. Get container
//----------------------------
// let container = document.getElementById('tutorials');
// // //console.log(20);
// //----------------------------
// //2. Load a single JSON file safely
// //---------------------------- first to check members id****************************
// async function loadTutorial(fileName) {
//   try {
//     const response = await fetch(`/courses/${fileName}`);
//     if (!response.ok) throw new Error("File not found: " + fileName);
//     return await response.json();
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

//************************************************************


// ----------------------------
// 3. Render a tutorial dynamically
// ----------------------------




// async function renderTutorial(fileName) {
//   if (!fileName) {
//     container.innerHTML = '<p class="no-tutorials">No tutorial selected.</p>';
//     return;
//   }

//   const data = await loadTutorial(fileName);
//   if (!data) {
//     container.innerHTML = '<p class="no-tutorials">Tutorial not found.</p>';
//     return;
//   }

//   let html = '';
//   html +=` <h2 style="text-align:center; margin-bottom:20px;">${data.subject} - ${data.title}</h2>`;
//   html += `<div class="tutorial-card">
//              <div class="tutorial-desc">${data.description}</div>
//              ${data.note ? `<div class="tutorial-note"><strong>Note:</strong> ${data.note}</div>` : ''}
//              ${data.fullNotes ? `<div class="tutorial-full-notes">${data.fullNotes.replace(/\n/g, "<br>")}</div>` : ''}
//            </div>`;

//  container.innerHTML = html;

// // 2. Wait 2 frames → ensures browser paints it
//   requestAnimationFrame(() => {
//     requestAnimationFrame(() => {
//       html2canvas(container, {
//         backgroundColor:null,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         windowWidth: container.scrollWidth,
//         windowHeight: container.scrollHeight
//       }).then(canvas => {
//         container.innerHTML = "";
//         container.appendChild(canvas);

//         canvas.style.maxWidth = "100%";
//         canvas.style.height = "auto";
//       });
//     });
//   });

  
// }




// //*******************************************************  
// // ----------------------------
// // 4. Get tutorial from URL and render
// // ----------------------------
// window.addEventListener("DOMContentLoaded", () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const tutorialFile = urlParams.get("tutorial"); // e.g. psychology_chapter1.json
//   renderTutorial(tutorialFile);
// });
// // Function: render text as uncopyable image
// function renderAsImage(text, containerId) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   // Set canvas size (adjust if your notes are long)
//   canvas.width = 800;
//   canvas.height = 1200;

//   // White background
//   ctx.fillStyle = "white";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   // Text style
//   ctx.fillStyle = "black";
//   ctx.font = "20px Arial";

//   // Split into lines and draw
//   const lines = text.split("\n");
//   lines.forEach((line, i) => {
//     ctx.fillText(line, 20, 40 + i * 30);
//   });

//   // Clear old content, then add canvas
//   const container = document.getElementById(containerId);
//   container.innerHTML = "";
//   container.appendChild(canvas);
// }





//********************************************************************************************************************************




























































































