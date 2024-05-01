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
exports.userFetchAnalysisQuestionsController = exports.userTaskListController = exports.userChatListController = exports.userAuthenticateController = exports.userCreateController = void 0;
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const userCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // checks if user exists
    User_1.default.findOne({ email: email })
        .then((existingUser) => {
        if (existingUser) {
            const response = {
                status: "failed",
                message: "Account already exists. Please login",
            };
            res.status(400).json(response);
        }
        else {
            req.body.userId = (0, uuid_1.v4)();
            const user = new User_1.default(req.body);
            console.log(user);
            user.save();
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
exports.userCreateController = userCreateController;
const userAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    console.log(req.body);
    try {
        // Find the user by email
        const user = yield User_1.default.findOne({ email });
        // handling invalid credentials
        if (!user) {
            const response = {
                status: "failed",
                message: "Invalid email or password",
            };
            res.status(401).json(response);
        }
        else if (!user.verifyPassword(password)) {
            const response = {
                status: "failed",
                message: "Invalid email or password",
            };
            res.status(401).json(response);
        }
        else {
            const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            const response = {
                status: "success",
                message: "Login successful",
                data: userWithoutPassword,
            };
            // User is authenticated
            res.status(200).json(response);
        }
    }
    catch (err) {
        console.log(err);
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
    console.log(userId);
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: [
            {
                chatId: "ndfansdofijsd89fau9834iun",
                chatName: "Group Alpha",
                chatType: "group",
            },
            {
                chatId: "ndfansdofijsd89fausav4iun",
                chatName: "Doctor",
                chatType: "individual",
            },
            {
                chatId: "ndfansdofijsd89fausav4iun",
                chatName: "Doctor",
                chatType: "individual",
            },
        ],
    };
    res.status(200).json(response);
});
exports.userChatListController = userChatListController;
const userTaskListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    console.log(userId);
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: [
            {
                taskId: "1",
                taskName: "Meditation",
                taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                taskTime: "3 mins",
                status: "PENDING",
                image: "assets/images/meditation.png",
            },
            {
                taskId: "2",
                taskName: "Breathing Exercises",
                taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                taskTime: "5 mins",
                status: "PENDING",
                image: "assets/images/breathing.png",
            },
            {
                taskId: "3",
                taskName: "Reading",
                taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                taskTime: "10 mins",
                status: "COMPLETED",
                image: "assets/images/reading.png",
            },
            {
                taskId: "4",
                taskName: "Physical Exercise",
                taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                taskTime: "15 mins",
                status: "COMPLETED",
                image: "assets/images/exercise.png",
            },
        ],
        date: "29/05/2023",
    };
    res.status(200).json(response);
});
exports.userTaskListController = userTaskListController;
const userFetchAnalysisQuestionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = {
        status: "success",
        message: "chats fetched successfully",
        data: [
            {
                id: 1,
                question: "Flutter is an open-source UI software development kit created by ______",
                options: ["Adarsh", "Google", "Facebook", "Microsoft"],
            },
            {
                id: 2,
                question: "When google release Flutter.",
                options: ["Jun 2017", "Jun 2017", "May 2017", "May 2018"],
                score: [10, 30, 20, 50]
            },
            {
                id: 3,
                question: "A memory location that holds a single letter or number.",
                options: ["Double", "Int", "Char", "Word"],
            },
            {
                id: 4,
                question: "What command do you use to output data to the screen?",
                options: ["Cin", "Count>>", "Cout", "Output>>"],
            },
        ],
        date: "29/05/2023",
    };
    res.status(200).json(response);
});
exports.userFetchAnalysisQuestionsController = userFetchAnalysisQuestionsController;
