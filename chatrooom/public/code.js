(function () {
  // Az alkalmazás gyökérelemének kiválasztása a DOM-ban
  const app = document.querySelector(".app");

  // Socket.IO kapcsolat inicializálása
  const socket = io();

  // Felhasználónév változó inicializálása
  let uname;

  // Felhasználó csatlakozásának eseménykezelője
  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      // Felhasználónév beolvasása az input mezőből
      let username = app.querySelector(".join-screen #username").value;
      // Ha nincs megadva felhasználónév, kilépés a függvényből
      if (username.length == 0) {
        return;
      }
      // Új felhasználó eseményének küldése a szervernek
      socket.emit("newuser", username);
      // Felhasználónév mentése
      uname = username;
      // Átkapcsolás a csatlakozott felületre
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  // Üzenet küldésének eseménykezelője
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      // Üzenet beolvasása az input mezőből
      let message = app.querySelector(".chat-screen #message-input").value;
      // Ha nincs üzenet, kilépés a függvényből
      if (message.length == 0) {
        return;
      }
      // Saját üzenet megjelenítése a felületen
      renderMessage("my", {
        username: uname,
        text: message,
      });
      // Üzenet küldése a szervernek
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      // Üzenet input ürítése
      app.querySelector(".chat-screen #message-input").value = "";
    });

  // Kilépés eseménykezelője
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      // Kilépés eseményének küldése a szervernek
      socket.emit("exituser", uname);
      // Ablak újratöltése
      window.location.href = window.location.origin;
    });

  // Frissítés eseményének kezelése
  socket.on("update", function (update) {
    // Frissítés megjelenítése a felületen
    renderMessage("update", update);
  });

  // Chat üzenet érkezésének kezelése
  socket.on("chat", function (message) {
    // Más felhasználó üzenetének megjelenítése a felületen
    renderMessage("other", message);
  });

  // Üzenet megjelenítésének függvénye
  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      // Saját üzenet megjelenítése
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      // Másik felhasználó üzenetének megjelenítése
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
                    <div>
                        <div class="name">${message.username}</div>
                        <div class="text">${message.text}</div>
                    </div>
                `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      // Frissítés üzenet megjelenítése
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // Chat ablak görgetése az utolsó üzenethez
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
