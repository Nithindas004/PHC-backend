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
exports.workerDiabetesCountPredictionController = exports.workerDiabetesPredictionController = exports.workerCreateSurveyController = exports.workerAuthenticateController = exports.workerCreateController = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const Worker_1 = __importDefault(require("../models/Worker"));
const Survey_1 = __importDefault(require("../models/Survey"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const workerCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, mobile, address } = req.body;
    /**
     * name: String,
     * username: String,
     * mobile: String,
     * address: String,
     * role: ["worker", "user", "admin"]
     */
    if (!username || !password || !name || !mobile || !address) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    Worker_1.default.findOne({ username: username })
        .then((existingWorker) => {
        if (existingWorker) {
            const response = {
                status: "failed",
                message: "Account already exists for this username",
            };
            res.status(400).json(response);
        }
        else {
            req.body.userId = (0, uuid_1.v4)();
            const worker = new Worker_1.default(Object.assign(Object.assign({}, req.body), { role: "worker" }));
            worker.save();
            const response = {
                status: "success",
                message: "Worker created successfully",
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
exports.workerCreateController = workerCreateController;
const workerAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    try {
        const worker = yield Worker_1.default.findOne({ username });
        // handling invalid credentials
        if (!worker) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else if (!worker.verifyPassword(password)) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else {
            const _a = worker.toObject(), { password } = _a, workerWithoutPassword = __rest(_a, ["password"]);
            const response = {
                status: "success",
                message: "Login successful",
                data: workerWithoutPassword,
            };
            res.status(200).json(response);
        }
    }
    catch (err) {
        console.log(err);
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerAuthenticateController = workerAuthenticateController;
const workerCreateSurveyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const survey = yield new Survey_1.default(Object.assign(Object.assign({}, req.body), { workerIds: res.locals.workerId }));
        yield survey
            .save()
            .then((survey) => {
            const response = {
                status: "success",
                message: "Survey created successfully",
            };
            res.status(201).json(response);
        })
            .catch((err) => {
            console.log(err);
            if (err.name === "ValidationError") {
                const response = {
                    status: "failed",
                    message: "Validation error",
                };
                res.status(400).json(response);
            }
            else {
                const response = {
                    status: "failed",
                    message: "Internal error",
                };
                res.status(500).json(response);
            }
        });
    }
    catch (error) {
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerCreateSurveyController = workerCreateSurveyController;
const workerDiabetesPredictionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age } = req.body;
    if (!Pregnancies || !Glucose || !BloodPressure || !SkinThickness || !Insulin || !BMI || !DiabetesPedigreeFunction || !Age) {
        const response = {
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
        const result = yield axios_1.default.post(diabetesPredictionApiUrl, req.body, {
            headers: { "Content-Type": "application/json" },
        });
        if (result.status === 200) {
            const response = {
                status: "success",
                message: "Prediction success",
                data: result.data
            };
            res.status(500).json(response);
        }
        else {
            console.error("Error:", result.statusText);
            res.status(result.status).send("Error occurred!");
        }
    }
    catch (error) {
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerDiabetesPredictionController = workerDiabetesPredictionController;
const workerDiabetesCountPredictionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.body;
    if (!year) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    try {
        const diabetesPredictionApiUrl = "http://127.0.0.1:5000/diabetes-count/predict";
        const result = yield axios_1.default.post(diabetesPredictionApiUrl, req.body, {
            headers: { "Content-Type": "application/json" },
        });
        if (result.status === 200) {
            const response = {
                status: "success",
                message: "Prediction success",
                data: result.data
            };
            res.status(200).json(response);
        }
        else {
            console.error("Error:", result.statusText);
            res.status(result.status).send("Error occurred!");
        }
    }
    catch (error) {
        const response = {
            status: "failed",
            message: "Internal error",
        };
        res.status(500).json(response);
    }
});
exports.workerDiabetesCountPredictionController = workerDiabetesCountPredictionController;
