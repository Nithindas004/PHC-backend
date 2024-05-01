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
exports.workerCreateSurveyController = exports.workerAuthenticateController = exports.workerCreateController = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const Worker_1 = __importDefault(require("../models/Worker"));
const Survey_1 = __importDefault(require("../models/Survey"));
dotenv_1.default.config();
const workerCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, mobile, address } = req.body;
    /**
     * name: String,
     * username: String,
     * mobile: String,
     * address: String,
     * role: ["worker", "user", "admin"]
     */
    if (!username || !password || !name || !mobile || !address) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    Worker_1.default.findOne({ username: username })
        .then((existingWorker) => {
        if (existingWorker) {
            const response = {
                status: "failed",
                message: "Account already exists for this username",
            };
            res.status(400).json(response);
        }
        else {
            req.body.userId = (0, uuid_1.v4)();
            const worker = new Worker_1.default(Object.assign(Object.assign({}, req.body), { role: "worker" }));
            worker.save();
            const response = {
                status: "success",
                message: "Worker created successfully",
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
exports.workerCreateController = workerCreateController;
const workerAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    try {
        const worker = yield Worker_1.default.findOne({ username });
        // handling invalid credentials
        if (!worker) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else if (!worker.verifyPassword(password)) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else {
            const _a = worker.toObject(), { password } = _a, workerWithoutPassword = __rest(_a, ["password"]);
            const response = {
                status: "success",
                message: "Login successful",
                data: workerWithoutPassword,
            };
            res.status(200).json(response);
        }
    }
    catch (err) {
        console.log(err);
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerAuthenticateController = workerAuthenticateController;
const workerCreateSurveyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const survey = yield new Survey_1.default(Object.assign(Object.assign({}, req.body), { workerIds: res.locals.workerId }));
        yield survey
            .save()
            .then((survey) => {
            const response = {
                status: "failed",
                message: "Survey created successfully",
            };
            res.status(201).json(response);
        })
            .catch((err) => {
            console.log(err);
            if (err.name === "ValidationError") {
                const response = {
                    status: "failed",
                    message: "Validation error",
                };
                res.status(400).json(response);
            }
            else {
                const response = {
                    status: "failed",
                    message: "Internal error",
                };
                res.status(500).json(response);
            }
        });
    }
    catch (error) {
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerCreateSurveyController = workerCreateSurveyController;
// export const userChatListController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { userId } = req.query;
//   const userChats = await ChatList.find({ userId }).lean();
//   const response: IResponse = {
//     status: "success",
//     message: "chats fetched successfully",
//     data: userChats,
//   };
//   res.status(200).json(response);
// };
// export const userAddDoctorsToChatController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { userId, doctors } = req.body;
//   if (!userId || !doctors) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     const user = await User.findOne({ userId });
//     doctors.map(async (docId: string) => {
//       console.log(docId);
//       const chatId = uuidv4();
//       const doctor = await Doctor.findOne({ doctorId: docId });
//       const userToDoctorChat = new ChatList({
//         userId,
//         chatId,
//         chatType: "doctor",
//         chatName: doctor?.name,
//         recipientId: docId,
//         recipientPhone: doctor!.mobile,
//       });
//       const doctorToUserChat = new ChatList({
//         userId: docId,
//         chatId,
//         chatType: "patient",
//         chatName: user?.name,
//         recipientId: userId,
//         recipientPhone: user!.mobile,
//       });
//       userToDoctorChat.save();
//       doctorToUserChat.save();
//     });
//     const response: IResponse = {
//       status: "success",
//       message: "added doctor successfully",
//     };
//     res.status(200).json(response);
//   }
// };
// export const userFetchTaskListController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { userId } = req.query;
//   console.log(userId);
//   if (!userId) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     let taskList = await TaskList.findOne(
//       { userId },
//       { _id: 0, __v: 0 }
//     ).lean();
//     const today = formatDateAndSetToIST(new Date());
//     console.log(taskList);
//     if (taskList && !(taskList?.assignedDate === today)) {
//       const tasksArray = [...tasksData];
//       const randomTasks = await getRandomItemsFromArray(tasksArray, 5);
//       taskList = await TaskList.findOneAndUpdate(
//         { userId },
//         { tasks: [...randomTasks], assignedDate: today },
//         { new: true, upsert: true }
//       );
//     }
//     const response: IResponse = {
//       status: "success",
//       message: "chats fetched successfully",
//       data: taskList,
//     };
//     res.status(200).json(response);
//   }
// };
// export const userFetchAnalysisQuestionsController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const questionsDataArray = await getRandomItemsFromArray(
//     questionsData,
//     process.env.QUESTION_COUNT || questionsData.length
//   );
//   const response: IResponse = {
//     status: "success",
//     message: "chats fetched successfully",
//     data: questionsDataArray,
//   };
//   res.status(200).json(response);
// };
// export const userFetchChatController = async (req: Request, res: Response) => {
//   const { chatId } = req.query;
//   if (!chatId) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     const chat = await Chat.findOne({ chatId }).lean();
//     console.log(chat);
//     const response: IResponse = {
//       status: "success",
//       message: "Login successful",
//       data: chat ? chat.messages : [],
//     };
//     res.status(200).json(response);
//   }
// };
// export const userFetchDoctorsListController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { userId } = req.query;
//   // console.log(userId);
//   if (!userId) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     const doctors = await Doctor.find({}, { password: 0, __v: 0, _id: 0 });
//     const userChats = await ChatList.find({
//       userId,
//       chatType: "doctor",
//     }).lean();
//     const existingDoctorChatsIds = await Promise.all(
//       userChats.map((chat) => {
//         return chat.recipientId;
//       })
//     );
//     console.log(existingDoctorChatsIds);
//     const doctorsList = await Promise.all(
//       doctors.map((doc) => {
//         if (!existingDoctorChatsIds.includes(doc.doctorId)) {
//           return doc;
//         } else return null;
//       })
//     );
//     const filteredDoctorsList = doctorsList.filter((doc) => {
//       if (doc !== null) return doc;
//     });
//     const response: IResponse = {
//       status: "success",
//       message: "Fetched doctors successfully",
//       data: filteredDoctorsList,
//     };
//     res.status(200).json(response);
//   }
// };
// export const userSubscribeController = async (req: Request, res: Response) => {
//   const { userId } = req.body;
//   if (!userId) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     await User.findOneAndUpdate({ userId }, { subscription: true });
//     const user = await User.findOne({ userId }, { password: 0 });
//     console.log(user);
//     const { password, ...userData } = user!.toObject();
//     const response: IResponse = {
//       status: "success",
//       message: "subscribed successfully",
//       data: userData,
//     };
//     res.status(200).json(response);
//   }
// };
// export const userEvaluateAnalysisController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { userId, score } = req.body;
//   if (!userId || score == null || score == undefined) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     const user = await User.findOneAndUpdate({ userId }, { score });
//     const { password, ...userData } = user!.toObject();
//     if (score < 81) {
//       const tasksArray = [...tasksData];
//       const randomTasks = await getRandomItemsFromArray(tasksArray, 5);
//       const date = await formatDateAndSetToIST(new Date());
//       const taskList = await TaskList.findOne({ userId });
//       if (taskList) {
//         await TaskList.findOneAndUpdate(
//           { userId },
//           { tasks: [...randomTasks], assignedDate: date },
//           { new: true, upsert: true }
//         );
//       } else {
//         const taskListNew = await new TaskList({
//           userId,
//           tasks: [...randomTasks],
//           assignedDate: date,
//         });
//         taskListNew.save();
//       }
//     } else {
//       const taskList = await TaskList.findOne({ userId });
//       if (taskList) {
//         await TaskList.deleteOne({ userId });
//       }
//     }
//     const response: IResponse = {
//       status: "success",
//       message: "analysis completed",
//       data: userData,
//     };
//     res.status(200).json(response);
//   }
// };
// export const userCompleteTaskController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { userId, taskId } = req.body;
//   console.log("hit");
//   if (!userId || !taskId) {
//     const response: IResponse = {
//       status: "failed",
//       message: "Insufficient information",
//     };
//     res.status(400).json(response);
//   } else {
//     await TaskList.updateOne(
//       { userId: userId, "tasks.taskId": taskId },
//       { $set: { "tasks.$.status": "COMPLETED" } }
//     )
//       .then(() => {
//         const response: IResponse = {
//           status: "success",
//           message: "updated task successfully",
//         };
//         res.status(200).json(response);
//       })
//       .catch(() => {
//         const response: IResponse = {
//           status: "failed",
//           message: "internal error",
//         };
//         res.status(500).json(response);
//       });
//   }
// };
