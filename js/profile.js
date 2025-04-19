/* helpers ------------------------------------------------*/
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* -------- confirmation dialog helper (replaces toast) -------- */
function confirmBox(message){
  const ov = document.createElement("div");
  ov.className = "dialog‑overlay";
  ov.innerHTML = `
      <div class="dialog">
        ${message}
        <br><button id="dlgOK">OK</button>
      </div>`;
  document.body.appendChild(ov);
  $("#dlgOK").onclick = ()=>ov.remove();
}

/* -- live avatar preview in both modals ------------------------ */
["#avatar", "#newAvatar"].forEach(sel=>{
  $(sel).addEventListener("change", e=>{
    if(e.target.files[0]){
      const r = new FileReader();
      r.onload = ev=>{
        const img = sel==="#avatar" ? $("#avatar-preview") : $("#newAvatarPreview");
        img.src = ev.target.result;
        img.classList.remove("hidden");
      };
      r.readAsDataURL(e.target.files[0]);
    }
  });
});


/* --------------- get current user ----------------------*/
const currentSession = JSON.parse(sessionStorage.getItem("user") || "null");
if(!currentSession) window.location.href = "index.html";

const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
const idx   = users.findIndex(u=>u.email===currentSession.email);
if(idx===-1) console.error("No matching account");

/* --------------- page init -----------------------------*/
window.addEventListener("load", populateCard);

function populateCard(){
  const u = users[idx];
  $("#nicknameText").textContent = `Nickname: ${u.nickname}`;
  $("#bioText").textContent      = `Email: ${u.email}`;
  $("#currentBiography").textContent = u.description || "Click Edit Profile to add a bio.";
  $("#avatarDisplay").src        = u.avatar || "../images/avatar.png";

  if(!u.description && !u.avatar) openCreateCard();
}

/* =======================================================
   EDIT PROFILE (unchanged + success toast)
   =======================================================*/
function openEditCard(){
  $("#edit-modal").classList.remove("hidden");
  $("#nickname").value     = users[idx].nickname;
  $("#description").value  = users[idx].description || "";
  $("#avatar-preview").src = users[idx].avatar      || "";
}
function closeEditCard(){ $("#edit-modal").classList.add("hidden"); }

function saveChanges(){
  const nickname    = $("#nickname").value.trim();
  const description = $("#description").value.trim();
  const avatarFile  = $("#avatar").files[0];

  if(nickname)    users[idx].nickname    = nickname;
  if(description) users[idx].description = description;

  const commit = ()=>{
    syncStores(); populateCard(); closeEditCard();
    confirmBox("✅ Profile successfully updated.");
  };

  if(avatarFile){
    const r = new FileReader();
    r.onload = e=>{ users[idx].avatar=e.target.result; commit(); };
    r.readAsDataURL(avatarFile);
  }else commit();
}

/* =======================================================
   CREATE PROFILE  (validation + success toast)
   =======================================================*/
function openCreateCard(){ $("#create-modal").classList.remove("hidden"); }
function closeCreateCard(){ $("#create-modal").classList.add("hidden"); }

function saveNewProfile(){
  clearErrors();

  const descVal   = $("#newDescription").value.trim();
  const avatarSel = $("#newAvatar").files[0];
  let   valid     = true;

  if(descVal===""){
    showError("#newDescription","#descErr");
    valid = false;
  }
  if(!avatarSel){
    showError("#newAvatar","#avatarErr");
    valid = false;
  }
  if(!valid) return;      // stop – let user fix inputs

  fileToDataURL(avatarSel, url=>{
    users[idx].description = descVal;
    users[idx].avatar      = url;
    syncStores(); populateCard(); closeCreateCard();
    confirmBox("🎉 Profile successfully created!");
  });
}

/* ---------------- helpers ------------------------------*/
function showError(inputSel, errSel){
  $(inputSel).classList.add("error");
  $(errSel).style.display = "block";
}
function clearErrors(){
  $$(".error-msg").forEach(e=>e.style.display="none");
  $$("input.error").forEach(i=>i.classList.remove("error"));
}
function fileToDataURL(file, cb){
  const r = new FileReader();
  r.onload = e=>cb(e.target.result);
  r.readAsDataURL(file);
}
function syncStores(){
  localStorage.setItem("registeredUsers", JSON.stringify(users));
  sessionStorage.setItem("user", JSON.stringify({
    ...currentSession,
    nickname:    users[idx].nickname,
    description: users[idx].description,
    avatar:      users[idx].avatar
  }));
  
}
