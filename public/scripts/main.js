var socket = io();
var formChat = document.getElementById('form_chat');
var input = document.getElementById('chat');
var messageUser = document.getElementById("messages");
const inputName = document.querySelector("#input-name");
const formName = document.getElementById("form_name");
const profileUserContainer = document.getElementById("profile_user");
const chatPage = document.getElementById("chat_page");
const homePage = document.getElementById("home_page");
const alertCopy = document.getElementById("toast-success");
const inputRoom = document.getElementById("rooms");
const displayRoom = document.querySelector(".display_room");
const containerCopy = document.getElementById("containerCopy");
const clearChatBtn = document.querySelectorAll("#clear_message")

let allUser = JSON.parse(localStorage.getItem("all_user")) || [];
let nameUser = "";
let roomUser = "";
let typing = false;
let connected = false;
let randomPictureArray = [
  "https://avatars.dicebear.com/api/bottts/.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/a.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/youraa-.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/1.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/j.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/p.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/o.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/r.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/r.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijklopqrstuvwjkl.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijklopqrstuvwjklopqrstuwfwjklm.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rab.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijkl.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijklopqrstuvwjklopqrstuwfwjklmop.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/e.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijklopqrstuvwjklopqrstuwfwjklmopqrstuvw.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabcdefghijklopqrstuvwjklopqr.svg?b=%2314baa6",
  "https://avatars.dicebear.com/api/bottts/rabc.svg?b=%2314baa6"
]
// Device
const windowSize  = window.matchMedia("screen and (min-width: 929px)")
const windowsUser = window.navigator.userAgent.toLowerCase().includes("windows");
const ipaduser = window.navigator.userAgent.toLowerCase().includes("ipad");
const iphoneUser = window.navigator.userAgent.toLowerCase().includes("iphone");
const androidUser = window.navigator.userAgent.toLowerCase().includes("android")

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

// Upload Image Chat
let imageUpload = "";
const uploadBtn = document.getElementById("upload_image");
const fileWrapper = document.getElementById("file_wrapper");
uploadBtn.addEventListener("change", function() {
  fileWrapper.innerHTML = "";
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imageUpload = reader.result;
    fileWrapper.classList.remove("hidden");
    const nameFile = this.files[0].name;
    const flexWrap = document.createElement("div");
    const fileEl = document.createElement("div");
    const infoAlert = document.createElement("div");
    flexWrap.classList.add("md:flex");
    infoAlert.classList.add("sm:w-1/2","md:w-3/12", "lg:w-2/5")
    fileEl.classList.add("bg-white", "rounded-lg", "m-2", "p-2", "w-3/4", "flex", "justify-center", "items-center", "text-center", "md:w-1/2");
    fileEl.innerHTML = `
    <div>
      <img src="${imageUpload}" class="w-60" alt="${nameFile}">
      <p class="font-medium">${nameFile}<p>
    </div>
    `
    infoAlert.innerHTML = `
    <button class="absolute right-2 sm:right-36 md:right-24 lg:right-16 top-5 " id="close_btn"><svg
      xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg"
      viewBox="0 0 16 16">
      <path
        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg></button>
    <div class="p-4 text-sm text-teal-700 bg-teal-100 rounded-lg  ml-2 sm:mt-2 lg:mt-10 " role="alert">
      <span class="font-medium">Note: Don't upload a lot of image files There is a maximum image size that can be uploaded.
    </div>
    `
    fileWrapper.appendChild(flexWrap);

    if(windowSize.matches) {
      flexWrap.appendChild(fileEl)
      flexWrap.appendChild(infoAlert)
    } else {
      console.log("ini di mobile")
      flexWrap.appendChild(infoAlert)
      flexWrap.appendChild(fileEl)
    }
    // Close Btn Function
    const closeBtn = fileWrapper.querySelector("#close_btn");
    closeBtn.addEventListener("click", () => {
      fileWrapper.classList.add("hidden");
    });
  });

  reader.readAsDataURL(this.files[0])
});




