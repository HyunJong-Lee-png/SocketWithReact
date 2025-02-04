"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const userController = {};
userController.createUser = async (name, socket) => {
    const user = await User_1.default.findOne({ name });
    if (user) {
        user.token = socket;
        await user.save();
        console.log(user);
        return user;
    }
    const newUser = await User_1.default.create({
        name,
        token: socket,
        online: true
    });
    console.log(newUser);
    return newUser;
};
userController.findUser = async (name) => {
    const user = await User_1.default.findOne({ name });
    if (user) {
        return user;
    }
};
userController.deleteUser = async (name) => {
    //findOne을 두번쓰는 이유는 name으로 못찾으면 socket.id로 한번 더 찾는다.
    const { deletedCount } = await User_1.default.deleteOne({ name, });
    if (!deletedCount) {
        await User_1.default.deleteOne({ token: name });
        return true;
    }
    else {
        return true;
    }
};
exports.default = userController;
