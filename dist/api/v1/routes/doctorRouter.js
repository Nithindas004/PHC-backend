"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../controllers/doctorController");
// for routing doctor APIs
exports.doctorRouter = express_1.default.Router();
// doctor routes
exports.doctorRouter.post("/register", doctorController_1.doctorCreateController);
exports.doctorRouter.post("/login", doctorController_1.doctorAuthenticateController);
exports.doctorRouter.get("/chats", doctorController_1.doctorChatListController);
exports.doctorRouter.get("/fetch-chat-messages", doctorController_1.doctorfetchChatController);
exports.doctorRouter.get("/fetch-user-profile", doctorController_1.doctorFetchUserProfileController);
