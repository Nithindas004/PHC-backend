import mongoose, { Document, Model, Schema } from "mongoose";

interface IWorker extends Document {
  workerId: string;
  name: string;
  username: string;
  mobile: string;
  address: string;
  password: string;
  role: "worker" | "user" | "admin";
  verifyPassword(password: string): boolean;
}

const WorkerSchema: Schema<IWorker> = new mongoose.Schema({
  workerId: String,
  name: String,
  username: String,
  mobile: String,
  address: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ["worker", "admin"],
  },
});

// Add a method to compare passwords
WorkerSchema.methods.verifyPassword = function (
  candidatePassword: string
): boolean {
  return candidatePassword === this.password;
};

const Worker: Model<IWorker> = mongoose.model<IWorker>("Worker", WorkerSchema);

export default Worker;
