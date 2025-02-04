import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from "mongoose";
import socketIO from './socket.io';

const PORT = process.env.PORT || 8000;

const app = express();
const httpServer = createServer(app);
const socketServer = new Server(httpServer, {
  cors: {
    origin: 'https://socket-io-kakao-talk.vercel.app'
  }
});

socketIO(socketServer);

mongoose.connect('mongodb://localhost:27017', { dbName: 'kakao-talk' })
  .then(() => console.log('몽고DB와 연결이 성공했습니다.'));




httpServer.listen(PORT || 8000, () => { console.log(`Server is running on ${PORT || 8000}`) });