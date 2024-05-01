import mongoose, { Document, Model, Schema } from "mongoose";

interface IMember extends Document {
  name: string;
  age: string; // Consider using a Date type for age
  gender: "M" | "F";
  dob: string; // Consider using a Date type for dob
  education: string;
  married: "yes" | "no";
  job: "yes" | "no";
  disability: {
    mentalIllness: "yes" | "no";
    fromBirth: "yes" | "no";
  };
  blindness: {
    accident: "yes" | "no";
    complete: "yes" | "no";
    partial: "yes" | "no";
  };
  spectacles: "yes" | "no";
  tobacco: {
    smoking: "yes" | "no";
    chewing: "yes" | "no";
  };
  alcohol: "yes" | "no";
  immigrantEmigrant: "yes" | "no";
  otherInfo: string;
  vaccination: {
    complete: number;
    partiallyComplete: number;
    incomplete: number;
  };
  bloodPressure: "yes" | "no";
  diabetes: "yes" | "no";
  asthma: "yes" | "no";
  epilepsy: "yes" | "no";
  cancer: "yes" | "no";
  heartDisease: "yes" | "no";
  mentalRetardation: "yes" | "no";
  TB: "yes" | "no";
  Stroke: "yes" | "no";
  liverDisease: "yes" | "no";
  dialysis: "yes" | "no";
  other: string;
  covidVaccination: "yes" | "no";
  maternityInfo: string;
  familyPlanningMethod: string;
  remark: string;
}

interface ISurvey extends Document {
  workerId: String;
  surveyNumber: number;
  houseNumber: string;
  houseName: string;
  houseType: string;
  owner: string;
  mobile: string;
  religion: string;
  caste: string;
  income: number;
  rationCard: "BPL" | "APL";
  scst: "yes" | "no";
  waterSource: "Well" | "Tap" | "PublicWell" | "PublicTap" | "Borewell";
  toilet: "pit" | "septic tank";
  nearby: INearby;
  cattle: "yes" | "no";
  wasteManagement: "compost" | "bioGas" | "soakagePit" | "other";
  workingMembers: number;
  jobType: "government" | "private" | "agriculture" | "business" | "other";
  members: IMember[]; // Array of embedded member documents
}

interface INearby {
  pond: "yes" | "no";
  stream: "yes" | "no";
  garbage: "yes" | "no";
  wasteWater: "yes" | "no";
}

const memberSchema: Schema<IMember> = new mongoose.Schema({
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

const nearbySchema: Schema<INearby> = new mongoose.Schema({
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

const surveySchema: Schema<ISurvey> = new mongoose.Schema({
  workerId: {type: String, required: true},
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

const Survey = mongoose.model<ISurvey>("Survey", surveySchema);

export default Survey;
