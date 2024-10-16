// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware pour servir les fichiers statiques (si besoin)
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on("message", (msg) => {
    io.emit("message", msg); // Diffuse le message à tous les clients
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

server.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});
