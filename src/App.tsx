import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom"

import Home from "./Router/Home";
import RoomList from "./Router/RoomList";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import ChatContainer, { Message } from "./Router/ChatContainer";
import io from 'socket.io-client';

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
  box-sizing:border-box;
  }
`;

export interface User {
  name?: string;
  rooms?: string[],
  online?: boolean,
}

export interface Rooms {
  _id: string;
  roomName?: string;
  members?: string[],
}

export const socket = io('https://socketio-kakaotalk.onrender.com');

function App() {
  const [userName, setUserName] = useState<string>('');
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [messageList, setMessageList] = useState<Message[]>([]);
  console.log('메세지리스트:', messageList);


  useEffect(() => {

    socket.emit('createRooms', (res: { ok: boolean, data: Rooms[] }) => {
      if (res?.ok) {
        setRooms(res.data);
      }
    });

    socket.on('updateRoom', (room: Rooms) => {
      setRooms((prev) => {
        return prev.map(item => item._id === room._id ? room : item);
      })
    });

    socket.on('updateMessage', (message: Message | string) => {
      console.log(messageList)
      if (typeof message === 'string') {
        setMessageList((prev) => prev.filter(messages => messages.room !== message));
        return;
      } else {
        setMessageList((prev) => [...prev, message]);
      }
    });
  }, [])

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Home setUserName={setUserName} />} />
        <Route path="/roomList" element={<RoomList rooms={rooms} />} />
        <Route path="/roomList/:id" element={<ChatContainer userName={userName} messageList={messageList} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
