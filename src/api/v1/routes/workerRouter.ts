import express from "express";
import {
  workerCreateSurveyController,
  workerAuthenticateController,
  workerCreateController,
  workerDiabetesPredictionController,
  workerDiabetesCountPredictionController,
} from "../controllers/workerController";
import { workerAuth } from "../middlewares/AuthMiddleware";

// for routing user APIs
export const workerRouter = express.Router();

// worker routes
workerRouter.post("/create", workerCreateController);
workerRouter.post("/login", workerAuthenticateController);
workerRouter.post("/create-survey", workerAuth, workerCreateSurveyController);
workerRouter.post("/diabetes/predict", workerAuth, workerDiabetesPredictionController);
workerRouter.post("/diabetes-count/predict", workerDiabetesCountPredictionController);