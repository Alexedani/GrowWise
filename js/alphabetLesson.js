// Populate the alphabet grid
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphabetGrid = document.getElementById("alphabet-grid");

alphabet.forEach((letter) => {
    const letterCard = document.createElement("div");
    letterCard.textContent = letter;
    letterCard.classList.add("alphabet-card");

    // Add click event to play the corresponding audio
    letterCard.addEventListener("click", () => {
        const audio = new Audio(`../audio/alphasounds-${letter}.mp3`); // Construct the file path
        audio.play(); // Play the audio
    });

    alphabetGrid.appendChild(letterCard);
});

// Add event listeners to flip cards
document.querySelectorAll('.flip-card-inner').forEach((card) => {
    card.addEventListener('click', () => {
        // Flip the card
        card.classList.toggle('flipped');

        // Show the "+5 Coins" label
        const coinLabel = document.getElementById('coin-label');
        coinLabel.classList.remove('hidden');
        setTimeout(() => {
            coinLabel.classList.add('hidden');
        }, 2000);

        // Add +5 coins logic here (to be implemented by you)
    });
});