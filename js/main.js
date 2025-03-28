document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded!"); // Debugging

    const settingsBtn = document.getElementById("settings-btn");
    const settingsDropdown = document.getElementById("settings-dropdown");
    const audioIcon = document.getElementById("audio-icon");
    const audioStatus = document.getElementById("audio-status");

    if (!settingsBtn || !settingsDropdown || !audioIcon || !audioStatus) {
        console.error("Settings button or dropdown or audio elements not found!");
        return;
    }

    console.log("Settings button and dropdown found!"); // Debugging

    // Toggle settings dropdown
    settingsBtn.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Settings button clicked!"); // Debugging
        settingsDropdown.classList.toggle("show");
    });

    // Toggle audio on/off when either icon or text is clicked
    let isAudioOn = false; // Initially, audio is off

    function toggleAudio() {
        isAudioOn = !isAudioOn; // Toggle audio state
        if (isAudioOn) {
            audioIcon.src = "../images/audio_on.png"; // Change to audio-on image
            audioStatus.textContent = "Audio On"; // Update status text
        } else {
            audioIcon.src = "../images/audio_off.png"; // Change to audio-off image
            audioStatus.textContent = "Audio Off"; // Update status text
        }
    }

    // Add event listeners for both icon and text
    audioIcon.addEventListener("click", toggleAudio); 
    audioStatus.addEventListener("click", toggleAudio); 
    // Close the settings dropdown when clicking anywhere outside the dropdown or settings button
    document.addEventListener("click", function (event) {
        // If the clicked target is not the settings button or inside the dropdown
        if (!settingsBtn.contains(event.target) && !settingsDropdown.contains(event.target)) {
            settingsDropdown.classList.remove("show");
        }
    });
    
});
