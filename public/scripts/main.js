var socket = io();
var formChat = document.getElementById('form_chat');
var input = document.getElementById('chat');
var messageUser = document.getElementById("messages");
// name
const status = document.querySelector(".status");
const inputName = document.querySelector("#input-name");
const btnName = document.querySelector("#btn-name")
const formName = document.getElementById("form_name");
const profileUserContainer = document.getElementById("profile_user");
const profileUserMobileContainer = document.getElementById("profile_mobile_user");
const chatPage = document.getElementById("chat_page");
const homePage = document.getElementById("home_page");


let nameUser = "";
let typing = false;
let connected = false;

// Preview Profile Picture 
const preview = document.getElementById("preview-profile");
document.getElementById("profile").addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    localStorage.setItem("src", reader.result)
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
    socket.emit('add_user', nameUser);
    socket.emit('login', nameUser);

    localStorage.setItem("name", nameUser)
    profileUser()
  }
});

if(localStorage.getItem("name")) {
  chatPage.classList.remove("hidden");
  homePage.classList.add("hidden");
  profileUser();
} else {
  chatPage.classList.add("hidden");
  homePage.classList.remove("hidden");
}

function profileUser() {
  const profileData = {
    image: localStorage.getItem("src"),
    name: localStorage.getItem("name")
  }
  const userProfileUI =  `
    <div class="flex items-center">
      <img src="${profileData.image}" class="rounded-full w-10 h-10 mr-2 border border-teal-500" alt="logo">&nbsp;
      <div class="flex flex-col space-y-[-0.1rem] ">
        <p class="self-center whitespace-nowrap  font-medium  inline-block whitespace-pre-line">${profileData.name} </p>
        <span class="text-xs text-slate-800">User</span>
      </div>
    </div>
    <button class="hover:bg-slate-100 p-2 rounded-md signout_btn" title="sign out">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#dc2626" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
      </svg>
    </button>
  ` 

  const userProfileMobileUI = `
    <div class="hover:bg-glass-2 flex items-center px-3 py-1.5 rounded-md sm:hidden">
    <h1 class=" hover:cursor-default font-medium" id="profile-name">hello &nbsp;</h1>
    <img type="button" class="w-8 h-8 rounded-full cursor-pointer"
      src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" data-dropdown-toggle="userDropdown"
      data-dropdown-placement="bottom-start" id="profile-img">
    </div>
    <div id="userDropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow ">
      <ul class="py-1 text-sm text-gray-700 " aria-labelledby="multiLevelDropdownButton">
        <li >
          <a href="#" class="block py-2 px-4 hover:bg-gray-100 flex items-center justify-between"><span>Sign out</span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#dc2626" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
            <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg> </a>
        </li>
      </ul>
    </div>
  `
  
  profileUserContainer.innerHTML = userProfileUI;
  profileUserMobileContainer.innerHTML = userProfileMobileUI

  function signOut() {
    console.log("click")
    localStorage.clear();
    window.location.reload()
  }

  const signOutBtn = profileUserContainer.querySelector(".signout_btn");
  signOutBtn.addEventListener("click", () => {
  })
}


formChat.addEventListener('submit', function (e) {
  e.preventDefault();
  let time = new Date()
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
      id: socket.id
    }

    socket.emit('message', data);
    var chatList = document.createElement('li');
    chatList.classList.add("world")
    chatList.innerHTML = `
      <div class="flex items-center " data-id="${data.id}">
        <img src="${data.image}" class="w-12 h-12 mr-3 rounded-full"> <div>
          <div class="flex items-center ">
            <p class="text-lg font-medium">${data.name}</p>&nbsp;
            <span class="text-gray-900">${data.hour}:${data.minutes}</span>
            &nbsp;
            <span>${data.info_time}</span>
          </div>
          <p class="bg-teal-500 text-white rounded-br-3xl rounded-tr-3xl rounded-bl-xl p-2">${data.message}</p>
        </div> 
      <div>
    `;
    messageUser.appendChild(chatList);


    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }

  // Private Script
});

socket.on("message", (name, message, image, hour, minutes, info_time, id) => {
  let broadcast = document.createElement("li");
  broadcast.classList.add("world");
  broadcast.innerHTML = `
  <div class="flex items-center" data-id="${id}">
    <img src="${image}" class="w-12 h-12 mr-3 rounded-full"> <div>
      <div class="flex items-center ">
        <p class="text-lg font-medium">${name}</p>&nbsp;
        <span class="text-gray-900">${hour}:${minutes}</span>
        &nbsp;
        <span>${info_time}</span>
      </div>
      <p class="bg-slate-200  rounded-br-3xl rounded-tr-3xl rounded-bl-xl p-2">${message}</p>
    </div> 
  <div>
  `;

  messageUser.appendChild(broadcast);
  window.scrollTo(0, document.body.scrollHeight);
  // Private Script
})

socket.on('connect', () => {
  let statusP = document.createElement("p");
  statusP.textContent = "user connected";

  const container = document.querySelector(".status");
  container.appendChild(statusP); 
  
}); 

socket.on('add_user', (username) => {
  const joinP = document.createElement('p');
  joinP.innerHTML = `${username.name} joined the server`;
  const contJoinUser = document.querySelector(".join_user");
  console.log(contJoinUser);
  contJoinUser.appendChild(joinP);
});

// const saveData = JSON.parse(localStorage.getItem("data_result")) || [];
// function addData(name, message, image, hour,minutes,info_time,id) {
//   saveData.push({
//     name,
//     message,
//   })
// } 