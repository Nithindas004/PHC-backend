"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
const CartModelSchema = new mongoose_1.default.Schema({
    cartId: String,
    userId: String,
    item: Product_1.default.schema,
});
const Cart = mongoose_1.default.model("Cart", CartModelSchema);
exports.default = Cart;
