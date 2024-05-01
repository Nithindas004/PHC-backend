import mongoose, { Document, Model, Schema } from "mongoose";

interface IAdmin extends Document {
  name: string;
  username: string;
  password: string;
  role: "admin";
  verifyPassword(password: string): boolean;
}

const AdminSchema: Schema<IAdmin> = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ["admin"],
    default: "admin"
  },
});

// Add a method to compare passwords
AdminSchema.methods.verifyPassword = function (
  candidatePassword: string
): boolean {
  return candidatePassword === this.password;
};

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
