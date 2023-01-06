const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

let totalUsers = 0;
let user_nickname = [];

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
  
  socket.on('message', (data) => {
    const { name, message, image, hour,  minutes, info_time, id, key, edit, upload } = data;
    socket.broadcast.emit('message', name, message, image, hour, minutes, info_time, id, key, edit, upload);
  });

  // socket.on("message image", (data) => {
  //   const { name, profil, image, hour, minutes, info_time, id, key } = data;
  //   socket.broadcast.emit("message image", name, message, image, hour, minutes, info_time, id, key)
  // });

  // socket.on("join-room", room => {
  //   socket.join(room);
  //   console.log(room);
  // }); 

  socket.on('delete message', function (messageId) {
    socket.broadcast.emit('delete message', messageId);
  });

  socket.on("edit message", (data) => {
    socket.broadcast.emit('edit message', data );
  })

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