//Servidor con express
const express = require("express");
const http = require("http");
var cors = require('cors')
const app = express();

app.use(cors());


// puerto de la app
const PORT = process.env.PORT || 5000;

const servidor = http.createServer(app);

//Inicializamos socketio
// const socketio = require("socket.io");
// const io = socketio(servidor);
var io = require('socket.io')(servidor);

//Funcionalidad de socket.io en el servidor
io.on("connection", (socket) => {
  let nombre;

  socket.on("conectado", (nomb) => {
    nombre = nomb;
    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    socket.broadcast.emit("mensajes", {
      nombre: nombre,
      mensaje: `${nombre} ha entrado en la sala del chat`,
    });
  });

  socket.on("mensaje", (nombre, mensaje) => {
    //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("mensajes", { nombre, mensaje });
  });

  socket.on("disconnect", () => {
    io.emit("mensajes", {
      servidor: "Servidor",
      mensaje: `${nombre} ha abandonado la sala`,
    });
  });
});

//servidor.listen(5000, () => console.log("Servidor inicializado"));
// arrancar la app
servidor.listen(PORT, () => {
  console.log(`funcionando en el puerto ${PORT}`);
});
