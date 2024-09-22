import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }]
}, { timestamps: true });

export default mongoose.model('room', RoomSchema);