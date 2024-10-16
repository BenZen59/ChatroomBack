require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Initialisation du serveur
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Autoriser les requêtes cross-origin
  },
});

app.use(express.json());
app.use(cors()); // Permettre les requêtes depuis un domaine différent

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route pour générer un token de session temporaire
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: "Le nom d'utilisateur est requis" });

  // Générer un token JWT
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Route protégée pour envoyer un message (exemple d'API REST)
app.post("/messages", authenticateToken, (req, res) => {
  const message = req.body.message;
  if (!message)
    return res.status(400).json({ message: "Le message est requis" });

  // Ici, on émet le message via Socket.io
  io.emit("message", { username: req.user.username, message });
  res.status(200).json({ message: "Message envoyé" });
});

// Socket.io pour le chat en temps réel
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
