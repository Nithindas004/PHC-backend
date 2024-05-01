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
exports.adminAuth = exports.workerAuth = void 0;
const Worker_1 = __importDefault(require("../models/Worker"));
const mongoose_1 = require("mongoose");
const Admin_1 = __importDefault(require("../models/Admin"));
const workerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const workerIdFromCookie = req.cookies.workerId;
    const workerIdFromHeader = req.headers.authorization;
    if (workerIdFromCookie) {
        res.locals.workerId = workerIdFromCookie;
    }
    else if (workerIdFromHeader) {
        const bearerPrefix = "Bearer ";
        res.locals.workerId = workerIdFromHeader.slice(bearerPrefix.length);
    }
    else {
        res.status(401).json({ error: "Unauthorized" });
    }
    if (!(0, mongoose_1.isValidObjectId)(res.locals.workerId) ||
        !(yield Worker_1.default.findById(res.locals.workerId))) {
        res.status(401).json({ error: "Invalid worker" });
    }
    const worker = yield Worker_1.default.findById(res.locals.workerId);
    if ((worker === null || worker === void 0 ? void 0 : worker.role) != "worker") {
        res.status(401).json({ error: "No permission" });
    }
    else {
        next();
    }
});
exports.workerAuth = workerAuth;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminIdFromCookie = req.cookies.workerId;
    const adminIdFromHeader = req.headers.authorization;
    if (adminIdFromCookie) {
        res.locals.adminId = adminIdFromCookie;
    }
    else if (adminIdFromHeader) {
        const bearerPrefix = "Bearer ";
        res.locals.adminId = adminIdFromHeader.slice(bearerPrefix.length);
    }
    else {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if (!(0, mongoose_1.isValidObjectId)(res.locals.adminId) ||
        !(yield Admin_1.default.findById(res.locals.adminId))) {
        res.status(401).json({ error: "Invalid admin" });
    }
    const admin = yield Admin_1.default.findById(res.locals.adminId);
    if ((admin === null || admin === void 0 ? void 0 : admin.role) != "admin") {
        res.status(401).json({ error: "No permission" });
    }
    else {
        next();
    }
});
exports.adminAuth = adminAuth;
