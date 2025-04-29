// Populate the alphabet grid
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const alphabetGrid = document.getElementById("alphabet-grid");

alphabet.forEach((letter) => {
    const letterCard = document.createElement("div");
    letterCard.textContent = letter;
    letterCard.classList.add("alphabet-card");

    // Add click event to play the corresponding audio
    letterCard.addEventListener("click", () => {
        const audio = new Audio(`../audio/${letter}.mp3`); // Construct the file path
        audio.play(); // Play the audio
    });

    alphabetGrid.appendChild(letterCard);
});

// Add event listeners to flip cards
document.querySelectorAll('.flip-card-inner').forEach((card) => {
    let flipped = false; // Track if the card has been flipped

    card.addEventListener('click', () => {
        // Flip the card
        card.classList.toggle('flipped');

        // Show "+5 Coins" only if the card is flipped for the first time
        if (!flipped) {
            flipped = true; // Mark the card as flipped
            const coinLabel = document.getElementById('coin-label');
            coinLabel.classList.remove('hidden');
            setTimeout(() => {
                coinLabel.classList.add('hidden');
            }, 2000);

            // Add +5 coins logic here (to be implemented by you)
        }
    });
});