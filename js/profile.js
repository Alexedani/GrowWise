const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* quick modal‑style confirm box */
function confirmBox(msg) {
  const ov = document.createElement("div");
  ov.className = "dialog‑overlay";
  ov.innerHTML = `<div class="dialog">${msg}<br><button id="dlgOK">OK</button></div>`;
  document.body.appendChild(ov);
  $("#dlgOK").onclick = () => ov.remove();
}

["#avatar", "#newAvatar"].forEach(sel => {
  const input = $(sel);
  if (!input) return;
  input.addEventListener("change", e => {
    if (e.target.files[0]) {
      const r = new FileReader();
      r.onload = ev => {
        const img = sel === "#avatar" ? $("#avatar-preview") : $("#newAvatarPreview");
        img.src = ev.target.result;
        img.classList.remove("hidden");
      };
      r.readAsDataURL(e.target.files[0]);
    }
  });
});

const currSession = JSON.parse(sessionStorage.getItem("user") || "null");
if (!currSession) window.location.href = "index.html";

const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
const idx   = users.findIndex(u => u.email === currSession.email);
if (idx === -1) console.error("No matching account found");

/* show avatar in *both* places */
function renderAvatars(url) {
  const fallback = "../images/avatar.png";
  $("#avatarDisplay").src = url || fallback;          // profile card
  const header = $("#headerAvatar");
  if (header) header.src = url || fallback;           // fixed header
}

window.addEventListener("load", populateCard);

function populateCard() {
  const u = users[idx];
  $("#nicknameText").textContent     = `Nickname: ${u.nickname}`;
  $("#bioText").textContent          = `Email: ${u.email}`;
  $("#currentBiography").textContent = u.description || "Click Edit Profile to add a bio.";
  renderAvatars(u.avatar);

  // for new user ⇒ open “Create profile” modal
  if (!u.description && !u.avatar) openCreateCard();
}

// eidt profile modal
function openEditCard() {
  $("#edit-modal").classList.remove("hidden");
  $("#nickname").value = users[idx].nickname;
  $("#description").value = users[idx].description || "";

  // Populate owned icons (including starter icons)
  const ownedIconsContainer = $("#ownedIcons");
  ownedIconsContainer.innerHTML = ""; // Clear previous icons
  const ownedIcons = users[idx].ownedIcons || [];
  const starterIcons = [
    "../images/startericons/happy.png",
    "../images/startericons/sleeping.png",
    "../images/startericons/hungry.png",
    "../images/startericons/laughing.png",
    "../images/startericons/smirk.png",
    "../images/startericons/goofy.png",
    "../images/startericons/angry.png",
    "../images/startericons/thankful.png",
    "../images/startericons/tired.png"
  ];

  [...ownedIcons, ...starterIcons].forEach(iconPath => {
    const img = document.createElement("img");
    img.src = iconPath;
    img.alt = "Owned Icon";
    img.className = "owned-icon";
    img.onclick = () => selectOwnedIcon(img);
    ownedIconsContainer.appendChild(img);
  });

  // Pre-select the current avatar
  const currentAvatar = users[idx].avatar;
  if (currentAvatar) {
    const currentIcon = Array.from(ownedIconsContainer.children).find(img => img.src === currentAvatar);
    if (currentIcon) currentIcon.classList.add("selected");
    $("#editAvatarPreview").src = currentAvatar;
    $("#editAvatarPreview").classList.remove("hidden");
  }
}

function closeEditCard() { $("#edit-modal").classList.add("hidden"); }

function selectOwnedIcon(icon) {
  // Highlight the selected icon and update the preview
  document.querySelectorAll(".owned-icon").forEach(img => img.classList.remove("selected"));
  icon.classList.add("selected");
  const preview = $("#editAvatarPreview");
  preview.src = icon.src;
  preview.classList.remove("hidden");
}

function saveChanges() {
  const nickname = $("#nickname").value.trim();
  const description = $("#description").value.trim();
  const selectedIcon = document.querySelector(".owned-icon.selected");

  if (!selectedIcon) {
    showError("#ownedIcons", "#editAvatarErr");
    return;
  }

  if (nickname) users[idx].nickname = nickname;
  if (description) users[idx].description = description;
  users[idx].avatar = selectedIcon.src;

  syncStores();
  populateCard();
  closeEditCard();
  confirmBox("✅ Profile successfully updated.");
}

/*  CREATE PROFILE (first‑time)  */
function openCreateCard()  { $("#create-modal").classList.remove("hidden"); }
function closeCreateCard() { $("#create-modal").classList.add("hidden"); }

function saveNewProfile() {
  clearErrors();

  const descVal = $("#newDescription").value.trim();
  const selectedIcon = document.querySelector(".starter-icon.selected");
  let ok = true;

  if (descVal === "") {
    showError("#newDescription", "#descErr");
    ok = false;
  }
  if (!selectedIcon) {
    showError("#starterIcons", "#avatarErr");
    ok = false;
  }
  if (!ok) return;

  const avatarUrl = selectedIcon.src;
  users[idx].description = descVal;
  users[idx].avatar = avatarUrl;
  syncStores();
  renderAvatars(avatarUrl);
  closeCreateCard();
  confirmBox("🎉 Profile successfully created!");
}

function selectStarterIcon(icon) {
  // Highlight the selected icon and store its source
  document.querySelectorAll('.starter-icon').forEach(img => img.classList.remove('selected'));
  icon.classList.add('selected');
  const preview = document.getElementById('newAvatarPreview');
  if (preview) preview.src = icon.src;
}

function showError(inputSel, errSel) {
  $(inputSel).classList.add("error");
  $(errSel).style.display = "block";
}
function clearErrors() {
  $$(".error-msg").forEach(e => e.style.display = "none");
  $$("input.error").forEach(i => i.classList.remove("error"));
}
function fileToDataURL(file, cb) {
  const r = new FileReader();
  r.onload = e => cb(e.target.result);
  r.readAsDataURL(file);
}
function syncStores() {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
  sessionStorage.setItem("user", JSON.stringify({
    email:       users[idx].email,
    nickname:    users[idx].nickname,
    description: users[idx].description,
    avatar:      users[idx].avatar
  }));
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Edit Profile modal
    initializeEditProfileModal();
});

function initializeEditProfileModal() {
    const ownedIconsContainer = document.getElementById('ownedIcons');
    if (!ownedIconsContainer) {
        console.error("Owned icons container not found.");
        return;
    }

    // Add event listeners to all hardcoded avatar options
    const avatarIcons = ownedIconsContainer.querySelectorAll('.starter-icon');
    avatarIcons.forEach(icon => {
        icon.addEventListener('click', () => selectStarterIcon(icon));
    });
}
