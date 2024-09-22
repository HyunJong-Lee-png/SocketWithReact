import styled from "styled-components";
import { Rooms } from "../App";
import RoomInfo from "../Components/RoomInfo";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  background-color: whitesmoke;
  height: 100vh;
`;

const ChatList = styled.div`
  padding: 27px 15px;
  background-color: white;
  &>span{
    cursor: pointer;
  }
`;

const Ul = styled(motion.ul)`
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  &>a{
    text-decoration: none;
  }
`;

const ulVar = {
  start: {
    opacity: 0,
    height: 0,
  },
  end: {
    opacity: 1,
    height: 'auto',
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  },

}

export default function RoomList({ rooms }: { rooms: Rooms[] }) {
  const [show, setShow] = useState(true);
  return (
    <Wrapper>
      <ChatList ><span onClick={() => setShow(!show)}>채팅 {show ? '▼' : '▲'}</span></ChatList>
      <AnimatePresence>
        {show ?
          <Ul
            variants={ulVar}
            initial='start'
            animate='end'
            exit='start'
          >
            {rooms.map(room => <RoomInfo key={room._id}{...room} />)}
          </Ul>
          : null}
      </AnimatePresence>
    </Wrapper>
  );
}