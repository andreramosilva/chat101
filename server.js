const express = require("express");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io").listen(server);

let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log(`### server runing on port 3000 ###`);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log(
    `Connected: ${socket} . %s sockets connected`,
    connections.length
  );

  //disconnect
  socket.on("disconnect", function (data) {
    console.log("disconnecting");
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected ,%s sockets connected`, connections.length);
  });

  //send message
  socket.on("sendMessage", function (data) {
    io.sockets.emit("newMessage", { msg: data, user: socket.username });
    console.log(data);
  });

  socket.on("newUser", function (data, callback) {
    console.log("new user");
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });
  function updateUserNames() {
    io.sockets.emit("getUsers", users);
  }
});
