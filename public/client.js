const socket = io();

function joinRoom() {
  const username = document.getElementById("username").value;
  const room = document.getElementById("room").value;
  if (!username || !room) return alert("Uzupełnij pola!");

  socket.emit("joinRoom", { room, username });
}

socket.on("roomList", (rooms) => {
  const list = document.getElementById("roomList");
  list.innerHTML = "";
  rooms.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${r.name} (${r.count}/5)`;
    list.appendChild(li);
  });
});

socket.on("gameStart", ({ word }) => {
  document.getElementById("game").style.display = "block";
  document.getElementById("word").textContent = word;
});
socket.on("playerList", (players) => {
  const list = document.createElement("ul");
  players.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
  document.body.appendChild(list); // albo dodaj w konkretnym miejscu
});
