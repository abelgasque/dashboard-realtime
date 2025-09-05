const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  setInterval(() => {
    const data = {
      time: new Date(),
      value: Math.floor(Math.random() * 100),
      status: Math.random() > 0.5 ? "success" : "error"
    };
    socket.emit("dashboardData", data);
  }, 2000);
});

server.listen(3000, () => console.log("✅ Backend rodando em http://localhost:3000"));