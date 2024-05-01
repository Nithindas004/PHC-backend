"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerRouter = void 0;
const express_1 = __importDefault(require("express"));
const workerController_1 = require("../controllers/workerController");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
// for routing user APIs
exports.workerRouter = express_1.default.Router();
// worker routes
exports.workerRouter.post("/create", workerController_1.workerCreateController);
exports.workerRouter.post("/login", workerController_1.workerAuthenticateController);
exports.workerRouter.post("/create-survey", AuthMiddleware_1.workerAuth, workerController_1.workerCreateSurveyController);
exports.workerRouter.post("/diabetes/predict", AuthMiddleware_1.workerAuth, workerController_1.workerDiabetesPredictionController);
exports.workerRouter.post("/diabetes-count/predict", workerController_1.workerDiabetesCountPredictionController);
