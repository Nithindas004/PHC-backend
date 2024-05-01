"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WorkerSchema = new mongoose_1.default.Schema({
    workerId: String,
    name: String,
    username: String,
    mobile: String,
    address: String,
    password: String,
    role: {
        type: String,
        required: true,
        enum: ["worker", "admin"],
    },
});
// Add a method to compare passwords
WorkerSchema.methods.verifyPassword = function (candidatePassword) {
    return candidatePassword === this.password;
};
const Worker = mongoose_1.default.model("Worker", WorkerSchema);
exports.default = Worker;
