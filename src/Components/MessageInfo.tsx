import styled from "styled-components";
import { Message } from "../Router/ChatContainer";

const MessageContainer = styled.li`
    font-size: 14px;
    display: flex;
    gap: 10px;
    align-items: center;
`;

const Profile = styled.div<{ visibility: string, display: string }>`
  visibility: ${(props) => props.visibility};
  display: ${(props) => props.display};
  flex-direction: column;
  gap: 5px;
  align-items: center;
  color:#3C3D37;
  font-weight: 600;
  width: 50px;
`;

const Img = styled.img`
  width: 30px;
  border-radius: 50%;
`;

const MessageCompo = styled.div`
  border-radius: 8px;
  padding: 8px;
  &.welcome,&.bye{
    background-color: #B4B4B8;
    width: 50%;
    margin: 0 auto;
    text-align: center;
    color:#F2EFE5;
    border-radius: 25px;
  };
  &.send{
    background-color: #FFEB55;
    margin-left:auto;
    max-width: 50%;
  };
  &.receive{
    background-color: white;
    margin-right: auto;
    max-width: 50%;
  }
`;

export default function MessageInfo({ message, idx, userName, filteredMessageList }
  : { message: Message, idx: number, userName: string, filteredMessageList: Message[] }) {

  return (
    <MessageContainer>
      <Profile
        visibility={
          message.author.name === userName ? 'hidden'
            : (filteredMessageList[idx - 1]?.messageType === 'welcome' || filteredMessageList[idx - 1]?.messageType === 'leave') ? 'visible'
              : filteredMessageList[idx - 1]?.author.name === message.author.name ? 'hidden' : 'visible'
        }
        display={message.messageType === 'welcome' || message.messageType === 'leave' ? 'none' : 'flex'}>
        <Img src='/profile.jpeg' />
        <span>{message.author.name}</span>
      </Profile>
      <MessageCompo className={message.messageType === 'welcome' ? 'welcome' : message.messageType === 'leave' ? 'bye'
        : message.author.name === userName ? 'send' : 'receive'}>
        {message.message}
      </MessageCompo>
    </MessageContainer>
  );
}