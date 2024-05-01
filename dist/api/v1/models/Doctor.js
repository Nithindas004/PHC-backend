"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DoctorSchema = new mongoose_1.default.Schema({
    doctorId: String,
    name: String,
    password: String,
    mobile: String,
    email: String,
});
// Add a method to compare passwords
DoctorSchema.methods.verifyPassword = function (candidatePassword) {
    return candidatePassword === this.password;
};
const Doctor = mongoose_1.default.model("Doctor", DoctorSchema);
exports.default = Doctor;
