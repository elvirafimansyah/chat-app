var socket = io();
var formChat = document.getElementById('form_chat');
var input = document.getElementById('chat');
var messageUser = document.getElementById("messages");

const status = document.querySelector(".status");
const inputName = document.querySelector("#input-name");
const formName = document.getElementById("form_name");
const profileUserContainer = document.getElementById("profile_user");
const chatPage = document.getElementById("chat_page");
const homePage = document.getElementById("home_page");
const alertCopy = document.getElementById("toast-success");
const inputRoom = document.getElementById

let saveUser = JSON.parse(localStorage.getItem("data_user")) || [];
let saveUserBroadcast = JSON.parse(localStorage.getItem("user_broadcast")) || [];
let allUser = JSON.parse(localStorage.getItem("all_user")) || [];
let nameUser = "";
let typing = false;
let connected = false;

// Preview Profile Picture 
const preview = document.getElementById("preview-profile");
document.getElementById("profile").addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    localStorage.setItem("src", reader.result);
    preview.src = reader.result;
  })
  reader.readAsDataURL(this.files[0])
})

formName.addEventListener("submit", (e) => {
  e.preventDefault()
  if (inputName.value !== "" & inputName.value.length <= 17) {
    chatPage.classList.remove("hidden");
    homePage.classList.add("hidden");
    
    nameUser = inputName.value.trim();
    socket.emit('add_user', nameUser, localStorage.getItem("src"));
    socket.emit('login', nameUser);
    socket.emit("sendNickname", nameUser, localStorage.getItem("src"))

    localStorage.setItem("name", nameUser)
    localStorage.setItem("id", socket.id);
    profileUser()
  }
});

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alertCopy.classList.remove("hidden");
    
    setTimeout(() => {
      alertCopy.classList.toggle('hidden');
    }, 2500);
  })
}

function profileUser() {
  const profileData = {
    image: localStorage.getItem("src"),
    name: localStorage.getItem("name"),
    id: localStorage.getItem("id")
  }
  const userProfileUI =  `
    <div class="flex items-center">
      <img src="${profileData.image}" class="rounded-full w-10 h-10 mr-2 border border-teal-500" alt="logo">&nbsp;
      <div>
        <p class="self-center whitespace-nowrap text-lg font-medium  inline-block whitespace-pre-line">${profileData.name} </p>
        <p class="text-xs text-slate-800 id_text hover:cursor-pointer break-all" title="id">${profileData.id}</p>
      </div>
    </div>
    <button class="hover:bg-slate-100 p-2 rounded-md signout_btn" title="sign out" >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#dc2626" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
      </svg>
    </button>
  ` 
  profileUserContainer.innerHTML = userProfileUI;

  // Mobile User Profile Function
  const profileID = document.querySelector("#profile_id");
  function mobileUserProfile(name, image, id) {
    name.innerHTML = profileData.name;
    image.src = profileData.image;
    id.innerHTML = profileData.id;
  }
  mobileUserProfile(document.querySelector("#profile_name"), document.querySelector("#profile_img"), profileID)

  // SignOut User function
  const signOutBtn = profileUserContainer.querySelector(".signout_btn");
  const signOutBtnMobile = document.querySelector(".signout_mobile_btn");

  function signOut() {
    console.log("click")
    localStorage.clear();
    window.location.reload()
  }

  signOutBtn.addEventListener("click", () => {
    signOut()
  })
  signOutBtnMobile.addEventListener("click", () => {
    signOut()
  });
  
  // Copy Function
  const idText = profileUserContainer.querySelector(".id_text");
  idText.addEventListener("click", () => {
    copyText(idText.innerText);
    
  });
  profileID.addEventListener("click", () => {
    copyText(profileID.innerText);
  })
}

function saveProfile() {
  if (localStorage.getItem("name")) {
    chatPage.classList.remove("hidden");
    homePage.classList.add("hidden");
    socket.emit("sendNickname", localStorage.getItem("name"))
    profileUser();
  } else if(!localStorage.getItem("src")) {
    localStorage.setItem("src", "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png")
  }  else {
    chatPage.classList.add("hidden");
    homePage.classList.remove("hidden");
  }
}

formChat.addEventListener('submit', function (e) {
  e.preventDefault();
  let time = new Date();
  if (input.value) {
    let timeStatus = ""

    if (time.getHours() > 12) {
      timeStatus = "PM"
    } else {
      timeStatus = "AM"
    }

    let data = {
      name: localStorage.getItem("name"),
      message: input.value,
      image: localStorage.getItem("src"),
      hour: time.getHours(),
      minutes: time.getMinutes(),
      info_time: timeStatus,
      id: localStorage.getItem("id")
    }

    // local data
    saveUser.push(data);
    localStorage.setItem("data_user", JSON.stringify(saveUser));

    // global data
    allUser.push(data)
    localStorage.setItem("all_user", JSON.stringify(allUser))

    
    socket.emit("message", data)
    saveAllMessage();
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }
});

