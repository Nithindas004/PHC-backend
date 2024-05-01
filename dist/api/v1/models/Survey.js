"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const memberSchema = new mongoose_1.default.Schema({
    name: {
        type: String, required: true
    },
    age: {
        type: String, required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["M", "F"],
    },
    dob: {
        type: String, required: true
    },
    education: {
        type: String, required: true
    },
    married: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    job: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    disability: {
        mentalIllness: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
        fromBirth: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
    },
    blindness: {
        accident: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
        complete: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
        partial: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
    },
    spectacles: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    tobacco: {
        smoking: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
        chewing: {
            type: String,
            required: true,
            enum: ["yes", "no"],
            default: "no",
        },
    },
    alcohol: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    immigrantEmigrant: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    otherInfo: {
        type: String,
        required: true,
        default: "NIL",
    },
    vaccination: {
        complete: { type: Number, required: true },
        partiallyComplete: { type: Number, required: true },
        incomplete: { type: Number, required: true },
    },
    bloodPressure: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    diabetes: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    asthma: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    epilepsy: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    cancer: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    heartDisease: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    mentalRetardation: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    TB: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    Stroke: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    liverDisease: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    dialysis: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    other: {
        type: String,
        required: true,
        default: "NIL",
    },
    covidVaccination: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no",
    },
    maternityInfo: {
        type: String,
        required: true,
        default: "NIL",
    },
    familyPlanningMethod: {
        type: String,
        required: true,
        default: "NIL",
    },
    remark: {
        type: String,
        required: true,
        default: "NIL",
    },
});
const nearbySchema = new mongoose_1.default.Schema({
    pond: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
    stream: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
    garbage: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
    wasteWater: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
});
const surveySchema = new mongoose_1.default.Schema({
    workerId: { type: String, required: true },
    surveyNumber: { type: Number, required: true },
    houseNumber: {
        type: String,
        required: true,
    },
    houseName: {
        type: String,
        required: true,
    },
    houseType: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    religion: {
        type: String,
        required: true,
    },
    caste: {
        type: String,
        required: true,
    },
    income: { type: Number, required: true },
    rationCard: {
        required: true,
        type: String,
        enum: ["BPL", "APL"],
    },
    scst: {
        required: true,
        type: String,
        default: "no",
    },
    waterSource: {
        required: true,
        type: String,
        enum: ["well", "tap", "publicWell", "publicTap", "borewell"],
    },
    toilet: {
        required: true,
        type: String,
        enum: ["pit", "septicTank"],
    },
    nearby: nearbySchema,
    cattle: {
        required: true,
        type: String,
        default: "no",
    },
    wasteManagement: {
        required: true,
        type: String,
        enum: ["compost", "bioGas", "soakagePit", "other"],
        default: "other",
    },
    workingMembers: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        enum: ["government", "private", "agriculture", "business", "other"],
    },
    members: [memberSchema],
});
const Survey = mongoose_1.default.model("Survey", surveySchema);
exports.default = Survey;
