const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  } );

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (room) => {

    });

    socket.on('move', ({ room, move }) => {

    });

    socket.on('disconnect', () => {

    });
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
