import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from "mongoose";
import socketIO from './socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors({
  origin: [
    "https://socket-io-kakao-talk.vercel.app", // 클라이언트 도메인
    "http://localhost:5173",                  // 개발용 로컬 도메인
  ],
  methods: ["GET", "POST"],                   // 허용할 HTTP 메서드
  credentials: true,                          // 쿠키/인증 정보 허용
}));
const httpServer = createServer(app);
const socketServer = new Server(httpServer, {
  cors: {
    origin: [
      "https://socket-io-kakao-talk.vercel.app", // 클라이언트 도메인
      "http://localhost:5173",                  // 개발용 로컬 도메인
    ],
  }
});

socketIO(socketServer);

mongoose.connect('mongodb+srv://cjswoxoddl21:pELacEsxIw58sNXF@cluster0.8ctxd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { dbName: 'kakao-talk' })
  .then(() => console.log('몽고DB와 연결이 성공했습니다.'));




httpServer.listen(PORT || 8000, () => { console.log(`Server is running on ${PORT || 8000}`) });
