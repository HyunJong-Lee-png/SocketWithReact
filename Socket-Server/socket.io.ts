import { Server } from "socket.io";
import userController from "../Mongoose/UserController.ts";
import roomController from "../Mongoose/RoomController.ts";
import messageController from "../Mongoose/MessageController.ts";

export default function socketIO(socketServer: Server) {
  console.log(1)
  socketServer.on('connection', (socket) => {
    console.log('클라이언트와 연결이 성공했습니다.', 'socket.id:', socket.id);

    //앱이 실행될 때 DB에 3개의 방 생성
    socket.on('createRooms', async (cb) => {
      const newRooms = await roomController.createRooms();
      if (newRooms.length) {
        cb({ ok: true, data: newRooms })
      }
    })

    //유저의 이름을 입력받으면 유저 다큐먼트 생성
    socket.on('welcome', async (name, cb) => {
      const newUser = await userController.createUser(name, socket.id);
      if (newUser) {
        cb({ ok: true, message: '새로운 유저가 생성됐습니다.' });
      }
    });

    //유저가 특정 방에 참가하면 룸에 해당 멤버 추가
    socket.on('addMemberToRoom', async (roomId, userName) => {
      //뒤로가기 후 다시 방에 입장하면 그대로 리턴
      if (socket.rooms.has(roomId)) return;
      console.log(1)
      const addedMemberRoom = await roomController.addMember(roomId, userName);
      //멤버가 정상적으로 룸에 등록됐다면
      console.log(2)
      if (addedMemberRoom) {
        console.log(3)
        socket.join(roomId);
        const user = await userController.findUser(userName);
        console.log(4)
        if (user) {
          const welcomeMessage = await messageController.addMessage('welcome', '', roomId, userName);
          console.log(5)
          if (welcomeMessage) {
            console.log(6)
            const populatedMsg = await welcomeMessage.populate('author');
            console.log(populatedMsg, '소켓조인', socket.rooms);
            socketServer.to(roomId).emit('updateMessage', populatedMsg);
          }
          socketServer.emit('updateRoom', addedMemberRoom);
        }
      }
    });


    socket.on('message', async (message, roomId, userName) => {
      const newMessage = await messageController.addMessage('normal', message, roomId, userName);
      const populatedMsg = await newMessage?.populate('author');
      socketServer.to(roomId).emit('updateMessage', populatedMsg);
    });

    socket.on('exitRoom', async (roomId, userName, cb) => {
      socket.leave(roomId);
      const removedMemberRoom = await roomController.removeMember(roomId, userName);
      const byeMessage = await messageController.addMessage('leave', '', roomId, userName);
      if (removedMemberRoom && byeMessage) {
        console.log('멤버랑 메세지삭제완료')
        //모든 유저에게 나간 유저에 관한 방 목록 업데이트
        socketServer.emit('updateRoom', removedMemberRoom);
        //나간 유저에게는 해당 방에서의 클라이언트 측 메세지리스트 삭제(ex:1번유저가 1,2,3번방 중 1번방을 나갔으면 1번방에 있던 메세지리스트만 삭제)
        socket.emit('updateMessage', roomId);
        //~~유저가 떠나갔습니다. 메세지 전송
        socket.to(roomId).emit('updateMessage', byeMessage)
        cb({ ok: 'true', message: '멤버가 제거됐습니다.' });
      }
    })

    socket.on('disconnecting', async (reason) => {
      console.log('연결해제이유:', reason);
      socket.rooms.delete(socket.id);

      //forEach문 사용x
      //대신 for...of문을 사용 or 밑의 Promse.all+map함수 사용
      //   for( const roomId of socket.rooms){
      //   const byeMessage = await messageController.addMessage('leave', '', roomId, socket.id);
      //   const removedMemberRoom = await roomController.removeMember(roomId, socket.id);
      //   console.log('새로고침할떄', 'byeMessage:', byeMessage, 'romvedMeberRoom:', removedMemberRoom);
      //   socket.to(roomId).emit('updateMessage', byeMessage);
      //   socket.to(roomId).emit('updateRoom', removedMemberRoom);
      // }

      const roomPromises = Array.from(socket.rooms).map(async (roomId) => {
        const byeMessage = await messageController.addMessage('leave', '', roomId, socket.id);
        const removedMemberRoom = await roomController.removeMember(roomId, socket.id);
        console.log('새로고침할떄', 'byeMessage:', byeMessage, 'romvedMeberRoom:', removedMemberRoom);
        socket.to(roomId).emit('updateMessage', byeMessage);
        socket.to(roomId).emit('updateRoom', removedMemberRoom);
      });

      await Promise.all(roomPromises);
      await userController.deleteUser(socket.id);

    })

  });
}