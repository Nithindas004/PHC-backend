"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PumpOwnerSchema = new mongoose_1.default.Schema({
    pumpOwnerId: String,
    name: String,
    email: String,
    password: String,
    location: {},
    mobile: String,
    locationName: String,
});
// Add a method to compare passwords
PumpOwnerSchema.methods.verifyPassword = function (candidatePassword) {
    return candidatePassword === this.password;
};
const PumpOwner = mongoose_1.default.model("PumpOwner", PumpOwnerSchema);
exports.default = PumpOwner;
