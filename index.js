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
    let split = room.split('--with--');
    let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); 
    let updatedRoomName = `${unique[0]}--with--${unique[1]}`;
    Array.from(socket.rooms)
      .filter(it => it !== id)
      .forEach(id => {
        socket.leave(id);
      });
    socket.join(room);
    socket.userid = id;
    users.push(room);
    socket.join(updatedRoomName);

    socket.to(room).emit("wow", console.log(hello))

    socket.emit("sendData", {room: socket.room, id: socket.userid});
  });
  
  console.log(socket.rooms);
  // socket.on("private message", (to, message) => {
    
  // });


  socket.on('add_user', (username, image) => {
    socket.image = image;
    socket.username = username;
    addedUser = true;
    totalUsers++;
    socket.emit("login", {name: username})
    socket.broadcast.emit("add_user", { name: username, totalUser: totalUsers, image: image });
  })
  
  socket.on('message', (data) => {
    const { name, message, image, hour,  minutes, info_time, id } = data;
    socket.broadcast.emit('message', name, message, image, hour, minutes, info_time, id);
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