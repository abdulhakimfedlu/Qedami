import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  profile: {
    preferredLanguage: "en" | "am";
    savedLocation?: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  searchHistory: Array<{
    query: string;
    timestamp: Date;
  }>;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true },
    profile: {
      preferredLanguage: { 
        type: String, 
        enum: ["en", "am"], 
        default: "en" 
      },
      savedLocation: {
        type: { type: String, default: "Point", enum: ["Point"] },
        coordinates: { type: [Number] },
      },
    },
    searchHistory: [
      {
        query: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(_doc, ret) {
        delete (ret as any).passwordHash;
        return ret;
      }
    }
  }
);

// Index for geospatial queries
UserSchema.index({ "profile.savedLocation": "2dsphere" });

export const User = mongoose.model<IUser>("User", UserSchema);