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
exports.adminDashboardAnalytics = exports.adminDownloadSurveysController = exports.adminFetchCampaignsController = exports.adminFetchSurveysController = exports.adminAuthenticateController = exports.adminCreateCampaignController = exports.adminCreateController = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Survey_1 = __importDefault(require("../models/Survey"));
const json2csv_1 = require("json2csv");
const axios_1 = __importDefault(require("axios"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
dotenv_1.default.config();
const adminCreateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, mobile, address } = req.body;
    if (!username || !password || !name) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    Admin_1.default.findOne({ username: username })
        .then((existingAdmin) => {
        if (existingAdmin) {
            const response = {
                status: "failed",
                message: "Account already exists for this username",
            };
            res.status(400).json(response);
        }
        else {
            req.body.userId = (0, uuid_1.v4)();
            const admin = new Admin_1.default(Object.assign(Object.assign({}, req.body), { role: "admin" }));
            admin.save();
            const response = {
                status: "success",
                message: "Admin created successfully",
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
exports.adminCreateController = adminCreateController;
const adminCreateCampaignController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, startDate, endDate, conductedBy } = req.body;
    if (!title || !description || !startDate || !endDate || !conductedBy) {
        const response = {
            status: "failed",
            message: "Missing or invalid parameters",
        };
        res.status(400).json(response);
        return;
    }
    const campaign = new Campaign_1.default(req.body);
    campaign.save();
    const response = {
        status: "success",
        message: "Campaign created successfully",
    };
    res.status(200).json(response);
});
exports.adminCreateCampaignController = adminCreateCampaignController;
const adminAuthenticateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const admin = yield Admin_1.default.findOne({ username });
        if (!admin) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else if (!admin.verifyPassword(password)) {
            const response = {
                status: "failed",
                message: "Invalid username or password",
            };
            res.status(401).json(response);
        }
        else {
            const _a = admin.toObject(), { password } = _a, adminWithoutPassword = __rest(_a, ["password"]);
            const response = {
                status: "success",
                message: "Login successful",
                data: adminWithoutPassword,
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
exports.adminAuthenticateController = adminAuthenticateController;
const adminFetchSurveysController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveys = yield Survey_1.default.find();
        const response = {
            status: "success",
            message: "fetched successfully",
            data: surveys,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.adminFetchSurveysController = adminFetchSurveysController;
const adminFetchCampaignsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield Campaign_1.default.find();
        const response = {
            status: "success",
            message: "fetched successfully",
            data: campaigns,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.adminFetchCampaignsController = adminFetchCampaignsController;
const fixMongoResponse = (data) => {
    return data.map((item) => {
        item._id = item._id.toString();
        item.nearby._id = item.nearby._id.toString();
        return item;
    });
};
const adminDownloadSurveysController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let surveys = yield Survey_1.default.find().lean();
        surveys = fixMongoResponse(surveys);
        const flattenObject = (obj, prefix = "") => {
            return Object.keys(obj).reduce((acc, key) => {
                const pre = prefix.length ? prefix + "." : "";
                if (typeof obj[key] === "object" &&
                    obj[key] !== null &&
                    !Array.isArray(obj[key])) {
                    Object.assign(acc, flattenObject(obj[key], pre + key));
                }
                else {
                    acc[pre + key] = obj[key];
                }
                return acc;
            }, {});
        };
        let allMembersData = [];
        surveys.forEach((obj) => {
            const surveyNumber = obj.surveyNumber;
            const surveyId = obj._id;
            obj.members.forEach((member) => {
                const flattenedMember = flattenObject(member);
                const processedMember = Object.assign({ surveyId,
                    surveyNumber, name: member.name, age: member.age, gender: member.gender, dob: member.dob, married: member.married, job: member.job }, flattenedMember);
                allMembersData.push(processedMember);
            });
        });
        const csvData = (0, json2csv_1.parse)(allMembersData);
        res.setHeader("Content-disposition", "attachment; filename=members_data.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csvData);
    }
    catch (error) {
        console.log(error);
        const response = {
            status: "failed",
            message: "internal error",
        };
        res.status(500).json(response);
    }
});
exports.adminDownloadSurveysController = adminDownloadSurveysController;
// const parseCSVAndExtractHealthData = (csvFilePath: string): Promise<{ label: string, yesCount: number }[]> => {
//   return new Promise((resolve, reject) => {
//       fs.readFile(csvFilePath, 'utf8', (err, data) => {
//           if (err) {
//               reject(err);
//           } else {
//               const parsedData = Papa.parse(data, { header: true }).data;
//               const healthConditions = [
//                   "bloodPressure",
//                   "diabetes",
//                   "asthma",
//                   "epilepsy",
//                   "cancer",
//                   "heartDisease",
//                   "mentalRetardation",
//                   "TB",
//                   "Stroke",
//                   "liverDisease"
//               ];
//               const counts = healthConditions.map(condition => ({
//                   label: condition,
//                   yesCount: parsedData.filter((row: any) => row[condition] === 'yes').length
//               }));
//               resolve(counts);
//           }
//       });
//   });
// };
const adminDashboardAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const flaskResponse = yield axios_1.default.get('http://127.0.0.1:5000/analytics');
        const images = ((_b = flaskResponse.data) === null || _b === void 0 ? void 0 : _b.images) || [];
        res.json(images);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.adminDashboardAnalytics = adminDashboardAnalytics;
