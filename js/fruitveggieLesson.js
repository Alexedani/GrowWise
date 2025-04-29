const fruitsAndVeggies = [
    { name: "Apple", description: "A sweet and crunchy red fruit.", image: "../images/apple.png" },
    { name: "Carrot", description: "A crunchy orange vegetable that's great for your eyes.", image: "../images/carrot.png" },
    { name: "Banana", description: "A soft and sweet yellow fruit full of energy.", image: "../images/banana.jpg" },
    { name: "Broccoli", description: "A green vegetable that's packed with nutrients.", image: "../images/broccoli.jpg" },
    { name: "Strawberry", description: "A juicy red fruit that's full of flavor.", image: "../images/strawberry.webp" },
    { name: "Tomato", description: "A versatile red fruit often used as a vegetable.", image: "../images/tomato.jpg" },
    { name: "Grapes", description: "Small and juicy purple or green fruits, perfect for snacking.", image: "../images/grapes.jpg" },
    { name: "Potato", description: "A starchy brown vegetable used in many dishes.", image: "../images/potato.webp" }
];

const fruitVeggieGrid = document.getElementById("fruit-veggie-grid");

// Populate the fruit and veggie grid
fruitsAndVeggies.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("fruit-veggie-card");

    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; margin-bottom: 10px;">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
    `;

    fruitVeggieGrid.appendChild(card);
});

// Initialize coins from session storage
const userVariable = sessionStorage.getItem("user");
const userData = JSON.parse(userVariable);
let coins = userData?.coins || 0; // Default to 0 if no coins are found

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropZone = event.target;

    // Check if the drop zone is correct
    if (
        (data === "apple" || data === "banana") && dropZone.id === "fruits-zone" ||
        (data === "carrot" || data === "broccoli") && dropZone.id === "veggies-zone"
    ) {
        // Correct match
        dropZone.appendChild(draggedElement);
        draggedElement.style.display = "none"; // Hide the dragged element
        showFeedback("Correct! You earned 5 coins!", true);
        coins += 5; // Add 5 coins
        updateCoinDisplay();
    } else {
        // Incorrect match
        showFeedback("Incorrect! Try again.", false);
    }
}

function showFeedback(message, isCorrect) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;
    feedback.style.color = isCorrect ? "green" : "red";
}

function updateCoinDisplay() {
    const coinLabel = document.getElementById("coins");
    coinLabel.textContent = `Coins: ${coins}`;
    // Update session storage
    userData.coins = coins;
    sessionStorage.setItem("user", JSON.stringify(userData));
}