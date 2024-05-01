import mongoose, { Document, Model, Schema } from "mongoose";

const CampaignSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  conductedBy: {
    type: String,
    required: true,
  },
});

const Campaign = mongoose.model("Campaign", CampaignSchema);

export default Campaign;
