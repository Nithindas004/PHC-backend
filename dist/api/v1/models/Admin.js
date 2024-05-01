"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
    name: String,
    username: String,
    password: String,
    role: {
        type: String,
        required: true,
        enum: ["admin"],
        default: "admin"
    },
});
// Add a method to compare passwords
AdminSchema.methods.verifyPassword = function (candidatePassword) {
    return candidatePassword === this.password;
};
const Admin = mongoose_1.default.model("Admin", AdminSchema);
exports.default = Admin;
