const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const verifyToken = require("./middlewares");require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  socket.on("createRoom", ({ sender, recipient, token }) => {
    if (verifyToken(token)) {
      const roomId = determineRoomId(sender, recipient);
      console.log("room created",roomId);      
      io.emit('roomCreated', { sender: sender,recipient:recipient,roomId: roomId });      
    } else {
      console.log(token,"token",sender,recipient);
    }
  }); 
  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  socket.on("sendMessage", (roomId,sender,receiver, message, token) => {
    if (verifyToken(token)) {
      io.to(roomId).emit("receiveMessage",sender,receiver, message);
      console.log("Received message", message,roomId);
    } else {
      console.log("wrong token send");
    }
  });

  socket.on("disconnect", (userName) => {
    console.log("User disconnected:", userName);
  });
});
function determineRoomId(senderUsername, recipientUsername) {  
  const usernames = [senderUsername, recipientUsername];
  const roomId = usernames.join('-');
  return roomId;
}
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
