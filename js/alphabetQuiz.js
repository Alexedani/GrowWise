const questions = [
    { question: "What letter comes after B?", answers: ["C", "D", "E", "F"], correct: 0 },
    { question: "What letter comes before F?", answers: ["D", "E", "G", "H"], correct: 1 },
    { question: "What letter is the last in the alphabet?", answers: ["X", "Y", "Z", "W"], correct: 2 },
    { question: "What letter comes between J and L?", answers: ["I", "K", "M", "N"], correct: 1 },
    { question: "What letter comes after X?", answers: ["Y", "Z", "W", "V"], correct: 0 },
    { question: "What letter comes before P?", answers: ["M", "N", "O", "Q"], correct: 2 },
    { question: "What letter is in the middle of the alphabet?", answers: ["L", "M", "N", "O"], correct: 1 },
    { question: "What letter comes after T?", answers: ["U", "V", "W", "X"], correct: 0 },
    { question: "What letter comes before H?", answers: ["F", "G", "I", "J"], correct: 1 },
    { question: "What letter comes between Q and S?", answers: ["P", "R", "T", "U"], correct: 1 },
];

let currentQuestionIndex = 0;

const questionElement = document.getElementById("question");
const lettersContainer = document.getElementById("letters-container");
const feedbackElement = document.getElementById("feedback");

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // Clear previous letters
    lettersContainer.innerHTML = "";

    // Display answer options as letter cards
    currentQuestion.answers.forEach((letter, index) => {
        const letterCard = document.createElement("div");
        letterCard.textContent = letter;
        letterCard.classList.add("letter-card");
        letterCard.addEventListener("click", () => checkAnswer(index));
        lettersContainer.appendChild(letterCard);
    });

    // Clear feedback
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("wrong");
}

function checkAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correct) {
        feedbackElement.textContent = "Correct! Great job!";
        feedbackElement.classList.remove("wrong");
    } else {
        feedbackElement.textContent = "Oops! Try again.";
        feedbackElement.classList.add("wrong");
    }

    // Move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            feedbackElement.textContent = "Lesson complete! You can now take the quiz.";
        }
    }, 1500);
}

// Start the lesson
showQuestion();