var socket = io();
var formChat = document.getElementById('form_chat');
var input = document.getElementById('chat');
var messageUser = document.getElementById("messages");
// name
const status = document.querySelector(".status");
const inputName = document.querySelector("#input-name");
const btnName = document.querySelector("#btn-name")
const formName = document.getElementById("form_name")

let nameUser = "";
let typing = false;
let connected = false;

formName.addEventListener("submit", (e) => {
  e.preventDefault()
  if (inputName.value !== "") {
    const chatPage = document.getElementById("chat_page");
    const homePage = document.getElementById("home_page");
    chatPage.classList.remove("hidden");
    homePage.classList.add("hidden");

    nameUser = inputName.value;
  }
});

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
    socket.emit('add_user', data.name);
    var item = document.createElement('li');
    item.innerHTML = `
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
    messageUser.appendChild(item);
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

  const container = document.querySelector(".name");
  container.appendChild(statusP);


  // Private Script
}); 

socket.on('add_user', () => {
  const joinP = document.createElement('p');
  joinP.innerHTML = `${data.name} joined the server`;
});