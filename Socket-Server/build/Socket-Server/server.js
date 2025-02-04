"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_2 = __importDefault(require("./socket.io"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const socketServer = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});
(0, socket_io_2.default)(socketServer);
mongoose_1.default.connect('mongodb://localhost:27017', { dbName: 'kakao-talk' })
    .then(() => console.log('몽고DB와 연결이 성공했습니다.'));
httpServer.listen(PORT || 8000, () => { console.log(`Server is running on ${PORT || 8000}`); });