socket.on("message", (name, message, image, hour, minutes, info_time, id) => {
  let broadcast_data = {
    name: name,
    message: message,
    image: image,
    hour: hour,
    minutes: minutes,
    info_time: info_time,
    id: id,
  }

  // local data broadcast
  saveUserBroadcast.push(broadcast_data);
  localStorage.setItem("user_broadcast", JSON.stringify(saveUserBroadcast));
  
  // global data
  allUser.push(broadcast_data);
  localStorage.setItem("all_user", JSON.stringify(allUser))

  
  // let broadcast = document.createElement("li");
  // broadcast.classList.add("world");
  // broadcast.innerHTML = `
  // <div class="flex items-center" data-id="${id}">
  //   <img src="${image}" class="w-12 h-12 mr-3 rounded-full"> <div>
  //     <div class="flex items-center ">
  //       <p class="text-lg font-medium">${name}</p>&nbsp;
  //       <span class="text-gray-900">${hour}:${minutes}</span>
  //       &nbsp;
  //       <span>${info_time}</span>
  //     </div>
  //     <p class="bg-slate-200  rounded-br-3xl rounded-tr-3xl rounded-bl-xl p-2">${message}</p>
  //   </div> 
  // <div>
  // `;

  saveAllMessage()
  popUpSounds("chat", "wav")

  window.scrollTo(0, document.body.scrollHeight);
})


function saveAllMessage() {
  messageUser.innerHTML = ""
  allUser.forEach(data => {
    let allMessage = document.createElement("li");
    allMessage.classList.add("chat_list");
    allMessage.innerHTML = `
      <div class="flex items-center" data-id="${data.id}">
        <img src="${data.image}" class="w-12 h-12 mr-3 rounded-full"> <div>
          <div class="flex items-center ">
            <p class="text-lg font-medium">${data.name}</p>&nbsp;
            <span class="text-gray-900">${data.hour}:${data.minutes}</span>
            &nbsp;
            <span>${data.info_time}</span>
          </div>
          <p class="bg-slate-200  rounded-br-3xl rounded-tr-3xl rounded-bl-xl p-2">${data.message}</p>
        </div> 
      <div>
      `;

    messageUser.appendChild(allMessage);
  })
  window.scrollTo(0, document.body.scrollHeight);
}

function popUpSounds(song , type) {
  const audio = new Audio(`./sounds/${song}.${type}`);
  audio.play()
}

function userJoinLeftUI(username, image, type) {
  const containerUser = document.getElementById("alert_notif_user");
  containerUser.classList.remove("hidden");

  const notifContainer = document.getElementById("user_notifcation");
  if(type) {
    notifContainer.innerHTML = `
      <div class="inline-block relative shrink-0">
        <img class="w-12 h-12 rounded-full" src="${image}" alt="${username} image" />
      </div>
      <div class="ml-3 text-sm font-normal">
        <div class="text-sm font-semibold text-gray-900 ">${username}</div>
        <div class="text-sm font-normal">joined the room</div>
        <span class="text-xs font-medium text-teal-600 ">just now</span>
      </div>
    `
  } else {
    notifContainer.innerHTML = `
      <div class="inline-block relative shrink-0">
        <img class="w-12 h-12 rounded-full" src="${image}" alt="${username} image" />
      </div>
      <div class="ml-3 text-sm font-normal">
        <div class="text-sm font-semibold text-gray-900 ">${username}</div>
        <div class="text-sm font-normal"> left the room</div>
        <span class="text-xs font-medium text-teal-600 ">just now</span>
      </div>
    `
  }

  popUpSounds("notif", "wav")

  setTimeout(() => {
    containerUser.classList.add("hidden"); 
  }, 4000);
};

document.addEventListener("DOMContentLoaded", () => {
  saveProfile()
  if(localStorage.getItem("data_user") || localStorage.getItem("user_broadcast")) {
    saveAllMessage()
    window.scrollTo(0, document.body.scrollHeight);
  } 
})


const contJoinUser = document.querySelector(".status_user");
socket.on('add_user', (data) => {
  userJoinLeftUI(data.name, data.image, true);
});

socket.on("userLeft", (data) => {
  if(data.name !== undefined ) {
    if(data.image !== undefined) {
      userJoinLeftUI(data.name, data.image, false);
    } else {
      userJoinLeftUI(data.name, "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png", false)
    }
  }
})