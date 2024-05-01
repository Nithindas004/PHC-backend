"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
// for routing user APIs
exports.adminRouter = express_1.default.Router();
// admin routes
exports.adminRouter.post("/create", adminController_1.adminCreateController);
exports.adminRouter.post("/login", adminController_1.adminAuthenticateController);
exports.adminRouter.get("/fetch-surveys", AuthMiddleware_1.adminAuth, adminController_1.adminFetchSurveysController);
exports.adminRouter.get("/download-surveys", adminController_1.adminDownloadSurveysController);
exports.adminRouter.get("/dashboard-analytics", adminController_1.adminDashboardAnalytics);
exports.adminRouter.post("/campaign", adminController_1.adminCreateCampaignController);
exports.adminRouter.get("/campaign", adminController_1.adminFetchCampaignsController);
