// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend Next.js
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté:", socket.id);

  // Rejoindre une salle spécifique
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} a rejoint la salle ${room}`);
  });

  // Recevoir un message et l'envoyer à tous les utilisateurs de la salle
  socket.on("message", ({ room, message }) => {
    console.log(`Message reçu dans la salle ${room}: ${message}`);
    io.to(room).emit("message", message); // Envoie le message à tous les utilisateurs dans la salle spécifiée
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

server.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});
