import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import documentRoutes from './routes/documents.js';
import notificationRoutes from './routes/notifications.js';
import { createNotification } from './controllers/notificationController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/document-dashboard')
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => console.error('✗ MongoDB connection error:', err));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✓ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });

  // Listen for upload completion from frontend
  socket.on('uploadComplete', async (data) => {
    const { count } = data;
    const message = `${count} file${count > 1 ? 's' : ''} uploaded successfully`;

    // Save notification to DB
    await createNotification(message, 'success');

    // Emit to all connected clients
    io.emit('notification', {
      message,
      type: 'success',
      timestamp: new Date(),
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Socket.io listening for real-time events\n`);
});
