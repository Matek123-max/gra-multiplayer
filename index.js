const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {};
const WORDS = [
 const WORDS = [
  "telefon", "komputer", "samochód", "pies", "kot", "kwiat", "słońce", "księżyc", "gwiazda", "las",
  "rzeka", "góra", "morze", "drzwi", "okno", "krzesło", "biurko", "kubek", "książka", "długopis",
  "notatnik", "tablica", "farba", "rower", "samolot", "pociąg", "czapka", "but", "skarpetka", "zegar",
  "lampa", "przycisk", "papier", "nożyczki", "kamera", "mikrofon", "lód", "chleb", "woda", "herbata",
  "kawa", "czekolada", "ser", "masło", "jajko", "mleko", "sok", "truskawka", "banan", "gruszka",
  // ... i tak dalej do 300 słów
];

  // ... dodaj do 300 słów



io.on("connection", (socket) => {
  console.log("Nowy gracz:", socket.id);

  socket.on("joinRoom", ({ room, username }) => {
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) rooms[room] = [socket]];
    if (rooms[room].length >= 5) return;

    rooms[room].push(socket);
   socket.on("joinRoom", ({ room, username }) => {
  socket.username = username;
  socket.room = room;

  if (!rooms[room]) rooms[room] = [];

  if (rooms[room].length >= 5) return;

  rooms[room].push({ socket, username });
  socket.join(room);

  // Wyślij listę graczy w tym pokoju do wszystkich jego uczestników
  const players = rooms[room].map(p => p.username);
  rooms[room].forEach(({ socket }) => {
    socket.emit("playerList", players);
  });

  io.emit("roomList", getRoomList());

  if (rooms[room].length >= 4) {
    startGame(room);
  }
});

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
  const playerEntries = rooms[room]; // [{ socket, username }, ...]

  // Losuj wspólne słowo
  const commonWord = WORDS[Math.floor(Math.random() * WORDS.length)];

  // Losuj indeks impostora
  const impostorIndex = Math.floor(Math.random() * playerEntries.length);

  playerEntries.forEach(({ socket }, i) => {
    const wordToSend = i === impostorIndex ? "IMPOSTOR" : commonWord;
    socket.emit("gameStart", { word: wordToSend });
  });
}


  // Losuj wspólne słowo
  const wordIndex = Math.floor(Math.random() * WORDS.length);
  const commonWord = WORDS[wordIndex];

  // Losuj inne słowo dla impostora
  let impostorWord;
  do {
    impostorWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (impostorWord === commonWord);

  // Losuj, który gracz będzie impostorem
  const impostorIndex = Math.floor(Math.random() * players.length);

  players.forEach((socket, i) => {
    const wordToSend = (i === impostorIndex) ? impostorWord : commonWord;
    socket.emit("gameStart", { word: wordToSend });
  });
}

  });
}

http.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
