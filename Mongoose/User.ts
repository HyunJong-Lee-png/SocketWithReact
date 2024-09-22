import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  online: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

export default mongoose.model('user', UserSchema);