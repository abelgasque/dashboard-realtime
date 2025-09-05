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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const randomSecond = Math.floor(Math.random() * 60);

    const randomTime = new Date(year, month, day, randomHour, randomMinute, randomSecond);
    const data = {
      time: randomTime,
      value: 1,
      status: Math.random() > 0.5 ? "success" : "error"
    };
    socket.emit("dashboardData", data);
  }, 2000);
});

server.listen(3000, () => console.log("✅ Backend rodando em http://localhost:3000"));