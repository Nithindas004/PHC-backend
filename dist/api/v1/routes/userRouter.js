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
exports.userRouter.get("/doctors", userController_1.userFetchDoctorsListController);
exports.userRouter.post("/add-doctors", userController_1.userAddDoctorsToChatController);
exports.userRouter.get("/fetch-chat-messages", userController_1.userFetchChatController);
exports.userRouter.get("/tasks", userController_1.userFetchTaskListController);
exports.userRouter.post("/subscribe", userController_1.userSubscribeController);
exports.userRouter.get("/fetch-analysis-questions", userController_1.userFetchAnalysisQuestionsController);
exports.userRouter.post("/evaluate-analysis", userController_1.userEvaluateAnalysisController);
exports.userRouter.post("/complete-task", userController_1.userCompleteTaskController);
