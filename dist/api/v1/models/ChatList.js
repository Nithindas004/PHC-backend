"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatListSchema = new mongoose_1.default.Schema({
    userId: String,
    chatId: String,
    chatType: String,
    chatName: String,
    recipientId: String,
    recipientPhone: String,
});
const ChatList = mongoose_1.default.model("ChatList", ChatListSchema);
exports.default = ChatList;
