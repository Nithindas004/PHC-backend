"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TasksSchema = new mongoose_1.default.Schema({
    taskId: String,
    taskName: String,
    taskTime: String,
    status: String,
    taskDescription: String,
    image: String,
});
const TaskListSchema = new mongoose_1.default.Schema({
    userId: String,
    tasks: TasksSchema,
    assignedDate: Date,
});
const TaskList = mongoose_1.default.model("TaskList", TaskListSchema);
exports.default = TaskList;
