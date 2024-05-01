"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
// for routing user APIs
exports.userRouter = express_1.default.Router();
// user routes
exports.userRouter.post("/register", userController_1.userCreateController);
exports.userRouter.post("/login", userController_1.userAuthenticateController);
exports.userRouter.get("/chats", userController_1.userChatListController);
exports.userRouter.get("/tasks", userController_1.userTaskListController);
exports.userRouter.get("/fetch-analysis-questions", userController_1.userFetchAnalysisQuestionsController);
