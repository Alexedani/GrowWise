function updateCoinsDisplay() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.coins !== undefined) {
        // Update header coins display
        const coinsLabel = document.getElementById('coins');
        if (coinsLabel) {
            coinsLabel.textContent = `Coins: ${user.coins}`;
        }
        // Update coins in the statistics section if it exists
        const statsCoins = document.getElementById('stats-coins');
        if (statsCoins) {
            statsCoins.textContent = user.coins;
        }
    } else {
        console.error('User data not found in sessionStorage.');
    }
}

// Wait for the DOM to be fully loaded before updating
document.addEventListener("DOMContentLoaded", updateCoinsDisplay);
