"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    room: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'room',
        required: true,
    },
    messageType: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('message', MessageSchema);
