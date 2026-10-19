const subjects = [
  { key: "mathematics", label: "Mathematics" },
  { key: "english", label: "English" },
  { key: "biology", label: "Biology" },
  { key: "chemistry", label: "Chemistry" },
  { key: "physics", label: "Physics" }
];
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const resultsBody = document.getElementById("resultsBody");
const searchInput = document.getElementById("searchInput");
const students = [];

function getGrade(average) {
  if (average >= 70) return "A";
  if (average >= 60) return "B";
  if (average >= 50) return "C";
  if (average >= 45) return "D";
  if (average >= 40) return "E";
  return "F";
}

function showError(input, message) {
  input.classList.toggle("invalid", Boolean(message));
  document.getElementById(input.id + "Error").textContent = message;
}
function clearErrors() {
  [nameInput, ...subjects.map(s => document.getElementById(s.key))].forEach(input => showError(input, ""));
}
function validateForm() {
  clearErrors();
  let valid = true;
  const name = nameInput.value.trim();
  if (name.length < 2) {
    showError(nameInput, "Enter a name with at least 2 characters.");
    valid = false;
  } else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) {
    showError(nameInput, "Use letters, spaces, apostrophes, dots or hyphens only.");
    valid = false;
  }
  const scores = {};
  subjects.forEach(subject => {
    const input = document.getElementById(subject.key);
    const raw = input.value.trim();
    const score = Number(raw);
    if (raw === "" || !Number.isFinite(score)) {
      showError(input, "Enter a score from 0 to 100."); valid = false;
    } else if (score < 0 || score > 100) {
      showError(input, "Score must be between 0 and 100."); valid = false;
    } else if (!Number.isInteger(score)) {
      showError(input, "Enter a whole number."); valid = false;
    } else scores[subject.key] = score;
  });
  return valid ? { name, scores } : null;
}
function addStudent(name, scores) {
  const total = subjects.reduce((sum, s) => sum + scores[s.key], 0);
  const average = total / subjects.length;
  students.push({ id: Date.now() + "-" + Math.random(), name, scores, total, average, grade: getGrade(average) });
}
function renderTable() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = students.filter(s => s.name.toLowerCase().includes(query));
  resultsBody.innerHTML = "";
  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 10; cell.className = "empty";
    cell.textContent = students.length ? "No students match your search." : "No student results yet. Add a student using the form above.";
    row.appendChild(cell); resultsBody.appendChild(row);
  } else visible.forEach(student => {
    const row = document.createElement("tr");
    [student.name, ...subjects.map(s => student.scores[s.key]), student.total, student.average.toFixed(2)].forEach(value => {
      const cell = document.createElement("td"); cell.textContent = value; row.appendChild(cell);
    });
    const gradeCell = document.createElement("td");
    const badge = document.createElement("span"); badge.className = "grade" + (student.grade === "F" ? " fail" : "");
    badge.textContent = student.grade; gradeCell.appendChild(badge); row.appendChild(gradeCell);
    const actionCell = document.createElement("td");
    const button = document.createElement("button"); button.type = "button"; button.className = "delete-btn";
    button.textContent = "Delete"; button.setAttribute("aria-label", "Delete " + student.name);
    button.addEventListener("click", () => {
      const index = students.findIndex(s => s.id === student.id);
      if (index !== -1) students.splice(index, 1);
      renderAll();
    });
    actionCell.appendChild(button); row.appendChild(actionCell); resultsBody.appendChild(row);
  });
  updateSummary();
}
function updateSummary() {
  document.getElementById("studentCount").textContent = students.length;
  if (!students.length) {
    document.getElementById("highestTotal").textContent = "—";
    document.getElementById("highestStudent").textContent = "No students yet";
    document.getElementById("lowestAverage").textContent = "—";
    document.getElementById("lowestSubject").textContent = "No scores yet";
    return;
  }
  const highest = students.reduce((best, current) => current.total > best.total ? current : best);
  document.getElementById("highestTotal").textContent = highest.total + "/500";
  document.getElementById("highestStudent").textContent = highest.name;
  const averages = subjects.map(subject => ({
    label: subject.label,
    average: students.reduce((sum, student) => sum + student.scores[subject.key], 0) / students.length
  }));
  const lowest = averages.reduce((worst, current) => current.average < worst.average ? current : worst);
  document.getElementById("lowestAverage").textContent = lowest.average.toFixed(2);
  document.getElementById("lowestSubject").textContent = lowest.label;
}
function renderAll() { renderTable(); }

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = validateForm();
  if (!data) return;
  addStudent(data.name, data.scores);
  form.reset(); clearErrors(); renderAll(); nameInput.focus();
});
form.addEventListener("reset", () => setTimeout(clearErrors, 0));
searchInput.addEventListener("input", renderTable);
document.getElementById("clearAllButton").addEventListener("click", () => {
  if (students.length && window.confirm("Clear all student results? This cannot be undone.")) {
    students.length = 0; renderAll();
  }
});
renderAll();
