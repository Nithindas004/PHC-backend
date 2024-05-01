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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderGenerateController = exports.orderFetchController = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const uuid_1 = require("uuid");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const orderFetchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    console.log(userId);
    console.log("hit order");
    const orders = yield Order_1.default.find({ userId: userId });
    res.status(200).json(orders);
});
exports.orderFetchController = orderFetchController;
const orderGenerateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartData, position, userId } = req.body;
    console.log("hit");
    try {
        cartData.map((data) => {
            const orderItem = new Order_1.default({
                userId: userId,
                orderId: (0, uuid_1.v4)(),
                item: new Product_1.default(Object.assign({}, data.item)),
                status: "PENDING",
                deliveryLocation: position,
                accepted: false,
                accetedPumpId: "",
            });
            orderItem.save();
        });
        yield Cart_1.default.deleteMany({ userId: userId });
        res.status(200).json({
            status: "success",
            message: "Order placed successfully.",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal error.",
        });
    }
});
exports.orderGenerateController = orderGenerateController;
