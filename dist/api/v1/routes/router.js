"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRouter = exports.pumpRouter = exports.commonRouter = exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const defaultController_1 = require("../controllers/defaultController");
const orderController_1 = require("../controllers/orderController");
const cartController_1 = require("../controllers/cartController");
const userController_1 = require("../controllers/userController");
const pumpController_1 = require("../controllers/pumpController");
const deliveryController_1 = require("../controllers/deliveryController");
// for routing user APIs
exports.userRouter = express_1.default.Router();
// for routing common APIs
exports.commonRouter = express_1.default.Router();
// for routing pump APIs
exports.pumpRouter = express_1.default.Router();
// for routing deliveryBoy APIs
exports.deliveryRouter = express_1.default.Router();
// user routes
exports.userRouter.get("/order", orderController_1.orderFetchController);
exports.userRouter.post("/order", orderController_1.orderGenerateController);
exports.userRouter.get("/cart", cartController_1.cartFetchController);
exports.userRouter.post("/cart", cartController_1.cartUpdateController);
exports.userRouter.delete("/cart", cartController_1.cartDeleteController);
exports.userRouter.post("/create-user", userController_1.userCreateController);
exports.userRouter.post("/login", userController_1.userAuthenticateController);
// pump routes
exports.pumpRouter.post("/create-pump-owner", pumpController_1.pumpOwnerCreateController);
exports.pumpRouter.post("/pump-owner-login", pumpController_1.pumpOwnerAuthenticateController);
exports.pumpRouter.get("/order", pumpController_1.pumpOwnerOrderFetchController);
exports.pumpRouter.post("/reject-order", pumpController_1.pumpOwnerRejectOrderController);
exports.pumpRouter.post("/accept-order", pumpController_1.pumpOwnerAcceptOrderController);
exports.pumpRouter.get("/pump-details", pumpController_1.pumpOwnerDetailsFetchController); // 917fbe77-2240-4318-ac02-4cf8c4d47e77
// delivery routes
exports.deliveryRouter.post("/create-delivery-boy", deliveryController_1.deliveryBoyCreateController);
exports.deliveryRouter.post("/delivery-boy-login", deliveryController_1.deliveryBoyAuthenticateController);
exports.deliveryRouter.post("/delivery-boy-accept-order", deliveryController_1.deliveryBoyOrderAcceptController);
exports.deliveryRouter.post("/delivery-boy-complete-order", deliveryController_1.deliveryBoyOrderCompleteController);
exports.deliveryRouter.get("/fetch-delivery-orders", deliveryController_1.deliveryBoyOrdersFetchController);
// development purpose
exports.commonRouter.post("/default", defaultController_1.defaultController);
// commonRouter.delete("/reset-cart", (req, res) => {
//     console.log(cartData);
//     cartData.splice(0, cartData.length);
//     console.log(cartData);
//     res.send("deleted");
// });
// defaultRouter.get("/cart")
