// this updates the coins in the header
// for all pages
function updateCoinsDisplay() {

    const user = JSON.parse(sessionStorage.getItem('user'));

    // Update the coins display if user data exists
    if (user && user.coins !== undefined) {
        const coinsLabel = document.getElementById('coins');
        coinsLabel.textContent = `Coins: ${user.coins}`;
    } else {
        console.error('User data not found in sessionStorage.');
    }
}


updateCoinsDisplay();