import { Document } from "mongoose";
import Message from "./Message";
import User from "./User";
import Room from "./Room";

interface MessageController {
  addMessage(type: string, message: string, roomId: string, name: string): Promise<Document | undefined>;
}

const messageController: MessageController = {} as MessageController;

messageController.addMessage = async (type, message, roomId, name) => {
  console.log('메세지추가:')
  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = await User.findOne({ token: name });
    }
    const room = await Room.findById(roomId);
    if (user && room) {
      let content = '';
      if (type === 'welcome') {
        content = `${user.name}님께서 입장하셨습니다!`;
      } else if (type === 'normal') {
        content = message;
      } else if (type === 'leave') {
        content = `${user.name}님께서 떠나셨습니다!`;
      }
      const newMessage = await Message.create({
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
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};


export default messageController;