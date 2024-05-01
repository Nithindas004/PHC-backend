"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userId: String,
    name: String,
    password: String,
    mobile: String,
    email: String,
    subscription: Boolean,
    score: Number,
});
// Add a method to compare passwords
UserSchema.methods.verifyPassword = function (candidatePassword) {
    return candidatePassword === this.password;
};
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
