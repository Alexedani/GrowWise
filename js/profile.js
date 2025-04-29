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
  $("#nickname").value     = users[idx].nickname;
  $("#description").value  = users[idx].description || "";
  $("#avatar-preview").src = users[idx].avatar      || "";
}
function closeEditCard() { $("#edit-modal").classList.add("hidden"); }

function saveChanges() {
  const nickname    = $("#nickname").value.trim();
  const description = $("#description").value.trim();
  const avatarFile  = $("#avatar").files[0];

  if (nickname)    users[idx].nickname    = nickname;
  if (description) users[idx].description = description;

  const commit = () => {
    syncStores();
    populateCard();   
    // renderAvatars(users[idx].avatar);
    closeEditCard();
    confirmBox("✅ Profile successfully updated.");
  };

  if (avatarFile) {
    const r = new FileReader();
    r.onload = e => { users[idx].avatar = e.target.result; commit(); };
    r.readAsDataURL(avatarFile);
  } else {
    commit();
  }
}

/*  CREATE PROFILE (first‑time)  */
function openCreateCard()  { $("#create-modal").classList.remove("hidden"); }
function closeCreateCard() { $("#create-modal").classList.add("hidden"); }

function saveNewProfile() {
  clearErrors();

  const descVal   = $("#newDescription").value.trim();
  const avatarSel = $("#newAvatar").files[0];
  let   ok        = true;

  if (descVal === "")  { showError("#newDescription", "#descErr");  ok = false; }
  if (!avatarSel)      { showError("#newAvatar",     "#avatarErr"); ok = false; }
  if (!ok) return;

  fileToDataURL(avatarSel, url => {
    users[idx].description = descVal;
    users[idx].avatar      = url;
    syncStores();
    renderAvatars(url);
    closeCreateCard();
    confirmBox("🎉 Profile successfully created!");
  });
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
