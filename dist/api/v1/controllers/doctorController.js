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
exports.doctorFetchUserProfileController = exports.doctorfetchChatController = exports.doctorChatListController = exports.doctorAuthenticateController = exports.doctorCreateController = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const uuid_1 = require("uuid");
const Chat_1 = __importDefault(require("../models/Chat"));
const ChatList_1 = __importDefault(require("../models/ChatList"));
const User_1 = __importDefault(require("../models/User"));
const TaskList_1 = __importDefault(require("../models/TaskList"));
const doctorCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log(req.body);
    console.log("hit");
    // checks if doctor exists
    Doctor_1.default.findOne({ email: email })
        .then((existingDoctor) => {
        if (existingDoctor) {
            console.log(existingDoctor);
            const response = {
                status: "failed",
                message: "Account already exists. Please login",
            };
            res.status(400).json(response);
        }
        else {
            req.body.doctorId = (0, uuid_1.v4)();
            const doctor = new Doctor_1.default(req.body);
            console.log(doctor);
            console.log(req.body);
            doctor.save();
            const response = {
                status: "success",
                message: "Registration successful",
            };
            res.status(200).json(response);
        }
    })
        .catch((err) => {
        const response = {
            status: "failed",
            message: "Registration failed",
        };
        res.status(404).json(response);
    });
});
exports.doctorCreateController = doctorCreateController;
const doctorAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    console.log(req.body);
    try {
        // Find the doctor by email
        const doctor = yield Doctor_1.default.findOne({ email });
        // handling invalid credentials
        if (!doctor) {
            const response = { status: "failed", message: "Invalid email or password" };
            res.status(401).json(response);
        }
        else if (!doctor.verifyPassword(password)) {
            const response = { status: "failed", message: "Invalid email or password" };
            res.status(401).json(response);
        }
        else {
            const _a = doctor.toObject(), { password } = _a, doctorWithoutPassword = __rest(_a, ["password"]);
            const response = { status: "success", message: "Login successful", data: doctorWithoutPassword };
            // Doctor is authenticated
            res.status(200).json(response);
        }
    }
    catch (err) {
        console.log(err);
        // Handle any errors that occur during the authentication process
        const response = { status: "failed", message: "internal error" };
        res.status(500).json(response);
    }
});
exports.doctorAuthenticateController = doctorAuthenticateController;
const doctorChatListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.query;
    const doctorChats = yield ChatList_1.default.find({ userId: doctorId }).lean();
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: doctorChats,
    };
    res.status(200).json(response);
});
exports.doctorChatListController = doctorChatListController;
const doctorfetchChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = {
            status: "success",
            message: "Chats fetched successful",
            data: chat === null || chat === void 0 ? void 0 : chat.messages,
        };
        res.status(200).json(response);
    }
});
exports.doctorfetchChatController = doctorfetchChatController;
const doctorFetchUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        const response = { status: "failed", message: "Insufficient information", };
        res.status(400).json(response);
    }
    else {
        const user = yield User_1.default.findOne({ userId }, { password: 0, _id: 0, subscription: 0, __v: 0 }).lean();
        const userTasks = yield TaskList_1.default.findOne({ userId }, { "tasks.taskName": true }).lean();
        console.log(userTasks);
        const tasksArr = userTasks === null || userTasks === void 0 ? void 0 : userTasks.tasks;
        let tasksListDescription = "";
        tasksArr === null || tasksArr === void 0 ? void 0 : tasksArr.map((task) => {
            tasksListDescription += '"' + task.taskName + '"' + ", ";
        });
        if (tasksListDescription == "") {
            tasksListDescription = "Nothing assigned yet";
        }
        else {
            tasksListDescription =
                tasksListDescription.substring(0, tasksListDescription.length - 2) +
                    " etc...";
        }
        const response = {
            status: "success",
            message: "Login successful",
            data: Object.assign(Object.assign({}, user), { tasks: tasksListDescription }),
        };
        res.status(200).json(response);
    }
});
exports.doctorFetchUserProfileController = doctorFetchUserProfileController;
