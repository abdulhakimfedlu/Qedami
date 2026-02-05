import mongoose, { type Document, Schema, type Types } from "mongoose";

interface DayHours {
  open?: string;
  close?: string;
  isOpen: boolean;
  note?: string;
}

interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface IOffering {
  serviceId: Types.ObjectId;
  isAvailable: boolean;
  temporaryNote?: string;
  additionalRequirements?: Array<{
    item: { en: string; am: string };
    description: { en: string; am: string };
    warning?: { en: string; am: string };
  }>;
  waivedRequirements?: string[];
  operationalNotes?: { en: string; am: string };
  typicalWaitTime?: string;
  bestTimeToVisit?: string;
  fees?: {
    amount: number;
    currency: string;
    note?: string;
  };
  updatedAt: Date;
}

export interface IOffice extends Document {
  _id: Types.ObjectId;
  name: string;
  type: string;
  jurisdiction: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: {
    region: string;
    subcity: string;
    woreda?: string;
    kebeleNumber?: string;
    streetName?: string;
    buildingName?: string;
    landmark?: string;
    directions?: { en: string; am: string };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours: OperatingHours;
  offerings: IOffering[];
  isActive: boolean;
  lastVerifiedAt: Date;
  createdAt: Date;
}

const OfferingSchema = new Schema<IOffering>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    isAvailable: { type: Boolean, default: true },
    temporaryNote: String,
    additionalRequirements: [
      {
        item: {
          en: String,
          am: String,
        },
        description: {
          en: String,
          am: String,
        },
        warning: {
          en: String,
          am: String,
        },
      },
    ],
    waivedRequirements: [String],
    operationalNotes: {
      en: String,
      am: String,
    },
    typicalWaitTime: String,
    bestTimeToVisit: String,
    fees: {
      amount: Number,
      currency: { type: String, default: "ETB" },
      note: String,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DayHoursSchema = {
  open: String,
  close: String,
  isOpen: { type: Boolean, default: false },
  note: String,
};

const OfficeSchema = new Schema<IOffice>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Kebele", "Woreda", "Municipal", "Federal", "Court", "Police", "Health", "Security"],
    },
    jurisdiction: { type: String, required: true },
    location: {
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: { type: [Number], required: true },
    },
    address: {
      region: String,
      subcity: String,
      woreda: String,
      kebeleNumber: String,
      streetName: String,
      buildingName: String,
      landmark: String,
      directions: {
        en: String,
        am: String,
      },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    operatingHours: {
      monday: DayHoursSchema,
      tuesday: DayHoursSchema,
      wednesday: DayHoursSchema,
      thursday: DayHoursSchema,
      friday: DayHoursSchema,
      saturday: DayHoursSchema,
      sunday: DayHoursSchema,
    },
    offerings: [OfferingSchema],
    isActive: { type: Boolean, default: true },
    lastVerifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

OfficeSchema.index({ location: "2dsphere" });
OfficeSchema.index({ "offerings.serviceId": 1 });

export const Office = mongoose.model<IOffice>("Office", OfficeSchema);
