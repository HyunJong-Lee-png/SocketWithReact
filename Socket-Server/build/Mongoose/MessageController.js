"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("./Message"));
const User_1 = __importDefault(require("./User"));
const Room_1 = __importDefault(require("./Room"));
const messageController = {};
messageController.addMessage = async (type, message, roomId, name) => {
    console.log('메세지추가:');
    try {
        let user = await User_1.default.findOne({ name });
        if (!user) {
            user = await User_1.default.findOne({ token: name });
        }
        const room = await Room_1.default.findById(roomId);
        if (user && room) {
            let content = '';
            if (type === 'welcome') {
                content = `${user.name}님께서 입장하셨습니다!`;
            }
            else if (type === 'normal') {
                content = message;
            }
            else if (type === 'leave') {
                content = `${user.name}님께서 떠나셨습니다!`;
            }
            const newMessage = await Message_1.default.create({
                message: content,
                author: user._id,
                room: room._id,
                messageType: type,
            });
            await newMessage.save();
            console.log('뉴메세지', newMessage);
            return newMessage;
        }
        throw new Error('유저나 방을 찾지 못했습니다.');
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
    }
};
exports.default = messageController;
