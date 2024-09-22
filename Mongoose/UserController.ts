import { Document } from "mongoose";
import User from "./User.ts";

interface UserController {
  createUser(name: string, socket: string): Promise<Document>
  findUser(name: string): Promise<Document | undefined>
  deleteUser(name: string): Promise<boolean>
}

const userController = {} as UserController;

userController.createUser = async (name, socket) => {
  const user = await User.findOne({ name });
  if (user) {
    user.token = socket;
    await user.save();
    console.log(user);
    return user;
  }
  const newUser = await User.create({
    name,
    token: socket,
    online: true
  });
  console.log(newUser);
  return newUser;
};

userController.findUser = async (name) => {
  const user = await User.findOne({ name });
  if (user) {
    return user;
  }
};

userController.deleteUser = async (name) => {
  //findOne을 두번쓰는 이유는 name으로 못찾으면 socket.id로 한번 더 찾는다.
  const { deletedCount } = await User.deleteOne({ name, });
  if (!deletedCount) {
    await User.deleteOne({ token: name });
    return true;
  } else {
    return true;
  }
}

export default userController;