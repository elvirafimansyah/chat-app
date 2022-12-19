const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;
io.on('connection', (socket) => {
  let addedUser = false;
  console.log('a user connected');

  socket.on('disconnect', (value) => {
    console.log('user disconnected');
  });

  socket.on('message', (data) => {
    const { name, message, image, hour,  minutes, info_time  } = data;
    socket.username = name;
    socket.broadcast.emit('message', name, message, image, hour, minutes, info_time);
  });

  socket.on('add_user', (username) => {
    numUsers++;
    socket.emit("login", {name: username})
    socket.broadcast.emit("add_user", {name: username, numUsers: numUsers});
  });
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});