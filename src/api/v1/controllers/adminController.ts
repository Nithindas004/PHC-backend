import { Request, Response } from "express";
import { IResponse } from "../Interfaces/IResponse";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Admin from "../models/Admin";
import Survey from "../models/Survey";
import { parse } from "json2csv";
import Papa from 'papaparse';
import QuickChart from 'quickchart-js';
import fs from "fs"
import path from "path"
import axios from "axios";
import Campaign from "../models/Campaign";

dotenv.config();

export const adminCreateController = async (req: Request, res: Response) => {
  const { username, password, name, mobile, address } = req.body;

  if (!username || !password || !name) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }

  Admin.findOne({ username: username })
    .then((existingAdmin) => {
      if (existingAdmin) {
        const response: IResponse = {
          status: "failed",
          message: "Account already exists for this username",
        };
        res.status(400).json(response);
      } else {
        req.body.userId = uuidv4();
        const admin = new Admin({ ...req.body, role: "admin" });

        admin.save();

        const response: IResponse = {
          status: "success",
          message: "Admin created successfully",
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

export const adminCreateCampaignController = async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, conductedBy } = req.body;

  if (!title || !description || !startDate || !endDate || !conductedBy) {
    const response: IResponse = {
      status: "failed",
      message: "Missing or invalid parameters",
    };
    res.status(400).json(response);
    return;
  }


        const campaign = new Campaign(req.body);

        campaign.save();

        const response: IResponse = {
          status: "success",
          message: "Campaign created successfully",
        };
        res.status(200).json(response);
      
};

export const adminAuthenticateController = async (
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
    const admin = await Admin.findOne({ username });

    if (!admin) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid username or password",
      };
      res.status(401).json(response);
    } else if (!admin!.verifyPassword(password)) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid username or password",
      };
      res.status(401).json(response);
    } else {
      const { password, ...adminWithoutPassword } = admin.toObject();

      const response: IResponse = {
        status: "success",
        message: "Login successful",
        data: adminWithoutPassword,
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

export const adminFetchSurveysController = async (
  req: Request,
  res: Response
) => {
  try {
    const surveys = await Survey.find();
    const response: IResponse = {
      status: "success",
      message: "fetched successfully",
      data: surveys,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    const response: IResponse = {
      status: "failed",
      message: "internal error",
    };

    res.status(500).json(response);
  }
};

export const adminFetchCampaignsController = async (
  req: Request,
  res: Response
) => {
  try {
    const campaigns = await Campaign.find();
    const response: IResponse = {
      status: "success",
      message: "fetched successfully",
      data: campaigns,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    const response: IResponse = {
      status: "failed",
      message: "internal error",
    };

    res.status(500).json(response);
  }
};

const fixMongoResponse = (data: any) => {
  return data.map((item: any) => {
    item._id = item._id.toString();
    item.nearby._id = item.nearby._id.toString();

    return item;
  });
}

export const adminDownloadSurveysController = async (
  req: Request,
  res: Response
) => {
  try {
    let surveys = await Survey.find().lean();
    surveys = fixMongoResponse(surveys);

    const flattenObject = (obj: any, prefix = "") => {
      return Object.keys(obj).reduce((acc: any, key) => {
        const pre = prefix.length ? prefix + "." : "";
        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
          acc[pre + key] = obj[key];
        }
        return acc;
      }, {});
    };

    let allMembersData: any = [];

    surveys.forEach((obj: any) => {
      const surveyNumber = obj.surveyNumber;
      const surveyId = obj._id;

      obj.members.forEach((member: any) => {
        const flattenedMember = flattenObject(member);

        const processedMember = {
          surveyId,
          surveyNumber,
          name: member.name,
          age: member.age,
          gender: member.gender,
          dob: member.dob,
          married: member.married,
          job: member.job,
          ...flattenedMember,
        };

        allMembersData.push(processedMember);
      });
    });

    const csvData = parse(allMembersData);

    res.setHeader(
      "Content-disposition",
      "attachment; filename=members_data.csv"
    );
    res.set("Content-Type", "text/csv");

    res.status(200).send(csvData);
  } catch (error) {
    console.log(error);

    const response: IResponse = {
      status: "failed",
      message: "internal error",
    };

    res.status(500).json(response);
  }
};

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

export const adminDashboardAnalytics = async (req: Request,
  res: Response) => {
    try {
      const flaskResponse = await axios.get('http://127.0.0.1:5000/analytics');
      const images = flaskResponse.data?.images || [];

      res.json(images);
      
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
}