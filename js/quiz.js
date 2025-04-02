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
    uscapitals: [
        { question: "What is the capital of California?", answers: ["Sacramento", "Los Angeles", "San Diego", "San Francisco"], correct: 0 },
        { question: "What is the capital of New York?", answers: ["Albany", "New York City", "Buffalo", "Rochester"], correct: 0 },
        { question: "What is the capital of Florida?", answers: ["Tallahassee", "Miami", "Orlando", "Jacksonville"], correct: 0 },
        { question: "What is the capital of Illinois?", answers: ["Springfield", "Chicago", "Peoria", "Naperville"], correct: 0 },
    ],
    trafficlaws: [
        { question: "What does a red traffic light mean?", answers: ["Stop", "Go", "Yield", "Slow Down"], correct: 0 },
        { question: "What shape is a stop sign?", answers: ["Octagon", "Circle", "Triangle", "Square"], correct: 0 },
    ],
    
    fruits: [
        { question: "Which fruit is known as the king of fruits?", answers: ["Mango", "Apple", "Banana", "Pineapple"], correct: 0 },
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