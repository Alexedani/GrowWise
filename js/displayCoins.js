const userVariable = sessionStorage.getItem('user');
const userData = JSON.parse(userVariable);
const coinDisplay = document.getElementById('coins');
coinDisplay.innerText = `Coins: ${userData.coins}`;

