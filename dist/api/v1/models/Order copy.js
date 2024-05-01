"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
const LocationSchema = new mongoose_1.default.Schema({
    latitude: Number,
    longitude: Number,
});
const DeliveryPartnerSchema = new mongoose_1.default.Schema({
    deliveryPartnerId: String,
    deliveryTime: String,
    deliveryPartnerMobileNumber: String,
    deliveryPartnerLocation: LocationSchema,
});
const OrderSchema = new mongoose_1.default.Schema({
    orderId: String,
    userId: String,
    item: Product_1.default.schema,
    status: String,
    deliveryPartner: DeliveryPartnerSchema,
    deliveryLocation: LocationSchema,
});
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
