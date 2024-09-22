import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import MessageInfo from "../Components/MessageInfo";
import { socket } from "../App";

interface User {
  name: string;
  token: string;
  rooms: string[];
  online: boolean;
}

export interface Message {
  _id: string;
  message: string;
  author: User;
  room: string;
  messageType: string;
}

const Wrapper = styled.div`
  background: url('/background.png');
  max-width: 480px;
  height: 100vh;
  margin: 0 auto;
  overflow: scroll;
  position: relative;
  &::-webkit-scrollbar{
  display:none;
}
`;

const MessageForm = styled.form`
  position: fixed;
  bottom: 0;
  width: 480px;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr 1fr;
`;

const Input = styled.input`
  padding: 15px 5px;
  outline: none;
`;

const Button = styled.button`
  font-size: 15px;
  font-weight: 600;
  background-color: #F7E600;
  border: 1px solid black;
  cursor: pointer;
`;

const MessageList = styled.ul`
  padding: 20px 20px 80px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function ChatContainer({ userName, messageList }: { userName: string, messageList: Message[] }) {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const filterdMessageList = messageList.filter(message => (message.room)?.toString() === id);

  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleExitBtn = () => {
    const confirm = window.confirm('방을 나가시겠습니까?');
    if (confirm) {
      socket.emit('exitRoom', id, userName, (res: { ok: boolean, message: string }) => {
        if (res.ok) {
          console.log(res.message);
          navigate('/roomList');
        }
      })
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', message, id, userName);
    setMessage('');
  }

  useEffect(() => {
    socket.emit('addMemberToRoom', id, userName);
  }, [])

  return (
    <Wrapper>
      <MessageList>
        {filterdMessageList.map((message, idx) =>
          <MessageInfo
            key={message._id}
            message={message}
            idx={idx}
            userName={userName}
            filteredMessageList={filterdMessageList}
          />)}
      </MessageList>
      <MessageForm onSubmit={handleSubmit}>
        <Button style={{ backgroundColor: 'tomato' }} type='button' onClick={handleExitBtn}>방나가기</Button>
        <Input ref={ref} placeholder="메세지를 입력하세요." required value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button style={{ backgroundColor: '#B5C0D0', borderRight: 'none' }} onClick={() => navigate('/roomList')} type="button" >뒤로가기</Button>
        <Button disabled={message === ''} type="submit">전송</Button>
      </MessageForm>
    </Wrapper>
  );
}