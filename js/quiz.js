/* quiz.js 
   this file handles the logic for 
   quiz.html where the user will select
   a quiz which will match to one of the quizzes
   the datasctructure quizzes hold all the quizzes, 
   questions, and answers.
   
   to add a new quiz and questions, just modify
   the quiz data scructure and add your quiz name 
   and questions below*/


// questions for each quiz
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

// Get the quizId from the URL
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");

// the '||' syntax means that questions
// will be empty if the quiz ID isnt found or is invalid. 
const questions = quizzes[quizId] || [];
let currentQuestionIndex = 0;
let score = 0; 

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

// Create a confirm button
const confirmButton = document.createElement("button");
confirmButton.textContent = "Confirm Answer";
confirmButton.classList.add("btn", "hidden");
answersElement.parentElement.appendChild(confirmButton);

let selectedAnswerIndex = null; 

// Display the current question
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
     // Clear previous answers
    answersElement.innerHTML = ""; 
    // reset selected answer
    selectedAnswerIndex = null; 
    // hide confirm button
    confirmButton.classList.add("hidden"); 

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(index, button));
        answersElement.appendChild(button);
    });

    // Update the "Next Question" button text to "Complete Quiz" if it's the last question
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Complete Quiz";
    }
}

// Handle answer selection
function selectAnswer(index, button) {
    selectedAnswerIndex = index;

    // Highlight the selected button
    Array.from(answersElement.children).forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    // Show the confirm button
    confirmButton.classList.remove("hidden");
}

// Handle answer confirmation
confirmButton.addEventListener("click", () => {
    if (selectedAnswerIndex === null) {
        alert("Please select an answer before confirming.");
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswerIndex === currentQuestion.correct) {
        alert("Correct!");
        score++; 
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (user && typeof user.coins === "number") {
            user.coins += 10;
            sessionStorage.setItem('user', JSON.stringify(user));
            updateCoinsDisplay();  // optional but ensures live UI update
        }
    } else {
        alert("Wrong!");
    }

    //Disable all answer buttons
    Array.from(answersElement.children).forEach((btn) => {
        btn.disabled = true;
        btn.classList.add("disabled"); 
    });

    //hides confirm button and show next button
    confirmButton.classList.add("hidden"); 
    nextButton.classList.remove("hidden"); 
});

// Move to the next question
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        nextButton.classList.add("hidden");

        // Update the button text back to "Next Question" if not the last question
        if (currentQuestionIndex < questions.length - 1) {
            nextButton.textContent = "Next Question";
        }
    } else {

        // Calculate final score
        // after all questions are answereed 
        const totalQuestions = questions.length;
        const percentageScore = (score / totalQuestions) * 100;

        // Redirect to completedQuiz.html with score details
        const params = new URLSearchParams({
            score: score,
            total: totalQuestions,
            percentage: percentageScore.toFixed(2),
        });
        window.location.href = `completedQuiz.html?${params.toString()}`;
    }
});

// Start the quiz
if (questions.length > 0) {
    showQuestion();
} else {
    questionElement.textContent = "No questions available for this quiz.";
}