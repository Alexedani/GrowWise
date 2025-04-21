// quiz.js

document.addEventListener('DOMContentLoaded', () => {
    // ── 1. Quiz data + state ─────────────────────────
    const quizzes = {
      math: [
        { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
        { question: "What is 5 * 3?", answers: ["15", "10", "20", "25"], correct: 0 },
        { question: "What is 9 - 4?", answers: ["5", "6", "7", "8"], correct: 0 },
      ],
      shapes: [
        { question: "What shape has three sides?", answers: ["Triangle", "Square", "Circle", "Rectangle"], correct: 0 },
        { question: "What shape has four equal sides?", answers: ["Square", "Triangle", "Circle", "Rectangle"], correct: 0 },
        { question: "What shape is round?", answers: ["Circle", "Square", "Triangle", "Rectangle"], correct: 0 },
      ],
      letters: [
        { question: "What letter comes after A?", answers: ["B", "C", "D", "E"], correct: 0 },
        { question: "What letter comes before C?", answers: ["A", "B", "D", "E"], correct: 1 },
        { question: "What letter is the first in the alphabet?", answers: ["A", "B", "C", "D"], correct: 0 },
      ],
      fruits: [
        { question: "Which fruit is known as the king of fruits?", answers: ["Mango", "Apple", "Banana", "Pineapple"], correct: 0 },
        { question: "Which fruit is red and often associated with love?", answers: ["Strawberry", "Apple", "Cherry", "Pomegranate"], correct: 0 },
        { question: "Which fruit is red and often associated with love?", answers: ["Strawberry", "Apple", "Cherry", "Pomegranate"], correct: 0 },
      ],
    };
  
    const urlParams = new URLSearchParams(window.location.search);
    const quizId     = urlParams.get("quizId");
    const questions  = quizzes[quizId] || [];
    let currentQuestionIndex = 0;
    let score                 = 0;
    let selectedAnswerIndex   = null;
  
   // ── 2. Cache DOM nodes ───────────────────────────
  const questionElement   = document.getElementById("question");
  const answersElement    = document.getElementById("answers");
  const prevButton        = document.getElementById("prev-btn");
  const confirmButton     = document.getElementById("confirm-btn");
  const showCorrectButton = document.getElementById("show-correct-btn");
  const nextButton        = document.getElementById("next-btn");

  // ── 3. Navigation handlers ───────────────────────
  prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) showQuestion(--currentQuestionIndex);
  });
  nextButton.addEventListener("click", () => {
    if (++currentQuestionIndex < questions.length) {
      showQuestion(currentQuestionIndex);
    } else {
      const total = questions.length;
      const pct   = ((score/total)*100).toFixed(2);
      window.location.href = `completedQuiz.html?score=${score}&total=${total}&percentage=${pct}`;
    }
  });

  // ── 4. Confirm / Show‑Correct logic w/ pop‑up ─────
  confirmButton.addEventListener("click", () => {
    const q = questions[currentQuestionIndex];
    // disable answers
    Array.from(answersElement.children).forEach(b => {
      b.disabled = true;
      b.classList.remove("selected");
    });
    confirmButton.classList.add("hidden");

    // decide feedback
    let message, isCorrect;
    if (selectedAnswerIndex === q.correct) {
      message   = "🎉 Congratulations, you got it right!";
      isCorrect = true;
    } else {
      message   = "😞 Oops, your answer is wrong.";
      isCorrect = false;
    }

    // show the pop‑up
    showPopup(message, () => {
      // after user clicks OK in the pop‑up
      if (currentQuestionIndex > 0) prevButton.classList.remove("hidden");

      if (isCorrect) {
        answersElement.children[q.correct].classList.add("correct");
        score++;
        updateUserCoins(10);
      } else {
        answersElement.children[selectedAnswerIndex].classList.add("incorrect");
        showCorrectButton.classList.remove("hidden");
        showCorrectButton.disabled = false;
        showCorrectButton.onclick = () => {
          answersElement.children[q.correct].classList.add("correct");
          showCorrectButton.disabled = true;
        };
      }

      nextButton.classList.remove("hidden");
    });
  });

  // ── 5. Render a question ─────────────────────────
  function showQuestion(idx) {
    const q = questions[idx];
    // reset
    questionElement.textContent = q.question;
    answersElement.innerHTML    = "";
    selectedAnswerIndex         = null;
    [prevButton, confirmButton, showCorrectButton, nextButton]
      .forEach(b => b.classList.add("hidden"));

    // build answers
    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.className   = "btn";
      btn.onclick     = () => {
        selectedAnswerIndex = i;
        Array.from(answersElement.children)
          .forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        confirmButton.classList.remove("hidden");
      };
      answersElement.appendChild(btn);
    });

    // Next text
    nextButton.textContent = (idx === questions.length - 1)
      ? "Complete Quiz"
      : "Next Question";
  }

  // ── 6. Pop‑up helper ──────────────────────────────
  function showPopup(message, onOk) {
    // create overlay
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML =
      `<div class="popup-box">
         <p>${message}</p>
         <button id="popup-ok">OK</button>
       </div>`;
    document.body.appendChild(overlay);

    // hook OK
    overlay.querySelector("#popup-ok").onclick = () => {
      overlay.remove();
      onOk();
    };
  }

  // ── 7. Coin‑update helper ─────────────────────────
  function updateUserCoins(amount) {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user) {
      user.coins = (user.coins||0) + amount;
      sessionStorage.setItem('user', JSON.stringify(user));
      if (typeof updateCoinsDisplay === "function")
        updateCoinsDisplay();
    }
  }

  // ── 8. Start or empty ────────────────────────────
  if (questions.length) showQuestion(0);
  else questionElement.textContent = "No questions available.";
});

// pop‑up helper with animation
function showPopup(message, type, onOk) {
    // pick the right GIF file
    const gifFile = type === "correct" ? "happy.gif" : "sad.gif";
  
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box">
        <img src="../images/${gifFile}" alt="${type}" class="feedback-gif" />
        <p>${message}</p>
        <button id="popup-ok">OK</button>
      </div>
    `;
    document.body.appendChild(overlay);
  
    overlay.querySelector("#popup-ok").onclick = () => {
      overlay.remove();
      onOk();
    };
  }
  