import styled from "styled-components";
import { Rooms } from "../App";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Li = styled(motion.li)`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 10px;
  background-color: white;
  cursor: pointer;
`;

const RoomDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Image = styled.img`
  width: 50px;
  border-radius: 20px;
`;

const RoomName = styled.span`
  font-size: 16px;
  color:black;
`;

const MemberCount = styled.div`
  background-color: tomato;
  border-radius: 50%;
  color: white;
  place-self: center;
  padding: 5px 8px;
`;

const liVar = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 0.6,
  },
}

export default function RoomInfo({ _id, roomName, members }: Rooms) {
  return (

    <Link to={'/roomList/' + _id}>
      <Li
        variants={liVar}
        whileHover={{
          opacity: 1,
          backgroundColor: 'rgba(235,235,235)',
          transition: {
            duration: 0.7
          }
        }}
      >
        <RoomDetail>
          <Image src="/profile.jpeg" />
          <RoomName>{roomName}</RoomName>
        </RoomDetail>
        <MemberCount>{members?.length}</MemberCount>
      </Li>
    </Link>
  );

}