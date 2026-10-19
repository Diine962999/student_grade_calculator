# Student Grade Calculator

A responsive student grade calculator built with HTML, CSS, and vanilla JavaScript.

## Features
- Accepts a student's name and scores in five subjects.
- Validates scores as whole numbers from 0 to 100.
- Calculates total score out of 500 and average out of 100.
- Assigns a grade from the displayed grade scale.
- Displays results in a table.
- Counts registered students.
- Identifies the highest-scoring student by total score.
- Finds the subject with the lowest class average.
- Includes student search, delete, and clear-all controls.

## Grade scale
A: 70–100; B: 60–69; C: 50–59; D: 45–49; E: 40–44; F: 0–39.
Confirm the grade ranges with your lecturer and update `getGrade()` in `script.js` if needed.

## Run locally
Extract the ZIP and open `index.html` in a modern web browser.

Student data is held in memory while the page is open; it is not saved to a database.

## Publish with GitHub Pages
1. Create a GitHub repository named `student-grade-calculator`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open the published URL shown in the Pages section after deployment finishes.
