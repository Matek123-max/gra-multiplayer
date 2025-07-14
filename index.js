const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {};
const WORDS = ["komputer", "telefon", "las", "pizza", "rower"];

io.on("connection", (socket) => {
  console.log("Nowy gracz:", socket.id);

  socket.on("joinRoom", ({ room, username }) => {
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) rooms[room] = [];
    if (rooms[room].length >= 5) return;

    rooms[room].push(socket);
    socket.join(room);

    io.emit("roomList", getRoomList());

    if (rooms[room].length >= 4) {
      startGame(room);
    }
  });

  socket.on("disconnect", () => {
    const room = socket.room;
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((s) => s.id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    }
    io.emit("roomList", getRoomList());
  });
});

function getRoomList() {
  return Object.entries(rooms).map(([name, players]) => ({
    name,
    count: players.length
  }));
}

function startGame(room) {
  rooms[room].forEach((socket) => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    socket.emit("gameStart", { word });
  });
}

http.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
