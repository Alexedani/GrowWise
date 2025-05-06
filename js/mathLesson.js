function openAdditionModal() {
    document.getElementById('additionModal').classList.remove('hidden');
    generateAdditionQuestion();
}

function closeAdditionModal() {
    document.getElementById('additionModal').classList.add('hidden');
    document.getElementById('additionFeedback').textContent = '';
    document.getElementById('additionAnswer').value = ''; // Clear input
}

function generateAdditionQuestion() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    document.getElementById('additionQuestion').textContent = `What is ${num1} + ${num2}?`;
    document.getElementById('additionAnswer').dataset.correctAnswer = num1 + num2;
}

function checkAdditionAnswer() {
    const userAnswer = parseInt(document.getElementById('additionAnswer').value, 10);
    const correctAnswer = parseInt(document.getElementById('additionAnswer').dataset.correctAnswer, 10);
    const feedback = document.getElementById('additionFeedback');
    if (userAnswer === correctAnswer) {
        feedback.textContent = 'Correct! Great job!';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Oops! Try again.';
        feedback.style.color = 'red';
    }
}

function openSubtractionModal() {
    document.getElementById('subtractionModal').classList.remove('hidden');
    generateSubtractionQuestion();
}

function closeSubtractionModal() {
    document.getElementById('subtractionModal').classList.add('hidden');
    document.getElementById('subtractionFeedback').textContent = '';
    document.getElementById('subtractionAnswer').value = ''; // Clear input
}

function generateSubtractionQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 5; // Ensure num1 > num2
    const num2 = Math.floor(Math.random() * 5);
    document.getElementById('subtractionQuestion').textContent = `What is ${num1} - ${num2}?`;
    document.getElementById('subtractionAnswer').dataset.correctAnswer = num1 - num2;
}

function checkSubtractionAnswer() {
    const userAnswer = parseInt(document.getElementById('subtractionAnswer').value, 10);
    const correctAnswer = parseInt(document.getElementById('subtractionAnswer').dataset.correctAnswer, 10);
    const feedback = document.getElementById('subtractionFeedback');
    if (userAnswer === correctAnswer) {
        feedback.textContent = 'Correct! Great job!';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = 'Oops! Try again.';
        feedback.style.color = 'red';
    }
}
