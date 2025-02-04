"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("./Room"));
const User_1 = __importDefault(require("./User"));
const roomController = {};
roomController.createRooms = async () => {
    const alreadyRooms = await Room_1.default.find();
    if (alreadyRooms.length)
        return alreadyRooms;
    const rooms = await Room_1.default.insertMany([
        {
            roomName: 'HTML 방',
            members: [],
        }, {
            roomName: 'CSS 방',
            members: [],
        }, {
            roomName: 'JAVASCRIPT 방',
            members: [],
        }
    ]);
    return rooms;
};
roomController.addMember = async (roomId, name) => {
    try {
        const user = await User_1.default.findOne({ name });
        console.log('addmember:');
        if (user) {
            const room = await Room_1.default.findById(roomId);
            if (room) {
                if (!room.members.includes(user._id)) {
                    room.members.push(user._id);
                    await room.save();
                    return room;
                }
                else
                    return room;
            }
        }
    }
    catch (e) {
        console.log(e.message);
    }
};
roomController.removeMember = async (roomId, name) => {
    const room = await Room_1.default.findById(roomId);
    if (room) {
        let user = await User_1.default.findOne({ name });
        if (!user) {
            const a = await User_1.default.find({});
            user = await User_1.default.findOne({ token: name });
        }
        if (user) {
            const idx = room.members.findIndex(member => member.toString() === (user._id).toString());
            room.members.splice(idx, 1);
            await room.save();
            return room;
        }
    }
};
exports.default = roomController;
