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

let nameUser = "";
let typing = false;
let connected = false;

formName.addEventListener("submit", (e) => {
  e.preventDefault()
  if (inputName.value !== "" & inputName.value.length <= 17) {
    const chatPage = document.getElementById("chat_page");
    const homePage = document.getElementById("home_page");
    chatPage.classList.remove("hidden");
    homePage.classList.add("hidden");
    
    nameUser = inputName.value.trim();
    socket.emit('add_user', nameUser);
  }
});

function profileUser(data) {
  const userProfileUI =  `
    <img src="${data.image}" class="rounded-full w-10 h-10 mr-2 border border-teal-500" alt="logo">&nbsp;
    <div class="flex flex-col space-y-[-0.1rem] ">
      <p class="self-center whitespace-nowrap  font-medium  inline-block whitespace-pre-line">${data.name} </p>
      <span class="text-xs text-slate-800">User</span>
    </div>
  `

  profileUserContainer.innerHTML = userProfileUI;
}

const preview = document.getElementById("preview-profile");

document.getElementById("profile").addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    preview.src = reader.result;
  })
  reader.readAsDataURL(this.files[0])
})

let time = new Date()

formChat.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    let timeStatus = ""

    if (time.getHours() > 12) {
      timeStatus = "PM"
    } else {
      timeStatus = "AM"
    }

    let data = {
      name: nameUser,
      message: input.value,
      image: `${preview.src}`,
      hour: time.getHours(),
      minutes: time.getMinutes(),
      info_time: timeStatus
    }

    socket.emit('message', data);
    var chatList = document.createElement('li');
    chatList.innerHTML = `
      <div class="flex items-center ">
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

    profileUser(data)
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }

  // Private Script
});

socket.on("message", (name, message, image, hour, minutes, info_time) => {
  let broadcast = document.createElement("li");
  broadcast.innerHTML = `
  <div class="flex items-center ">
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


  // Private Script
}); 

socket.on('add_user', (username) => {
  const joinP = document.createElement('p');
  joinP.innerHTML = `${username.name} joined the server`;
  const contJoinUser = document.querySelector(".join_user");
  console.log(contJoinUser);
  contJoinUser.appendChild(joinP);
});

// Sidebar
var sideBar = document.getElementById("mobile-nav");
var openSidebar = document.getElementById("openSideBar");
var closeSidebar = document.getElementById("closeSideBar");
sideBar.style.transform = "translateX(-260px)";

function sidebarHandler(flag) {
  if (flag) {
    sideBar.style.transform = "translateX(0px)";
    openSidebar.classList.add("hidden");
    closeSidebar.classList.remove("hidden");
  } else {
    sideBar.style.transform = "translateX(-260px)";
    closeSidebar.classList.add("hidden");
    openSidebar.classList.remove("hidden");
  }
}