let score = 0;

// Section switch
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// MISSIONS
function completeMission(points) {
  score += points;
  document.getElementById("mission-status").innerText = "Mission Completed! +" + points;
  saveScore();
}

// QUIZ
let questions = [
  { q: "What is phishing?", a: ["Fake emails", "Firewall"], correct: 0 },
  { q: "Strong password should contain?", a: ["Numbers & Symbols", "Only name"], correct: 0 },
  { q: "Public WiFi risk?", a: ["Data theft", "Always safe"], correct: 0 },
  { q: "Malware means?", a: ["Malicious software", "Good software"], correct: 0 },
  { q: "Two-factor authentication provides?", a: ["Extra security", "No benefit"], correct: 0 }
];

let current = 0;

function loadQuestion() {
  let q = questions[current];
  document.getElementById("question").innerText = q.q;

  let options = document.getElementById("options");
  options.innerHTML = "";

  q.a.forEach((text, i) => {
    let btn = document.createElement("button");
    btn.className = "btn";
    btn.innerText = text;
    btn.onclick = () => {
      if (i === q.correct) score++;
      nextQuestion();
    };
    options.appendChild(btn);
  });
}

function nextQuestion() {
  current++;
  if (current < questions.length) loadQuestion();
  else document.getElementById("score").innerText = "Quiz Completed! Score: " + score;
  saveScore();
}

// PHISHING
function phishResult(isSafe) {
  let msg = document.getElementById("phish-feedback");
  if (!isSafe) {
    score++;
    msg.innerText = "Correct — This is phishing!";
  } else {
    msg.innerText = "Incorrect — This email is dangerous.";
  }
  saveScore();
}

// PASSWORD CHECKER
function checkPassword() {
  let pass = document.getElementById("passwordInput").value;
  let out = document.getElementById("pass-result");

  if (pass.length < 6) out.innerText = "Weak Password ❌";
  else if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
    out.innerText = "Strong Password ✅";
    score++;
  } else out.innerText = "Medium Strength ⚠️";

  saveScore();
}

// TERMINAL
function runCommand(e) {
  if (e.key === "Enter") {
    let input = document.getElementById("terminalInput");
    let out = document.getElementById("terminalOutput");
    let cmd = input.value.toLowerCase();

    out.innerHTML += `<div>> ${cmd}</div>`;

    if (cmd === "help") out.innerHTML += "<div>Commands: help, scan, hack, clear</div>";
    else if (cmd === "scan") { out.innerHTML += "<div>Threat scan complete. Risks detected.</div>"; score++; }
    else if (cmd === "hack") out.innerHTML += "<div>Access blocked. Training mode active.</div>";
    else if (cmd === "clear") out.innerHTML = "";
    else out.innerHTML += "<div>Unknown command</div>";

    input.value = "";
    out.scrollTop = out.scrollHeight;
    saveScore();
  }
}

// SAVE SCORE
function saveScore() {
  let name = localStorage.getItem("ctasUser");
  if (!name) {
    name = prompt("Enter your name:") || "Anonymous";
    localStorage.setItem("ctasUser", name);
  }

  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  let existing = board.find(x => x.name === name);

  if (existing) existing.score = score;
  else board.push({ name, score });

  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(board));
  loadLeaderboard();
}

// LOAD LEADERBOARD
function loadLeaderboard() {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  let table = document.getElementById("leaderboardTable");

  table.innerHTML = "<tr><th>User</th><th>Score</th></tr>";
  board.forEach(row => {
    table.innerHTML += `<tr><td>${row.name}</td><td>${row.score}</td></tr>`;
  });
}

loadQuestion();
loadLeaderboard();