formName.addEventListener("submit", (e) => {
  e.preventDefault()
  if (inputName.value !== "" & inputName.value.length <= 17  ) {
    chatPage.classList.remove("hidden");
    homePage.classList.add("hidden");
    
    nameUser = inputName.value.trim();
    socket.emit('login', nameUser);
    socket.emit("sendNickname", nameUser)
    
    localStorage.setItem("name", nameUser)
    localStorage.setItem("id", socket.id);

    socket.emit("join-room", roomUser);
    if (!localStorage.getItem("src")) {
      const randomImage = randomPictureArray[Math.floor(Math.random() * randomPictureArray.length)];
      localStorage.setItem("src", randomImage)
    } 

    socket.emit('add_user', nameUser, localStorage.getItem("src"));
    profileUser()
  } else{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Nickname values must be less than 17',
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Try Again!'
    }).then((result) => {
      if (result.isConfirmed) {
        inputName.focus()
      }
    })
  }
});

function copyText(text) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div id="toast-success"
      class="flex fixed  sm:top-2 sm:right-2 items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow text-gray-800 bg-gray-50 "
      role="alert">
      <div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8  rounded-lg bg-teal-500 text-teal-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
          <path
            d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
          <path
            d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">ID User Copied</div>
      <button type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-gray-100 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5  inline-flex h-8 w-8 "
        data-dismiss-target="#toast-success" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `
  containerCopy.appendChild(div);
  navigator.clipboard.writeText(text).then(() => {
    containerCopy.classList.remove("hidden");
    
    setTimeout(() => {
      containerCopy.classList.toggle('hidden');
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
  }  else {
    chatPage.classList.add("hidden");
    homePage.classList.remove("hidden");
  }
}


formChat.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log("submit")
  let time = new Date();
  // Random Key
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let keyLength = 4;
  let key = ""
  for (let i = 0; i <= keyLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    key += chars.substring(randomNumber, randomNumber + 1);
  }

  let timeStatus = ""

  if (time.getHours() > 12) {
    timeStatus = "PM"
  } else {
    timeStatus = "AM"
  }

  if(input.value.includes("http")) {
    const value = input.value.toString();
    const arrValue = value.split(/\s+/);
    const index = arrValue.findIndex(text => {
      return text.includes('http')
    }) 
    let filterHttp = arrValue.filter(text => {
      return text.includes('http')
    }) 

    filterHttp = `<a href="${filterHttp}" class="underline text-sky-500 font-medium">${filterHttp}</a>`;
    arrValue[index] = filterHttp;

    input.value = arrValue.join(' ');
  }

  let data = {
    name: localStorage.getItem("name"),
    message: input.value.trim(),
    image: localStorage.getItem("src"),
    hour: time.getHours(),
    minutes: time.getMinutes(),
    info_time: timeStatus,
    id: localStorage.getItem("id"),
    key: key,
    edit: false,
    upload: imageUpload
  }

  socket.emit("message", data)
  // global data
  allUser.push(data)
  try {
    localStorage.setItem("all_user", JSON.stringify(allUser))
    saveAllMessage();
    fileWrapper.classList.add("hidden");
  } catch(e) {
    if(e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sorry, your maximum localstorage length has been reached. Please delete any previous images or clear all your message.',
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: `Clear All Message`,
        confirmButtonColor: '#0d9488',
        confirmButtonText: 'Try Again!'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        } else if (result.isDenied) {
          localStorage.removeItem("all_user");
          window.location.reload()
        };
      }) 
    }
  }

 

  window.scrollTo(0, document.body.scrollHeight);
  input.value = '';
  imageUpload = "";
});

socket.on("message", (name, message, image, hour, minutes, info_time, id, key, edit, upload) => {
  let broadcast_data = {
    name: name,
    message: message,
    image: image,
    hour: hour,
    minutes: minutes,
    info_time: info_time,
    id: id,
    type: "broadcast",
    key: key,
    edit: edit,
    upload: upload
  }

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

  saveAllMessage();
  popUpSounds("chat", "wav")

  window.scrollTo(0, document.body.scrollHeight);
})

socket.on("private message", (name, message, image, hour, minutes, info_time, id) => {
  console.log(name, message, image, hour, minutes, info_time, id);
})

function saveAllMessage() {
  messageUser.innerHTML = ""
  allUser = allUser.filter(obj => {
    return obj.message.length > 0 || obj.upload.length > 0
  });

  localStorage.setItem("all_user", JSON.stringify(allUser));

  allUser.forEach(data => {
    if(data.message.length > 0 || data.upload.length > 0) {
      let allMessage = document.createElement("li");
      allMessage.classList.add("chat_list");
      allMessage.innerHTML = `
        <div class="flex justify-between items-center " id="container_message" >
          <div class="flex items-center" data-id="${data.id}">
            <img src="${data.image}" class="w-12 h-12 mr-3 rounded-full"> 
            <div>
              <div class="flex items-center ">
                <p class="text-lg font-medium">${data.name}</p>&nbsp;
                <span class="text-gray-900">${data.hour}:${data.minutes}</span>
                &nbsp;
                <span>${data.info_time}</span>
              </div>

              ${data.upload.length > 0 ? `<img src="${data.upload}" class="w-60 image_list"> ` : ""}

              <p class="${data.type !== undefined ? "bg-transparent border border-gray-300 " : "bg-slate-200"} ${data.upload.length > 0 ? `mt-2` : ""} ${data.message.length > 0 ? "" : "hidden"} rounded-br-3xl rounded-tr-3xl rounded-bl-xl p-2 break-all" id="message">${data.message}</p> 
              <span class="text-sm text-gray-700 ${data.edit ? null : "hidden"} edited_text">&nbsp;(edited)&nbsp;</span>
            </div> 
          <div>
          <div class="relative sm:-right-2 md:-right-4  -top-4 flex space-x-2 ">
            <button type="button"
              class="p-2.5 text-sm font-medium  bg-white shadow-md rounded-lg border border-slate-200 hover:bg-slate-100 focus:outline-none hidden" title="edit message"
              id="editBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
            </button>
            <button type="button"
              class="p-2.5 text-sm font-medium text-white bg-red-500 rounded-lg border border-red-600 hover:bg-red-700 focus:outline-none hidden " title="delete message"
              id="deleteBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                viewBox="0 0 16 16">
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path fill-rule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
              </svg>
            </button>
          </div>
        </div>
      `;  
  
      messageUser.appendChild(allMessage);
  
      const containerMessage = allMessage.querySelector("#container_message");
      const deleteBtn = allMessage.querySelector("#deleteBtn");
      const editBtn = allMessage.querySelector("#editBtn");
      const messageList = allMessage.querySelector("#message");
  
      messageList.contentEditable = false;
      
      containerMessage.addEventListener("mouseover",  () => {
        if(data.name === localStorage.getItem("name")) {
          deleteBtn.classList.remove("hidden");
          editBtn.classList.remove("hidden")
        } 
      })
  
      containerMessage.addEventListener("mouseout", () => {
        deleteBtn.classList.add("hidden");
        editBtn.classList.add("hidden");
      })
      
      // Details Image
      const imageList = allMessage.querySelector(".image_list");
      if(imageList !== null) {
        imageList.addEventListener("click", () => {
          
          Swal.fire({
            imageUrl: imageList.src,
            imageAlt: imageList.alt,
            showConfirmButton: false,
          })
        });
      }

      // Delete Message Function
      deleteBtn.addEventListener("click", (index) => {
        Swal.fire({
          title: 'Are you sure ?',
          text: "You won't be able to revert this message!",
          icon: 'warning',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonColor: '#0d9488',
          cancelButtonColor: '#d33',
          denyButtonColor: "#0d9488",
          denyButtonText: `Delete For Everyone`,
          confirmButtonText: 'Delete For Me',
          iconColor: "#14b8a6",
        }).then((result) => {
          if (result.isConfirmed) {
            allUser = allUser.filter(e => {
              if (e != data) {
                return index
              }
            })
            localStorage.setItem("all_user", JSON.stringify(allUser))
            saveAllMessage()
          } else if(result.isDenied) {
            allUser = allUser.filter(e => {
              if (e != data) {
                return index
              }
              socket.emit("delete message", e)
            })
            localStorage.setItem("all_user", JSON.stringify(allUser))
            saveAllMessage()
          }
        })
      });
  
      // Edit Message Function
      editBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        messageList.setAttribute("contenteditable", "true");
        messageList.focus()
  
        messageList.addEventListener('blur', () => {
          messageList.textContent = data.message;
          messageList.setAttribute("contenteditable", "false");
          data.edit = false;
        });
  
        document.addEventListener('keyup', function (event) {
          const text = messageList.innerText;
          if (event.key === 'Escape') {
            messageList.textContent = data.message;
            messageList.setAttribute("contenteditable", "false");
            data.edit = false;
          }  else if (event.key === "Enter") {
            if (text.length > 3) {
              data.message = text;
              data.edit = true;
              socket.emit('edit message', data);
              localStorage.setItem("all_user", JSON.stringify(allUser));
              messageList.setAttribute("contenteditable", "false");
              data.message.trim();
              window.location.reload();
            } else {
              messageList.textContent = data.message;
              localStorage.setItem("all_user", JSON.stringify(allUser));
              messageList.setAttribute("contenteditable", "false");
            }
          } 
        });
      });
    }
  })

  // Search Filter Message Function
  const containerMessage = document.querySelectorAll("#container_message"); 
  const searchInput = document.querySelector("#search-navbar");
  searchInput.addEventListener("keyup", function (event) {
    const keyword = event.target.value.toLowerCase();
    containerMessage.forEach((row) => {
      const title = row.querySelector("#message");
      const status = title.textContent.toLowerCase().startsWith(keyword);
      if (status) {
        row.style.display = "block";
      } else {
        row.style.display = "none"
      }
    })
  });

  window.scrollTo(0, document.body.scrollHeight);
}

function privateMessage(data) {
  messageUser.innerHTML = "";
  const privateList = document.createElement("li"); 
  privateList.innerHTML = `
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
  `

  messageUser.appendChild(privateList);
}

function broadcastMessage(data) {
  messageUser.innerHTML = "";
  const broadcastList = document.createElement("li");
  broadcastList.innerHTML = `
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
  `
  messageUser.appendChild(broadcastList);
}

function popUpSounds(song, type) {
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
  setTimeout(() => {
    containerUser.classList.add("hidden"); 
  }, 4500);
};

function deleteMessageBroadcast(data, message) {
  const objectWithMessageIndex = data.findIndex((obj) => obj.message === message);
  if (objectWithMessageIndex > -1) {
    data.splice(objectWithMessageIndex, 1);
  }

  localStorage.setItem("all_user", JSON.stringify(allUser));
  saveAllMessage();

  return data;
}

function editMessageBroadcast(data, key, name, message, edit) {
  const objectWithMessageIndex = data.findIndex((obj) => obj.key === key && obj.name === name);
  const targetObject = allUser[objectWithMessageIndex];
  targetObject.message = message;
  targetObject.edit = edit;
  localStorage.setItem("all_user", JSON.stringify(allUser));
  saveAllMessage();
  return data;
}

clearChatBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    if(allUser.length > 0) {
      Swal.fire({
        title: 'Delete All these messages ?',
        text: "You won't be able to revert these messages!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d9488',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete all messages',
        iconColor: "#14b8a6"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("all_user");
          window.location.reload()
        }
      })
    }
  });
})

document.addEventListener("DOMContentLoaded", () => {
  saveProfile();
  if(localStorage.getItem("all_user") ) {
    saveAllMessage()
    window.scrollTo(0, document.body.scrollHeight);
  } 
})

socket.on('add_user', (data) => {
  userJoinLeftUI(data.name, data.image, true);
  popUpSounds("notif", "wav")
});

socket.on("sendData", (data) => {
  console.log(JSON.stringify(data));
})

let broadcast_profile = "";
socket.on("add_user", (data) => {
  broadcast_profile = data.image;
})

socket.on("userLeft", (data) => {
  if (data.name !== undefined) {
    if (data.image !== undefined) {
      userJoinLeftUI(data.name, data.image, false);
      popUpSounds("notif", "wav")
    } else {
      popUpSounds("notif", "wav")
      userJoinLeftUI(data.name, `${broadcast_profile}`, false)
    }
  }
});

socket.on("delete message", (data) => {
  deleteMessageBroadcast(allUser, data.message)
});

socket.on("edit message", (data) => {
  editMessageBroadcast(allUser, data.key, data.name, data.message, data.edit)
  console.log(data);
});


console.log(window.navigator.userAgent.toLowerCase());
console.log('windows: ',window.navigator.userAgent.toLowerCase().includes("windows")) // pc windows
console.log('ipad', window.navigator.userAgent.toLowerCase().includes("ipad")) // ipad
console.log('iphone', window.navigator.userAgent.toLowerCase().includes("iphone")) // iphone
console.log('android', window.navigator.userAgent.toLowerCase().includes("android")) // andorid
