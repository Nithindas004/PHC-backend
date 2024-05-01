"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    questionId: String,
    question: String,
    options: (Array),
    score: (Array),
});
const Question = mongoose_1.default.model("Question", QuestionSchema);
exports.default = Question;
