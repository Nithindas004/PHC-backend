"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCompleteTaskController = exports.userEvaluateAnalysisController = exports.userSubscribeController = exports.userFetchDoctorsListController = exports.userFetchChatController = exports.userFetchAnalysisQuestionsController = exports.userFetchTaskListController = exports.userAddDoctorsToChatController = exports.userChatListController = exports.userAuthenticateController = exports.userCreateController = void 0;
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const ChatList_1 = __importDefault(require("../models/ChatList"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const questionsData_1 = require("../utils/data/questionsData");
const tasksData_1 = require("../utils/data/tasksData");
const getRandomItemsFromArray_1 = require("../utils/getRandomItemsFromArray");
const TaskList_1 = __importDefault(require("../models/TaskList"));
const formatDateAndSetToIST_1 = require("../utils/formatDateAndSetToIST");
dotenv_1.default.config();
const userCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // checks if user exists
    User_1.default.findOne({ email: email })
        .then((existingUser) => {
        if (existingUser) {
            const response = { status: "failed", message: "Account already exists. Please login" };
            res.status(400).json(response);
        }
        else {
            req.body.userId = (0, uuid_1.v4)();
            const user = new User_1.default(Object.assign(Object.assign({}, req.body), { subscription: false, score: -1 }));
            console.log(user);
            user.save();
            const chatListForUserInit = new ChatList_1.default({
                userId: req.body.userId,
                chatId: process.env.GROUP_CHAT_ID,
                chatType: "group",
                chatName: "Global Chat",
                recipientId: "",
                recipientPhone: "",
            });
            chatListForUserInit.save();
            const response = { status: "success", message: "Registration successful" };
            res.status(200).json(response);
        }
    })
        .catch((err) => {
        const response = { status: "failed", message: "Registration failed" };
        res.status(404).json(response);
    });
});
exports.userCreateController = userCreateController;
const userAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield User_1.default.findOne({ email });
        // handling invalid credentials
        if (!user) {
            const response = { status: "failed", message: "Invalid email or password" };
            res.status(401).json(response);
        }
        else if (!user.verifyPassword(password)) {
            const response = { status: "failed", message: "Invalid email or password" };
            res.status(401).json(response);
        }
        else {
            const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            const response = { status: "success", message: "Login successful", data: userWithoutPassword };
            // User is authenticated
            res.status(200).json(response);
        }
    }
    catch (err) {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.userAuthenticateController = userAuthenticateController;
const userChatListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const userChats = yield ChatList_1.default.find({ userId }).lean();
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: userChats,
    };
    res.status(200).json(response);
});
exports.userChatListController = userChatListController;
const userAddDoctorsToChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, doctors } = req.body;
    if (!userId || !doctors) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        const user = yield User_1.default.findOne({ userId });
        doctors.map((docId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(docId);
            const chatId = (0, uuid_1.v4)();
            const doctor = yield Doctor_1.default.findOne({ doctorId: docId });
            const userToDoctorChat = new ChatList_1.default({
                userId,
                chatId,
                chatType: "doctor",
                chatName: doctor === null || doctor === void 0 ? void 0 : doctor.name,
                recipientId: docId,
                recipientPhone: doctor.mobile,
            });
            const doctorToUserChat = new ChatList_1.default({ userId: docId, chatId, chatType: "patient", chatName: user === null || user === void 0 ? void 0 : user.name,
                recipientId: userId, recipientPhone: user.mobile, });
            userToDoctorChat.save();
            doctorToUserChat.save();
        }));
        const response = { status: "success", message: "added doctor successfully" };
        res.status(200).json(response);
    }
});
exports.userAddDoctorsToChatController = userAddDoctorsToChatController;
const userFetchTaskListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    console.log(userId);
    if (!userId) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        let taskList = yield TaskList_1.default.findOne({ userId }, { _id: 0, __v: 0 }).lean();
        const today = (0, formatDateAndSetToIST_1.formatDateAndSetToIST)(new Date());
        console.log(taskList);
        if (taskList && !((taskList === null || taskList === void 0 ? void 0 : taskList.assignedDate) === today)) {
            const tasksArray = [...tasksData_1.tasksData];
            const randomTasks = yield (0, getRandomItemsFromArray_1.getRandomItemsFromArray)(tasksArray, 5);
            taskList = yield TaskList_1.default.findOneAndUpdate({ userId }, { tasks: [...randomTasks], assignedDate: today }, { new: true, upsert: true });
        }
        const response = {
            status: "success",
            message: "chats fetched successfully",
            data: taskList,
        };
        res.status(200).json(response);
    }
});
exports.userFetchTaskListController = userFetchTaskListController;
const userFetchAnalysisQuestionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionsDataArray = yield (0, getRandomItemsFromArray_1.getRandomItemsFromArray)(questionsData_1.questionsData, process.env.QUESTION_COUNT || questionsData_1.questionsData.length);
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: questionsDataArray,
    };
    res.status(200).json(response);
});
exports.userFetchAnalysisQuestionsController = userFetchAnalysisQuestionsController;
const userFetchChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.query;
    if (!chatId) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        const chat = yield Chat_1.default.findOne({ chatId }).lean();
        console.log(chat);
        const response = {
            status: "success",
            message: "Login successful",
            data: chat ? chat.messages : [],
        };
        res.status(200).json(response);
    }
});
exports.userFetchChatController = userFetchChatController;
const userFetchDoctorsListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        const response = { status: "failed", message: "Insufficient information" };
        res.status(400).json(response);
    }
    else {
        const doctors = yield Doctor_1.default.find({}, { password: 0, __v: 0, _id: 0 });
        const userChats = yield ChatList_1.default.find({
            userId,
            chatType: "doctor",
        }).lean();
        const existingDoctorChatsIds = yield Promise.all(userChats.map((chat) => {
            return chat.recipientId;
        }));
        console.log(existingDoctorChatsIds);
        const doctorsList = yield Promise.all(doctors.map((doc) => {
            if (!existingDoctorChatsIds.includes(doc.doctorId)) {
                return doc;
            }
            else
                return null;
        }));
        const filteredDoctorsList = doctorsList.filter((doc) => {
            if (doc !== null)
                return doc;
        });
        const response = {
            status: "success",
            message: "Fetched doctors successfully",
            data: filteredDoctorsList,
        };
        res.status(200).json(response);
    }
});
exports.userFetchDoctorsListController = userFetchDoctorsListController;
const userSubscribeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        yield User_1.default.findOneAndUpdate({ userId }, { subscription: true });
        const user = yield User_1.default.findOne({ userId }, { password: 0 });
        console.log(user);
        const _b = user.toObject(), { password } = _b, userData = __rest(_b, ["password"]);
        const response = {
            status: "success",
            message: "subscribed successfully",
            data: userData,
        };
        res.status(200).json(response);
    }
});
exports.userSubscribeController = userSubscribeController;
const userEvaluateAnalysisController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, score } = req.body;
    if (!userId || score == null || score == undefined) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        const user = yield User_1.default.findOneAndUpdate({ userId }, { score });
        const _c = user.toObject(), { password } = _c, userData = __rest(_c, ["password"]);
        if (score < 81) {
            const tasksArray = [...tasksData_1.tasksData];
            const randomTasks = yield (0, getRandomItemsFromArray_1.getRandomItemsFromArray)(tasksArray, 5);
            const date = yield (0, formatDateAndSetToIST_1.formatDateAndSetToIST)(new Date());
            const taskList = yield TaskList_1.default.findOne({ userId });
            if (taskList) {
                yield TaskList_1.default.findOneAndUpdate({ userId }, { tasks: [...randomTasks], assignedDate: date }, { new: true, upsert: true });
            }
            else {
                const taskListNew = yield new TaskList_1.default({
                    userId,
                    tasks: [...randomTasks],
                    assignedDate: date,
                });
                taskListNew.save();
            }
        }
        else {
            const taskList = yield TaskList_1.default.findOne({ userId });
            if (taskList) {
                yield TaskList_1.default.deleteOne({ userId });
            }
        }
        const response = {
            status: "success",
            message: "analysis completed",
            data: userData,
        };
        res.status(200).json(response);
    }
});
exports.userEvaluateAnalysisController = userEvaluateAnalysisController;
const userCompleteTaskController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, taskId } = req.body;
    console.log("hit");
    if (!userId || !taskId) {
        const response = {
            status: "failed",
            message: "Insufficient information",
        };
        res.status(400).json(response);
    }
    else {
        yield TaskList_1.default.updateOne({ userId: userId, "tasks.taskId": taskId }, { $set: { "tasks.$.status": "COMPLETED" } })
            .then(() => {
            const response = {
                status: "success",
                message: "updated task successfully",
            };
            res.status(200).json(response);
        })
            .catch(() => {
            const response = {
                status: "failed",
                message: "internal error",
            };
            res.status(500).json(response);
        });
    }
});
exports.userCompleteTaskController = userCompleteTaskController;
