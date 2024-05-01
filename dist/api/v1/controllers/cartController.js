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
exports.cartDeleteController = exports.cartFetchController = exports.cartUpdateController = void 0;
const uuid_1 = require("uuid");
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const cartUpdateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, userId } = req.body;
    console.log("hit");
    const cartDataExists = yield Cart_1.default.findOne({ "item.name": data.name });
    if (!cartDataExists) {
        const cartItem = new Cart_1.default({
            cartId: (0, uuid_1.v4)(),
            userId: userId,
            item: new Product_1.default(Object.assign({}, data)),
        });
        cartItem.save();
        res.status(200).json({
            status: "success",
            message: "Item added to cart successfully.",
        });
    }
    else {
        res.status(409).send({
            status: "failed",
            message: "You have already added this item to the cart.",
        });
    }
});
exports.cartUpdateController = cartUpdateController;
const cartFetchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    Cart_1.default.find({ userId: userId })
        .then((cartData) => {
        const response = {
            status: "success",
            message: "Fetched successfully",
            data: cartData,
        };
        res.status(200).json(response);
    })
        .catch((error) => {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    });
});
exports.cartFetchController = cartFetchController;
const cartDeleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.body.data;
    Cart_1.default.deleteOne({ cartId: cartId })
        .then(() => {
        const response = {
            status: "success",
            message: "Removed from cart",
        };
        res.status(200).json(response);
    })
        .catch(() => {
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    });
});
exports.cartDeleteController = cartDeleteController;
