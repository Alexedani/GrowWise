// Example items in the shop
const shopItems = {
    hint: {
        name: "Hint",
        cost: 100,
        description: "Use this hint to help answer a quiz question.",
        image: "../images/question-mark-box.png"
    },
    icon1: {
        name: "Avacado",
        cost: 200,
        description: "A stylish avacado icon to customize your profile with",
        image: "../images/avacadoIcon.jpg"
    },
    icon2: {
        name: "Crown",
        cost: 200,
        description: "A sleek crown icon to enhance your avatar.",
        image: "../images/crown.png"
    },
    icon3: {
        name: "Butterfly",
        cost: 200,
        description: "A vibrant butterfly icon to make your avatar stand out.",
        image: "../images/butterfly.png"
    },
    icon4: {
        name: "Frog",
        cost: 200,
        description: "A Fun Frog icon to make your avatar stand out.",
        image: "../images/frog.png"
    },
    icon5: {
        name: "Dog",
        cost: 200,
        description: "A Dog icon to make your avatar stand out.",
        image: "../images/dog.png"
    }
};

let selectedItem = null;

// Display item details when selected
function selectItem(itemId) {
    const item = shopItems[itemId];
    if (!item) return;

    selectedItem = itemId;
    document.getElementById("itemName").textContent = item.name;
    document.getElementById("itemImage").src = item.image;
    document.getElementById("itemDescription").textContent = item.description;
    document.getElementById("purchaseButton").disabled = false;
}

// Purchase the selected item
function purchaseSelectedItem() {
    if (!selectedItem) {
        console.log("No item selected for purchase.");
        return;
    }

    const item = shopItems[selectedItem];
    const sessionUser = JSON.parse(sessionStorage.getItem("user") || "null");
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    let currentUserEmail = JSON.parse(localStorage.getItem("currentUserEmail"));
    let localUser = registeredUsers.find(user => user.email === currentUserEmail);

    if (!sessionUser || !localUser) {
        alert("User not found. Please log in.");
        console.log("Purchase failed: User not found.");
        return;
    }

    // Ensure ownedItems array is initialized
    if (!Array.isArray(localUser.ownedItems)) {
        localUser.ownedItems = [];
    }

    if (sessionUser.coins >= item.cost) {
        if (selectedItem.startsWith('icon') && localUser.ownedItems.includes(selectedItem)) {
            alert("You already own this profile icon!");
            console.log(`Purchase failed: ${item.name} is already owned.`);
            return;
        }

        // Deduct coins from sessionUser
        sessionUser.coins -= item.cost;
        sessionStorage.setItem("user", JSON.stringify(sessionUser));

        // Update ownedItems in localUser
        if (selectedItem.startsWith('icon')) {
            localUser.ownedItems.push(selectedItem);
            alert(`You purchased ${item.name}!`);
            console.log(`Purchase successful: ${item.name}`);
        } else if (selectedItem === 'hint') {
            localUser.numHints = (localUser.numHints || 0) + 1;
            sessionUser.numHints = (sessionUser.numHints || 0) + 1; // Update sessionStorage
            sessionStorage.setItem("user", JSON.stringify(sessionUser)); // Save updated sessionUser
            alert("You purchased a Hint!");
            console.log("Purchase successful: Hint");
        }

        // Save updated localUser back to localStorage
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        updateCoinDisplay(sessionUser.coins);
    } else {
        alert("Not enough coins!");
        console.log("Purchase failed: Not enough coins.");
    }
}

// Update the coin display
function updateCoinDisplay(coins) {
    const coinLabel = document.getElementById('coins');
    coinLabel.textContent = `Coins: ${coins}`;
}

// Initialize the shop
document.addEventListener('DOMContentLoaded', () => {
    const sessionUser = JSON.parse(sessionStorage.getItem("user") || "null");

    if (sessionUser) {
        // Display coins from sessionStorage
        updateCoinDisplay(sessionUser.coins || 0);
    } else {
        console.log("No user found in sessionStorage.");
    }

    // Attach event listener to the purchase button
    const purchaseButton = document.getElementById("purchaseButton");
    if (purchaseButton) {
        purchaseButton.addEventListener("click", purchaseSelectedItem);
    }

    // Disable the purchase button initially
    if (purchaseButton) {
        purchaseButton.disabled = true;
    }
});
