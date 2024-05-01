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
exports.deliveryBoyOrderAcceptController = exports.deliveryBoyOrderCompleteController = exports.deliveryBoyOrdersFetchController = exports.deliveryBoyAuthenticateController = exports.deliveryBoyCreateController = void 0;
const DeliveryBoy_1 = __importDefault(require("../models/DeliveryBoy"));
const uuid_1 = require("uuid");
const Order_1 = __importDefault(require("../models/Order"));
const PumpOwner_1 = __importDefault(require("../models/PumpOwner"));
const deliveryBoyCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log(req.body);
    // checks if user exists
    DeliveryBoy_1.default.findOne({ email: email })
        .then((existingUser) => {
        if (existingUser) {
            const response = {
                status: "failed",
                message: "Account already exists. Please login",
            };
            res.status(400).json(response);
        }
        else {
            req.body.deliveryBoyId = (0, uuid_1.v4)();
            const deliveryBoy = new DeliveryBoy_1.default(req.body);
            deliveryBoy.save();
            const response = {
                status: "success",
                message: "Registration successful",
            };
            res.status(200).json(response);
        }
    })
        .catch((err) => {
        const response = {
            status: "failed",
            message: "Registration failed",
        };
        res.status(404).json(response);
    });
});
exports.deliveryBoyCreateController = deliveryBoyCreateController;
const deliveryBoyAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const deliveryBoy = yield DeliveryBoy_1.default.findOne({ email });
        // handling invalid credentials
        if (!deliveryBoy || !deliveryBoy.verifyPassword(password)) {
            const response = {
                status: "failed",
                message: "Invalid email or password",
            };
            res.status(401).json(response);
        }
        else {
            const response = {
                status: "success",
                message: "Login successful",
                data: deliveryBoy,
            };
            console.log("hit");
            // User is authenticated
            res.status(200).json(response);
        }
    }
    catch (err) {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.deliveryBoyAuthenticateController = deliveryBoyAuthenticateController;
const deliveryBoyOrdersFetchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deliveryBoyId } = req.query;
    console.log("hit");
    console.log(deliveryBoyId);
    try {
        const ordersForDelivery = yield Order_1.default.find({
            status: "DELIVERY",
        }).lean();
        let acceptedFlag = false;
        const ordersFinal = yield Promise.all(ordersForDelivery.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            const pumpOwner = yield PumpOwner_1.default.findOne({
                pumpOwnerId: order.acceptedPumpId,
            });
            if (!order.deliveryAccepted) {
                return Object.assign(Object.assign({}, order), { pickupLocation: pumpOwner === null || pumpOwner === void 0 ? void 0 : pumpOwner.location, acceptedByMe: false });
            }
            else if (order.acceptedDeliveryBoyId == deliveryBoyId) {
                acceptedFlag = true;
                return Object.assign(Object.assign({}, order), { pickupLocation: pumpOwner === null || pumpOwner === void 0 ? void 0 : pumpOwner.location, acceptedByMe: true });
            }
            else {
                return;
            }
        })));
        const filteredArray = ordersFinal.filter((item) => item !== null && item !== undefined);
        console.log(filteredArray);
        res.json({ data: filteredArray, acceptedFlag });
    }
    catch (error) {
        console.error(error);
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.deliveryBoyOrdersFetchController = deliveryBoyOrdersFetchController;
const deliveryBoyOrderCompleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body.data;
    const updatedOrder = yield Order_1.default.findOneAndUpdate({
        orderId: orderId,
    }, {
        status: "COMPLETED",
    }, { new: true }).lean();
    res.status(200).send("done");
});
exports.deliveryBoyOrderCompleteController = deliveryBoyOrderCompleteController;
const deliveryBoyOrderAcceptController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deliveryBoyId, orderId, deliveryPartnerLocation, deliveryTime } = req.body.data;
    try {
        const deliveryBoy = yield DeliveryBoy_1.default.findOne({
            deliveryBoyId: deliveryBoyId,
        });
        const updatedOrder = yield Order_1.default.findOneAndUpdate({
            orderId: orderId,
        }, {
            deliveryAccepted: true,
            acceptedDeliveryBoyId: deliveryBoyId,
            status: "DELIVERY",
            deliveryPartner: {
                deliveryPartnerId: deliveryBoyId,
                deliveryTime: deliveryTime,
                deliveryPartnerMobileNumber: deliveryBoy === null || deliveryBoy === void 0 ? void 0 : deliveryBoy.mobile,
                deliveryPartnerLocation: deliveryPartnerLocation,
            },
        }, { new: true }).lean();
        if (!updatedOrder) {
            console.log("cant accept");
            // Handle case when order is not found
            const response = {
                status: "failed",
                message: "Cannot accept order",
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            status: "success",
            message: "Order accepted successfully",
            data: updatedOrder,
        };
        console.log("ok");
        res.status(200).json(response);
    }
    catch (error) {
        // Handle any errors that occur during the update process
        const response = {
            status: "failed",
            message: "Internal error",
        };
        console.log(error);
        res.status(500).json(response);
    }
});
exports.deliveryBoyOrderAcceptController = deliveryBoyOrderAcceptController;
