import { NextFunction, Request, Response } from "express";
import Worker from "../models/Worker";
import { isValidObjectId } from "mongoose";
import Admin from "../models/Admin";

export const workerAuth = async (req: any, res: any, next: NextFunction) => {
  const workerIdFromCookie = req.cookies.workerId;
  const workerIdFromHeader = req.headers.authorization;

  if (workerIdFromCookie) {
    res.locals.workerId = workerIdFromCookie;
  } else if (workerIdFromHeader) {
    const bearerPrefix = "Bearer ";
    res.locals.workerId = workerIdFromHeader.slice(bearerPrefix.length);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
  if (
    !isValidObjectId(res.locals.workerId) ||
    !(await Worker.findById(res.locals.workerId))
  ) {
    res.status(401).json({ error: "Invalid worker" });
  }

  const worker = await Worker.findById(res.locals.workerId);
  if (worker?.role != "worker") {
    res.status(401).json({ error: "No permission" });
  } else {
    next();
  }
};

export const adminAuth = async (req: any, res: any, next: NextFunction) => {
  const adminIdFromCookie = req.cookies.workerId;
  const adminIdFromHeader = req.headers.authorization;

  if (adminIdFromCookie) {
    res.locals.adminId = adminIdFromCookie;
  } else if (adminIdFromHeader) {
    const bearerPrefix = "Bearer ";
    res.locals.adminId = adminIdFromHeader.slice(bearerPrefix.length);
  } else {
    res.status(401).json({ error: "Unauthorized" });
    return
  }
  if (
    !isValidObjectId(res.locals.adminId) ||
    !(await Admin.findById(res.locals.adminId))
  ) {
    res.status(401).json({ error: "Invalid admin" });
  }

  const admin = await Admin.findById(res.locals.adminId);
  if (admin?.role != "admin") {
    res.status(401).json({ error: "No permission" });
  } else {
    next();
  }
};
