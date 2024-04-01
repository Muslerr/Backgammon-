const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const httpServer = http.createServer(app);

const ioServer = socketIo(httpServer, {
    cors: {
        origin: '*'
    }
});

const userRoute = require('./routes/userRoute');
app.use('/users', userRoute(ioServer));

const DBurl = process.env.DB_URL || "mongodb://127.0.0.1:27017/backgammonUsers";
const PORT = process.env.PORT || 8080;

mongoose.connect(DBurl).then(() => {
    const server = httpServer.listen(PORT, function () {
        console.log("Login Service is running on port", PORT);
    });
}).catch(error => console.log(error));
