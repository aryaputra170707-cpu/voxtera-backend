const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Izinkan akses dari Vercel

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Untuk tahap development/pameran
});


setInterval(() => {
  const dataSensor = {
    debit: (Math.random() * 0.3 + 0.2).toFixed(2),
    rpm: Math.floor(Math.random() * 50 + 250),
    tegangan: (Math.random() * 1 + 11.5).toFixed(1),
    arus: (Math.random() * 1 + 1.5).toFixed(1),
  };
  io.emit('data-monitoring', dataSensor);
}, 2000);

app.use(express.json());
app.post('/api/sensor', (req, res) => {
  const dataSensor = req.body; 
  io.emit('data-monitoring', dataSensor); 
  res.status(200).send({ status: 'success' });
});

io.on('connection', (socket) => {
  console.log('Website frontend terhubung!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});