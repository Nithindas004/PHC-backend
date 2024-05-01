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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pumpOwnerDetailsFetchController = exports.pumpOwnerAcceptOrderController = exports.pumpOwnerRejectOrderController = exports.pumpOwnerOrderFetchController = exports.pumpOwnerAuthenticateController = exports.pumpOwnerCreateController = void 0;
const PumpOwner_1 = __importDefault(require("../models/PumpOwner"));
const uuid_1 = require("uuid");
const Order_1 = __importDefault(require("../models/Order"));
const RejectedOrder_1 = __importDefault(require("../models/RejectedOrder"));
const pumpOwnerCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // checks if user exists
    PumpOwner_1.default.findOne({ email: email })
        .then((existingUser) => {
        if (existingUser) {
            const response = {
                status: "failed",
                message: "Account already exists. Please login",
            };
            res.status(400).json(response);
        }
        else {
            req.body.pumpOwnerId = (0, uuid_1.v4)();
            const pumpOwner = new PumpOwner_1.default(req.body);
            pumpOwner.save();
            const response = {
                status: "success",
                message: "Registered Successfully. Login to continue",
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
exports.pumpOwnerCreateController = pumpOwnerCreateController;
const pumpOwnerAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const pumpOwner = yield PumpOwner_1.default.findOne({ email });
        // handling invalid credentials
        if (!pumpOwner) {
            const response = {
                status: "failed",
                message: "Invalid email or password",
            };
            res.status(401).json(response);
        }
        else if (!pumpOwner.verifyPassword(password)) {
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
                data: pumpOwner,
            };
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
exports.pumpOwnerAuthenticateController = pumpOwnerAuthenticateController;
const pumpOwnerOrderFetchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pumpOwnerId } = req.query;
    try {
        const orders = yield Order_1.default.find().lean();
        const updatedOrders = yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            if (!order.accepted) {
                const rejectedOrder = yield RejectedOrder_1.default.findOne({
                    orderId: order.orderId,
                    pumpOwnerId: pumpOwnerId,
                });
                if (rejectedOrder) {
                    return Object.assign(Object.assign({}, order), { rejected: true });
                }
                else {
                    return Object.assign(Object.assign({}, order), { rejected: false });
                }
            }
            else if (order.acceptedPumpId == pumpOwnerId) {
                return Object.assign(Object.assign({}, order), { rejected: false });
            }
        })));
        const filteredArray = updatedOrders.filter((item) => item !== null && item !== undefined);
        const response = {
            status: "success",
            message: "Fetched order successfully",
            data: filteredArray,
        };
        res.status(200).json(response);
    }
    catch (error) {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.pumpOwnerOrderFetchController = pumpOwnerOrderFetchController;
const pumpOwnerRejectOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pumpOwnerId, orderId } = req.body;
    try {
        const existingOrder = yield RejectedOrder_1.default.findOne({
            orderId,
            pumpOwnerId,
        });
        if (existingOrder) {
            const response = {
                status: "failed",
                message: "Order already rejected",
            };
            res.status(409).json(response);
        }
        else {
            const rejectedOrder = new RejectedOrder_1.default({
                orderId,
                pumpOwnerId,
            });
            yield rejectedOrder.save();
            const response = {
                status: "failed",
                message: "Order rejected successfully",
            };
            res.status(200).json(response);
        }
    }
    catch (error) {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.pumpOwnerRejectOrderController = pumpOwnerRejectOrderController;
const pumpOwnerAcceptOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pumpOwnerId, orderId } = req.body;
    try {
        const updatedOrder = yield Order_1.default.findOneAndUpdate({
            orderId: orderId,
        }, {
            accepted: true,
            acceptedPumpId: pumpOwnerId,
            deliveryAccepted: false,
            status: "DELIVERY",
        }, { new: true }).lean();
        if (!updatedOrder) {
            // Handle case when order is not found
            const response = {
                status: "failed",
                message: "Order not found",
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            status: "success",
            message: "Order updated successfully",
            data: updatedOrder,
        };
        res.status(200).json(response);
    }
    catch (error) {
        // Handle any errors that occur during the update process
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.pumpOwnerAcceptOrderController = pumpOwnerAcceptOrderController;
const pumpOwnerDetailsFetchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pumpOwnerId } = req.query;
    try {
        PumpOwner_1.default.findOne({ pumpOwnerId: pumpOwnerId }).then((owner) => {
            const _a = owner.toObject(), { password } = _a, ownerWithoutPassword = __rest(_a, ["password"]);
            const response = {
                status: "success",
                message: "Details fetched successfully",
                data: ownerWithoutPassword,
            };
            res.status(200).json(response);
        });
    }
    catch (error) {
        // Handle any errors that occur during the authentication process
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.pumpOwnerDetailsFetchController = pumpOwnerDetailsFetchController;
