const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { protocol } = require("socket.io-client");
const { reset } = require("nodemon");
const { errorMonitor } = require("stream");
const port = process.env.PORT || 3000;
app.use(cors());

const server = http.createServer(app);
app.get("/", (res, req) => {
res.send("GET called")
});

const io = new Server(server, {
  cors: {
    origin: "https://git.heroku.com/chattytings.git",
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, (err) => {
  if (err) {
    console.log(err)
  }
    console.log("welcome to the server...")
})