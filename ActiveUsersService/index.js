const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIoClient = require('socket.io-client'); // Import socket.io-client
const Middlewere = require("./middlewares");
const socketIo = require('socket.io');
require('dotenv').config();

let activeUsers = [];

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const activeUsersIO =socketIo(httpServer, {
  cors: {
      origin: '*'      
  }
});
const LoginURL = process.env.LOGIN_URL || 'http://localhost:8080';
const loginServiceSocket =socketIoClient(LoginURL);
loginServiceSocket.on('connect', () => {
 
  loginServiceSocket.on('userLoggedIn', (username) => {
    console.log(`User ${username} logged in`);
    if(activeUsers.indexOf(username)==-1){
    activeUsers.push(username);
    activeUsersIO.emit('userConnected', username); 
    console.log(`User ${username} connected`);}
    else{
      activeUsersIO.emit('userAlreadyConnected', username);
      console.log(`User ${username} already connected`);
    }

  });

  loginServiceSocket.on('userLoggedOff', (username) => {
    console.log(`User ${username} logged off`);
    const index = activeUsers.indexOf(username);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      activeUsersIO.emit('userDisconnected', username);
      console.log(`User ${username} disconnected`);
    }
  });
});


app.get('/activeUsers',Middlewere,(req, res) => {
  res.status(200).json(activeUsers);
});
const PORT = process.env.PORT || 8000;
const server = httpServer.listen(PORT, function(){
    const port = server.address();
    console.log("Active Users Service is running on port", port);
});

