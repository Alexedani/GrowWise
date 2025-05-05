// quiz.js
document.addEventListener('DOMContentLoaded', () => {
  /* ───────────────── 1. Quiz data + state ───────────────── */
  const quizzes = {
    math: [
      { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1, hints: ["It's an even number."] },
      { question: "What is 5 * 3?", answers: ["15", "10", "20", "25"], correct: 0, hints: ["Think of 5 added 3 times."] },
      { question: "What is 9 - 4?", answers: ["5", "6", "7", "8"], correct: 0, hints: ["It's less than 10."] },
    ],
    shapes: [
      { question: "What shape has three sides?", answers: ["Triangle", "Square", "Circle", "Rectangle"], correct: 0, hints: ["It has three angles."] },
      { question: "What shape has four equal sides?", answers: ["Square", "Triangle", "Circle", "Rectangle"], correct: 0, hints: ["All sides are the same length."] },
      { question: "What shape is round?", answers: ["Circle", "Square", "Triangle", "Rectangle"], correct: 0, hints: ["It has no corners."] },
    ],
    letters: [
      { question: "What letter comes after A?", answers: ["B", "C", "D", "E"], correct: 0, hints: ["It's the second letter of the alphabet."] },
      { question: "What letter comes before C?", answers: ["A", "B", "D", "E"], correct: 1, hints: ["It's the second letter of the alphabet."] },
      { question: "What letter is the first in the alphabet?", answers: ["A", "B", "C", "D"], correct: 0, hints: ["It's the first letter of the alphabet."] },
    ],
    fruits: [
      { question: "Which fruit is known as the king of fruits?", answers: ["Mango", "Apple", "Banana", "Pineapple"], correct: 0, hints: ["It's tropical and yellow when ripe."] },
      { question: "Which fruit is red and often associated with love?", answers: ["Strawberry", "Apple", "Cherry", "Pomegranate"], correct: 0, hints: ["It's small and has seeds on the outside."] },
      { question: "Which fruit is yellow and curved?", answers: ["Banana", "Apple", "Grape", "Orange"], correct: 0, hints: ["Monkeys love it."] },
    ],
  };

  const urlParams = new URLSearchParams(window.location.search);
  const quizId    = urlParams.get("quizId");          // <─ keep the id
  const questions = quizzes[quizId] || [];
  let currentQuestionIndex = 0;
  let score               = 0;
  let selectedAnswerIndex = null;

  /* ───────────────── 2. Cache DOM ───────────────── */
  const questionElement   = document.getElementById("question");
  const answersElement    = document.getElementById("answers");
  const prevButton        = document.getElementById("prev-btn");
  const confirmButton     = document.getElementById("confirm-btn");
  const showCorrectButton = document.getElementById("show-correct-btn");
  const nextButton        = document.getElementById("next-btn");
  const hintButton        = document.getElementById("hint-btn");
  const hintDisplay       = document.getElementById("hint-display");

  /* ───────────────── 3. Navigation ───────────────── */
  prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) showQuestion(--currentQuestionIndex);
  });

  nextButton.addEventListener("click", () => {
    if (++currentQuestionIndex < questions.length) {
      showQuestion(currentQuestionIndex);
    } else {
      const total = questions.length;
      const pct   = ((score / total) * 100).toFixed(2);
      /* 🔑  Pass quizId so we can show it later */
      window.location.href =
        `completedQuiz.html?quizId=${quizId}&score=${score}&total=${total}&percentage=${pct}`;
    }
  });

  /* ───────────────── 4. Confirm logic w/ pop-up ───────────────── */
  confirmButton.addEventListener("click", () => {
    const q = questions[currentQuestionIndex];

    /* lock answers */
    Array.from(answersElement.children).forEach(b => {
      b.disabled = true;
      b.classList.remove("selected");
    });
    confirmButton.classList.add("hidden");

    const isCorrect = selectedAnswerIndex === q.correct;
    const message   = isCorrect
      ? "🎉 Great job!"
      : "Oops, that wasn’t correct.";

    showPopup(message, isCorrect ? "correct" : "wrong", () => {
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

  /* ───────────────── 5. Hint logic ───────────────── */
  hintButton.addEventListener("click", () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (user && user.numHints > 0) {
      const q = questions[currentQuestionIndex];
      hintDisplay.textContent = `Hint: ${q.hints[0]}`; // Display the first hint
      hintDisplay.style.display = "block"; // Show the hint container
      user.numHints--;
      sessionStorage.setItem("user", JSON.stringify(user));
      hintButton.disabled = user.numHints === 0;
    } else {
      hintDisplay.textContent = "You have no hints left!";
      hintDisplay.style.display = "block"; // Show the hint container
    }
  });

  /* ───────────────── 6. Render a question ───────────────── */
  function showQuestion(idx) {
    const q = questions[idx];
    questionElement.textContent = q.question;
    answersElement.innerHTML    = "";
    selectedAnswerIndex         = null;
    [prevButton, confirmButton, showCorrectButton, nextButton]
      .forEach(b => b.classList.add("hidden"));

    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.className   = "btn";
      btn.onclick = () => {
        selectedAnswerIndex = i;
        Array.from(answersElement.children)
          .forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        confirmButton.classList.remove("hidden");
      };
      answersElement.appendChild(btn);
    });

    nextButton.textContent =
      (idx === questions.length - 1) ? "Complete Quiz" : "Next Question";

    hintButton.disabled = !(JSON.parse(sessionStorage.getItem("user") || "{}").numHints > 0);
  }

  /* ───────────────── 7. Pop-up helper ───────────────── */
  function showPopup(message, type, onOk) {
    const gifFile = type === "correct" ? "happy.gif" : "sad3.gif";
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box">
        <img src="../images/${gifFile}" alt="${type}" class="feedback-gif" />
        <p>${message}</p>
        <button id="popup-ok">OK</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#popup-ok").onclick = () => {
      overlay.remove();
      onOk();
    };
  }

  /* ───────────────── 8. Coin helper ───────────────── */
  function updateUserCoins(amount) {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (user) {
      user.coins = (user.coins || 0) + amount;
      sessionStorage.setItem("user", JSON.stringify(user));
      if (typeof updateCoinsDisplay === "function") updateCoinsDisplay();
    }
  }

  /* ───────────────── 9. Kick-off ───────────────── */
  questions.length ? showQuestion(0)
                   : (questionElement.textContent = "No questions available.");
});
