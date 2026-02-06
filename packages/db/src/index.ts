import { env } from "@Qedami/env/server";
import mongoose from "mongoose";

export async function connectToDatabase() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Successfully connected to MongoDB!");
    return mongoose.connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export function getDatabase() {
  return mongoose.connection.db;
}

export { Service, type IService } from "./models/Service.js";
export { Office, type IOffice, type IOffering } from "./models/Office.js";
export { User, type IUser } from "./models/User.js";
