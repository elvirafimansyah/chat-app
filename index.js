const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', (value) => {
    console.log('user disconnected');
  });

  socket.on('message', (data) => {
    const { name, message, image } = data;
    socket.broadcast.emit('message', name, message, image);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});