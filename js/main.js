/*  main.js – runs on *every* page that shows the fixed header bar  */
document.addEventListener("DOMContentLoaded", () => {

    const sessionUser = JSON.parse(sessionStorage.getItem("user") || "null");
    if (sessionUser && sessionUser.avatar) {
      const headerImg = document.getElementById("headerAvatar");
      if (headerImg) headerImg.src = sessionUser.avatar;
    }
  
    /* settings dropdown + audio toggle  */
    const settingsBtn      = document.getElementById("settings-btn");
    const settingsDropdown = document.getElementById("settings-dropdown");
    const audioIcon        = document.getElementById("audio-icon");
    const audioStatus      = document.getElementById("audio-status");
    const logoutBtn        = document.getElementById("logout-btn");
  
    /* dropdown open/close */
    if (settingsBtn && settingsDropdown) {
      settingsBtn.addEventListener("click", e => {
        e.preventDefault();
        settingsDropdown.classList.toggle("show");
      });
      document.addEventListener("click", e => {
        if (!settingsBtn.contains(e.target) &&
            !settingsDropdown.contains(e.target)) {
          settingsDropdown.classList.remove("show");
        }
      });
    }
  
    /* audio on/off */
    let audioOn = false;
    const toggleAudio = () => {
      audioOn = !audioOn;
      audioIcon.src         = audioOn ? "../images/audio_on.png"
                                      : "../images/audio_off.png";
      audioStatus.textContent = audioOn ? "Audio On" : "Audio Off";
    };
    if (audioIcon && audioStatus) {
      audioIcon.addEventListener("click", toggleAudio);
      audioStatus.addEventListener("click", toggleAudio);
    }
  
    /* logout */
    const logoutUser = () => {
      sessionStorage.removeItem("user");
      window.location.href = "index.html";
    };
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  
  });
  