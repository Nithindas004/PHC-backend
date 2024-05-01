"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilRouter = void 0;
const express_1 = __importDefault(require("express"));
const utilController_1 = require("../controllers/utilController");
// for routing util APIs
exports.utilRouter = express_1.default.Router();
// util routes
exports.utilRouter.post("/create-question", utilController_1.createQuestionsController);
