const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let totalUsers = 0;
io.on('connection', (socket) => {
  let addedUser = false;
  console.log('a user connected');
  console.log(socket.rooms);

  
  socket.on('message', (data) => {
    const { name, message, image, hour,  minutes, info_time, id } = data;
    socket.username = name;
    socket.broadcast.emit('message', name, message, image, hour, minutes, info_time, id);
  });
  
  
  // socket.on("private message", ({content, to}) => {
  //   socket.to(to).emit("private message", {
    //     content,
    //     from: socket.id
    //   })
  // })
  

  socket.on('add_user', (username) => {
    if(addedUser) return;
    totalUsers++;
    socket.emit("login", {name: username})
    socket.broadcast.emit("add_user", { name: username, totalUser: totalUsers });
  });
  socket.on('disconnect', () => {
    console.log(`user disconnected`);
    socket.broadcast.emit("user left", {
      username: socket.username,
      totalUser: totalUsers
    })
  });

});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});