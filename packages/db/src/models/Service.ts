import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IService extends Document {
  _id: Types.ObjectId;
  identifiers: {
    en: string;
    am: string;
  };
  category: string;
  description: {
    en: string;
    am: string;
  };
  authorityLevel: string[];
  baseRequirements: {
    required: Array<{
      item: { en: string; am: string };
      description: { en: string; am: string };
      verificationStandard?: { en: string; am: string };
    }>;
    optional: Array<{
      item: { en: string; am: string };
      description: { en: string; am: string };
      condition?: { en: string; am: string };
    }>;
  };
  estimatedProcessingTime?: string;
  applicableTo?: string[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    identifiers: {
      en: { type: String, required: true },
      am: { type: String, required: true },
    },
    category: {
      type: String,
      required: true,
      enum: ["vital", "identity", "property", "business", "judicial", "health", "security"],
    },
    description: {
      en: { type: String, required: true },
      am: { type: String, required: true },
    },
    authorityLevel: {
      type: [String],
      required: true,
      enum: ["kebele", "woreda", "federal", "municipal"],
    },
    baseRequirements: {
      required: [
        {
          item: {
            en: { type: String, required: true },
            am: { type: String, required: true },
          },
          description: {
            en: { type: String, required: true },
            am: { type: String, required: true },
          },
          verificationStandard: {
            en: String,
            am: String,
          },
        },
      ],
      optional: [
        {
          item: {
            en: String,
            am: String,
          },
          description: {
            en: String,
            am: String,
          },
          condition: {
            en: String,
            am: String,
          },
        },
      ],
    },
    estimatedProcessingTime: String,
    applicableTo: [String],
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", ServiceSchema);
