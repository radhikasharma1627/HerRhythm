// ========== LOGIN ==========
function enterApp() {
  const name = document.getElementById("userName").value;
  const dob = document.getElementById("dob").value;

  if (!name || !dob) {
    alert("Please enter your name and date of birth.");
    return;
  }

  localStorage.setItem("userName", name);
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("greeting").innerText = `🌸 Hello, ${name}!`;
}

function goToPrediction() {
  const lastDate = document.getElementById("lastDate").value;
  const cycleLength = document.getElementById("cycleLength").value;
  const periodLength = document.getElementById("periodLength").value;

  if (!lastDate || !cycleLength || !periodLength) {
    alert("Please fill all cycle details.");
    return;
  }

  localStorage.setItem("lastDate", lastDate);
  localStorage.setItem("cycleLength", cycleLength);
  localStorage.setItem("periodLength", periodLength);
  window.location.href = "prediction.html";
}

// ========== PREDICTION PAGE ==========
if (window.location.pathname.includes("prediction.html")) {
  const name = localStorage.getItem("userName");
  document.getElementById("predictionTitle").innerText = `🌸 Hello, ${name}! Your Cycle Prediction is`;

  const lastDate = new Date(localStorage.getItem("lastDate"));
  const cycleLength = parseInt(localStorage.getItem("cycleLength"));
  const periodLength = parseInt(localStorage.getItem("periodLength"));

  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(lastDate.getDate() + cycleLength);

  const fertileStart = new Date(lastDate);
  fertileStart.setDate(lastDate.getDate() + 10);

  const fertileEnd = new Date(lastDate);
  fertileEnd.setDate(lastDate.getDate() + 17);

  const ovulationDay = new Date(lastDate);
  ovulationDay.setDate(lastDate.getDate() + 14);

  document.getElementById("predictionResults").innerHTML = `
    <p><strong>Next Period:</strong> ${nextPeriod.toDateString()}</p>
    <p><strong>Fertile Window:</strong> ${fertileStart.toDateString()} - ${fertileEnd.toDateString()}</p>
    <p><strong>Ovulation Day:</strong> ${ovulationDay.toDateString()}</p>
    <p><strong>Period Duration:</strong> ${periodLength} days</p>
  `;

  // Calendar
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function renderCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const monthYear = document.getElementById("monthYear");
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    monthYear.innerText = `${months[month]} ${year}`;

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      calendar.appendChild(empty);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const div = document.createElement("div");
      div.innerText = day;

      // Highlight
      if (date.toDateString() === nextPeriod.toDateString()) div.classList.add("period");
      if (date >= fertileStart && date <= fertileEnd) div.classList.add("fertile");
      if (date.toDateString() === ovulationDay.toDateString()) div.classList.add("ovulation");

      calendar.appendChild(div);
    }
  }
  renderCalendar(currentMonth, currentYear);

  window.prevMonth = function() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
  }
  window.nextMonth = function() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
  }

  // Notes
  function displayNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const container = document.getElementById("savedNotes");
    container.innerHTML = "";
    savedNotes.forEach((note, index) => {
      const div = document.createElement("div");
      div.className = "saved-note";
      div.innerHTML = `<strong>${note.date}</strong>: ${note.text}
        <button class="delete-note" onclick="deleteNote(${index})">×</button>`;
      container.appendChild(div);
    });
  }
  window.addNote = function() {
    const date = document.getElementById("noteDate").value;
    const text = document.getElementById("noteText").value;
    if (!date || !text) { alert("Please enter date and note"); return; }
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({ date, text });
    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("noteText").value = "";
    displayNotes();
  }
  window.deleteNote = function(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
  }
  displayNotes();
}

// ========== CARE GUIDE ==========
function toggleCareGuide() {
  const guide = document.getElementById("careGuide");
  guide.style.display = guide.style.display === "block" ? "none" : "block";
}

// ========== LOGOUT ==========
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
function goHome() {
  window.location.href = "index.html";
}
