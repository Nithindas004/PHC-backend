"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rejectedOrderSchema = new mongoose_1.default.Schema({
    orderId: String,
    pumpOwnerId: String,
});
const RejectedOrder = mongoose_1.default.model("RejectedOrder", rejectedOrderSchema);
exports.default = RejectedOrder;
