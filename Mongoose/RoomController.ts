import { Document } from "mongoose";
import Room from "./Room";
import User from "./User";

interface RoomController {
  createRooms(): Promise<Document[]>;
  addMember(roomId: string, socketId: string): Promise<Document | undefined>;
  removeMember(roomId: string, name: string): Promise<Document | undefined>;
}
const roomController = {} as RoomController;

roomController.createRooms = async () => {
  const alreadyRooms = await Room.find();

  if (alreadyRooms.length) return alreadyRooms;

  const rooms = await Room.insertMany([
    {
      roomName: 'HTML 방',
      members: [],
    }, {
      roomName: 'CSS 방',
      members: [],
    }, {
      roomName: 'JAVASCRIPT 방',
      members: [],
    }]);

  return rooms;
};

roomController.addMember = async (roomId, name) => {
  try {
    const user = await User.findOne({ name });
    console.log('addmember:');
    if (user) {
      const room = await Room.findById(roomId);
      if (room) {
        if (!room.members.includes(user._id)) {
          room.members.push(user._id);
          await room.save();
          return room;
        } else return room;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

roomController.removeMember = async (roomId, name) => {
  const room = await Room.findById(roomId);
  if (room) {
    let user = await User.findOne({ name });
    if (!user) {
      const a = await User.find({});
      user = await User.findOne({ token: name })
    }
    if (user) {
      const idx = room.members.findIndex(member => member.toString() === (user._id).toString());
      room.members.splice(idx, 1);
      await room.save();
      return room;
    }
  }
}


export default roomController;
