const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {}
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.post('/emit', (req, res) => {
    const {event, data} = req.body;
    io.emit(event, data);
    res.sendStatus(200);
});

server.listen(3000, () => {
    console.log('Socket.IO server listening on port 3000');
});