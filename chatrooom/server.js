const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Statikus fájlok kiszolgálása a 'public' mappából
app.use(express.static(path.join(__dirname + "/public")));

// Socket.IO eseménykezelők
io.on("connection", function (socket) {
  // Új felhasználó csatlakozásának eseménykezelője
  socket.on("newuser", function (username) {
    // Az új felhasználó csatlakozásának értesítése az összes többi kliens felé
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  // Felhasználó kilépésének eseménykezelője
  socket.on("exituser", function (username) {
    // A kilépő felhasználó értesítése az összes többi kliens felé
    socket.broadcast.emit("update", username + " left the conversation");
  });

  // Chat üzenet küldésének eseménykezelője
  socket.on("chat", function (message) {
    // A küldött üzenet továbbítása az összes többi kliens felé
    socket.broadcast.emit("chat", message);
  });
});

// Szerver indítása a megadott porton
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
