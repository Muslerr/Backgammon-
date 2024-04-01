const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const middlewares = require("./middlewares");


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
  
    socket.on("NewGameInvite", ({senderUsername, recipientUsername, token}) => {
    if (middlewares.verifyToken(token)) {
      const GameId = middlewares.determineRoomId(senderUsername, recipientUsername);
      console.log(senderUsername,"invited",recipientUsername,GameId);      ;
      io.emit('InvitedToNewGame', { senderUsername, recipientUsername ,GameId });      
    } else {
      console.log("wrong token recived",token);
    }
  }); 
  
  
  socket.on("AcceptGameInvite", (senderUsername, recipientUsername,gameId, token) => {
    if (middlewares.verifyToken(token)) {
      console.log(senderUsername,"accepted",recipientUsername,gameId);      ;
      io.to(gameId).emit('GameStarted', { sender: senderUsername,recipient:recipientUsername,gameId: gameId });      
    } else {
      console.log("wrong token recived");
    }
  });
 
  socket.on("joinGame", (GameId) => {
    socket.join(GameId);
    console.log(`User joined room: ${GameId}`);
  });
  
  
  socket.on("DeclineGameInvite", (senderUsername, recipientUsername,gameId, token) => {
    if (middlewares.verifyToken(token)) {
      console.log(senderUsername,"declined ",recipientUsername);      ;
      io.to(gameId).emit('GameDeclined', { sender: senderUsername,recipient:recipientUsername,gameId: gameId });      
      socket.leave(gameId);
    } else {
      console.log("wrong token recived");
    }
  });
    
 
  socket.on("sendPlay", (gameId,sender,receiver,playerColor, origin,destination, token) => {
    if (middlewares.verifyToken(token)) {
      io.to(gameId).emit("PlaySent",({sender,receiver,playerColor, origin,destination}));
      console.log("PlaySent",gameId,sender,receiver,playerColor, origin,destination);
    } else {
      console.log("wrong token sent play white");
    }
  });
  
  socket.on("LastSendPlay", (gameId,sender,receiver,playerColor, origin,destination, token) => {
    if (middlewares.verifyToken(token)) {
      io.to(gameId).emit("LastPlaySent",({sender,receiver,playerColor, origin,destination}));
      console.log("LastPlaySent",gameId,sender,receiver,playerColor, origin,destination);
    } else {
      console.log("wrong token sent play white");
    }
  });
  socket.on("IWon", (gameId,sender,receiver,playerColor,  token) => {
    if (middlewares.verifyToken(token)) {
      io.to(gameId).emit("PlayerWon",({sender,receiver,playerColor}));
      console.log("player won",gameId,sender,receiver,playerColor);
    } else {
      console.log("wrong token sent play white");
    }
  });
  socket.on("IConcede", (gameId,sender,receiver,playerColor,  token) => {
    if (middlewares.verifyToken(token)) {
      io.to(gameId).emit("PlayerConcede",({sender,receiver,playerColor}));
      console.log("player won",gameId,sender,receiver,playerColor);
    } else {
      console.log("wrong token sent play white");
    }
  });
  

  
  socket.on("disconnect", (userName) => {
    console.log("User disconnected:", userName);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
