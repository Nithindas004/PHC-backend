import { Request, Response } from "express";
import { IResponse } from "../Interfaces/IResponse";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Worker from "../models/Worker";
import Survey from "../models/Survey";
import axios from "axios";

dotenv.config();

export const workerCreateController = async (req: Request, res: Response) => {
  const { username, password, name, mobile, address } = req.body;

  /**
   * name: String,
   * username: String,
   * mobile: String,
   * address: String,
   * role: ["worker", "user", "admin"]
   */

  if (!username || !password || !name || !mobile || !address) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }

  Worker.findOne({ username: username })
    .then((existingWorker) => {
      if (existingWorker) {
        const response: IResponse = {
          status: "failed",
          message: "Account already exists for this username",
        };
        res.status(400).json(response);
      } else {
        req.body.userId = uuidv4();
        const worker = new Worker({ ...req.body, role: "worker" });

        worker.save();

        const response: IResponse = {
          status: "success",
          message: "Worker created successfully",
        };
        res.status(200).json(response);
      }
    })
    .catch((err: any) => {
      const response: IResponse = {
        status: "failed",
        message: "Registration failed",
      };
      res.status(404).json(response);
    });
};

export const workerAuthenticateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }

  try {
    const worker = await Worker.findOne({ username });

    // handling invalid credentials
    if (!worker) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid username or password",
      };
      res.status(401).json(response);
    } else if (!worker!.verifyPassword(password)) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid username or password",
      };
      res.status(401).json(response);
    } else {
      const { password, ...workerWithoutPassword } = worker.toObject();

      const response: IResponse = {
        status: "success",
        message: "Login successful",
        data: workerWithoutPassword,
      };

      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);

    const response: IResponse = {
      status: "failed",
      message: "internal error",
    };

    res.status(500).json(response);
  }
};

export const workerCreateSurveyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const survey = await new Survey({
      ...req.body,
      workerIds: res.locals.workerId,
    });
    await survey
      .save()
      .then((survey) => {
        const response: IResponse = {
          status: "success",
          message: "Survey created successfully",
        };
        res.status(201).json(response);
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "ValidationError") {
          const response: IResponse = {
            status: "failed",
            message: "Validation error",
          };

          res.status(400).json(response);
        } else {
          const response: IResponse = {
            status: "failed",
            message: "Internal error",
          };

          res.status(500).json(response);
        }
      });
  } catch (error) {
    const response: IResponse = {
      status: "failed",
      message: "Internal error",
    };

    res.status(500).json(response);
  }
};

export const workerDiabetesPredictionController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const {Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age} = req.body

  if (!Pregnancies || !Glucose || !BloodPressure || !SkinThickness || !Insulin || !BMI || !DiabetesPedigreeFunction || !Age) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }

  try {
    const diabetesPredictionApiUrl = "http://127.0.0.1:5000/diabetes/predict";
    // const payload = {
    //   Pregnancies: 1,
    //   Glucose: 185,
    //   BloodPressure: 66,
    //   SkinThickness: 29,
    //   Insulin: 500,
    //   BMI: 26.6,
    //   DiabetesPedigreeFunction: 0.751,
    //   Age: 51,
    // };

    const result = await axios.post(diabetesPredictionApiUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    if (result.status === 200) {
      const response: IResponse = {
        status: "success",
        message: "Prediction success",
        data: result.data
      };
  
      res.status(500).json(response);
    } else {
      console.error("Error:", result.statusText);
      res.status(result.status).send("Error occurred!");
    }
  } catch (error) {
    const response: IResponse = {
      status: "failed",
      message: "Internal error",
    };

    res.status(500).json(response);
  }
};

export const workerDiabetesCountPredictionController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const {year} = req.body

  if (!year) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }

  try {
    const diabetesPredictionApiUrl = "http://127.0.0.1:5000/diabetes-count/predict";

    const result = await axios.post(diabetesPredictionApiUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    if (result.status === 200) {
      const response: IResponse = {
        status: "success",
        message: "Prediction success",
        data: result.data
      };
  
      res.status(200).json(response);
    } else {
      console.error("Error:", result.statusText);
      res.status(result.status).send("Error occurred!");
    }
  } catch (error) {
    const response: IResponse = {
      status: "failed",
      message: "Internal error",
    };

    res.status(500).json(response);
  }
};
