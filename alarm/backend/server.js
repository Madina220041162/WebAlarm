const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('./config/db');
const notesRoutes = require('./routes/notesRoutes');
const gameScoresRoutes = require('./routes/gameScoresRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

const http = require('http');
const { Server } = require('socket.io');
const alarmRoutes = require('./routes/alarmRoutes');
const { startAlarmScheduler } = require('./utils/alarmScheduler');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files as static content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Alarm Clock Backend is running');
});

// API routes
app.use('/api/auth', userRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/game-scores', gameScoresRoutes);
// Compatibility alias (accept requests without hyphen)
app.use('/api/gamescores', gameScoresRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/alarms', alarmRoutes);

const PORT = process.env.PORT || 5000;

const serverStart = async () => {
  await connectDB();

  // Create HTTP server and attach Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

  io.on('connection', (socket) => {
    console.log('Client connected to Socket.IO', socket.id);
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });

  // Start alarm scheduler with io
  startAlarmScheduler(io);

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

serverStart();
