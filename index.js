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

  socket.on("sendNickname", (username) => {
    socket.username = username;
    socket.broadcast.emit("sendNickname", username);
  })

  socket.on("sendId", (userid) => {
    socket.userid = userid
  });
  
  socket.on("sendImage", (image) => {
    socket.image = image
  })

  socket.on("login", (data) => {
    console.log(`${data.name} connected`)
    socket.broadcast.emit("login", data)
  });

  socket.on("sendData", (room, id) => {
    socket.userid = id;
    socket.emit("sendData", {room: socket.room, id: socket.userid});
  });

  socket.on('add_user', (username, image, status, id) => {
    socket.username = username;
    addedUser = true;
    totalUsers++;
    socket.broadcast.emit("add_user", { name: username, totalUser: totalUsers, image: image, status: status, id: id });
  })
  
  socket.on('message', (data) => {
    const { name, message, image, hour,  minutes, info_time, id, key, edit, upload } = data;
    socket.broadcast.emit('message', name, message, image, hour, minutes, info_time, id, key, edit, upload);
  });

  socket.on("typing", (status) => {
    socket.broadcast.emit("typing", {status: status, name: socket.username})
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

  socket.on("signout", (data) => {
    if(addedUser) {
      totalUsers--
      socket.broadcast.emit("signout", {totalUser: totalUsers, message: data})
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userLeft', {
      name: socket.username, 
      id: socket.userid,
      // totalUser: totalUsers, 
      image: socket.image
    })
  });
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});