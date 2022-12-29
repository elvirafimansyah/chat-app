const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

let totalUsers = 0;
let user_nickname = [];
let users = []

io.on('connection', (socket) => {
  let addedUser = false;
  console.log('a user connected');
  
  socket.on("sendNickname", (username) => {
    socket.username = username;
    user_nickname.push(socket.username)
  })

  socket.on("sendData", (room, id) => {
    socket.userroom = room;
    socket.userid = id;
    socket.emit("sendData", {room: socket.room, id: socket.userid});
  });

  socket.on('add_user', (username, image) => {
    socket.image = image;
    socket.username = username;
    addedUser = true;
    totalUsers++;
    socket.emit("login", {name: username})
    socket.broadcast.emit("add_user", { name: username, totalUser: totalUsers, image: image });
  })
  
  socket.on('message', (data, room) => {
    const { name, message, image, hour,  minutes, info_time, id, room_user } = data;
    if (room === "General") {
      socket.broadcast.emit('message', name, message, image, hour, minutes, info_time, id, room_user);
    } else {
      socket.to(room).emit("message", name, message, image, hour, minutes, info_time, id, room_user);
    }
  });

  socket.on("join-room", room => {
    socket.join(room);
    console.log(room);
  }); 

  socket.on('disconnect', () => {
    totalUsers--;
    socket.broadcast.emit('userLeft', {
      name: socket.username, 
      totalUser: totalUsers, 
      image: socket.image
    })
  });
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});