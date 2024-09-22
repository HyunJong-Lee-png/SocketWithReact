import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'room',
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('message', MessageSchema);