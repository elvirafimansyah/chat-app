const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

let totalUsers = 0;
let user_nickname = [];
let user_image = [];

io.on('connection', (socket) => {
  let addedUser = false;
  console.log('a user connected');

  socket.on("sendNickname", (username, image) => {
    socket.username = username;
    socket.image = image;
    user_nickname.push(socket.username)
  })


  socket.on('add_user', (username, image) => {
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
    console.log(socket.image);
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