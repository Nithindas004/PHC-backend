"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatMessageSchema = new mongoose_1.default.Schema({
    message: String,
    userId: String,
    name: String,
});
const ChatSchema = new mongoose_1.default.Schema({
    chatId: String,
    messages: ChatMessageSchema,
});
const Chat = mongoose_1.default.model("Chat", ChatSchema);
exports.default = Chat;
