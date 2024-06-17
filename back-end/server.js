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

const socketToRoomMap = new Map();
const socketToUserIdMap = new Map();
const connectDB = require('./mongodb');
connectDB();

const { whenUserLeaveTheGame, whenTheGameStarts } = require('./utils'); // Import the utility functions

io.on('connection', (socket) => {
  socket.on('join', async ({game, user}) => {
    const roomId = game._id;

    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socketToRoomMap.set(socket.id, roomId);
    socket.join(roomId);
    socket.to(roomId).emit('playerJoined', { user, roomId });

    socketToUserIdMap.set(socket.id, user._id);
    // If the initializer and the opponent are in the room, start the game
    if(game.opponent._id === user._id) {
      await whenTheGameStarts(roomId);
    }
  });

  socket.on('move', (roomId, move) => {
    socket.to(roomId).emit('move', move);
    console.log(`Socket ${socket.id} sent move ${move} to room ${roomId}`);
  });

  socket.on('disconnect', async () => {
    console.log(`Socket ${socket.id} disconnected`);

    const roomId = socketToRoomMap.get(socket.id);
    const userId = socketToUserIdMap.get(socket.id);

    if (roomId) {
      console.log(`Socket ${socket.id} disconnected from room ${roomId}`);
      io.to(roomId).emit('opponentDisconnected');
      socketToRoomMap.delete(socket.id);

      await whenUserLeaveTheGame(roomId, userId);
    }
  });
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
