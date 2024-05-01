import express from "express";
import { adminAuthenticateController, adminCreateController, adminDownloadSurveysController, adminFetchSurveysController, adminDashboardAnalytics, adminCreateCampaignController, adminFetchCampaignsController } from "../controllers/adminController";
import { adminAuth } from "../middlewares/AuthMiddleware";

// for routing user APIs
export const adminRouter = express.Router();

// admin routes
adminRouter.post("/create", adminCreateController);
adminRouter.post("/login", adminAuthenticateController);
adminRouter.get("/fetch-surveys", adminAuth, adminFetchSurveysController);
adminRouter.get("/download-surveys", adminDownloadSurveysController);
adminRouter.get("/dashboard-analytics", adminDashboardAnalytics);
adminRouter.post("/campaign", adminCreateCampaignController);
adminRouter.get("/campaign", adminFetchCampaignsController);