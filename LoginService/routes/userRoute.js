const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserM = require("../model/User");
const router = express.Router();
const Middlewere = require("../middlewares");
const io = require('socket.io')();
const socketIoClient = require('socket.io-client');
const ActiveURL = process.env.ACTIVE_URL || 'http://localhost:8000';
const ActiveServiceSocket =socketIoClient(ActiveURL);
module.exports= (ioServer) =>{

  router.get("/", async (req, res) => {
    const users = await UserM.find();
    const usersInfo = users.map((user) => ({ username: user.username, icon: user.icon }));
    res.status(200).json(usersInfo);
  });
  

router.post("/signIn", async (req, res) => {
  try {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var blevel=req.body.blevel
    if(blevel === 0){
      blevel = 1;
    }
    const user = new UserM({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      blevel: blevel,
      icon:req.body.icon
    });

    try {
      await user.save();
      const token = Middlewere.createToken(user);
      
      ioServer.emit('userLoggedIn', user.username);
      res.send({
        token: token,
        username: user.username,
        icon:user.icon,
      });
      
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern.username) {
          return res.status(400).json({ message: "Username already taken." });
        } else if (error.keyPattern.email) {
          return res.status(400).json({ message: "Email already taken." });
        }
      }
      res.status(500).json({ message: "Couldn't save user." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred." });
  }
});


router.post("/login", async (req, res) => {
  let user = await UserM.findOne({
    username: req.body.username,
  });
          
    if (user) {
      const loginPromise = new Promise(async (resolve, reject) => {
        // Emit 'userLoggedIn' to notify the active service
        ioServer.emit('userLoggedIn', user.username);
  
        // Wait for a response from the active service
        ActiveServiceSocket.once('userConnected', (username) => {
          // User successfully connected
          const token = Middlewere.createToken(user);
          resolve({
            token: token,
            username: user.username,
            icon: user.icon,
          });
        });
  
        ActiveServiceSocket.once('userAlreadyConnected', (username) => {
          // User is already connected, reject the login
          reject({ status: 401, message: 'User is already connected.' });
        });
      });
  
      try {
        const loginResponse = await loginPromise;
        // Send the login response to the client
        res.send(loginResponse);
        res.end();
      } catch (error) {
        // Handle errors from the promise
        res.status(error.status).send(error.message);
        res.end();
      }
    } else {
      res.status(404);
      res.send("user not found");
      res.end();
    }
  });

router.post("/logout", (req, res) => { 
  ioServer.emit('userLoggedOff', req.body.username);  
  res.status(200);
  res.end();
});

return  router
};
