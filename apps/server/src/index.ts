import { env } from "@Qedami/env/server";
import { connectToDatabase } from "@Qedami/db";
import cors from "cors";
import express from "express";

import healthRoutes from "./routes/health.js";
import suggestionsRoutes from "./routes/suggestions.js";
import searchRoutes from "./routes/search.js";
import officesRoutes from "./routes/offices.js";
import checklistRoutes from "./routes/checklist.js";
import serviceLocationsRoutes from "./routes/serviceLocations.js";
import categoriesRoutes from "./routes/categories.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());

app.use(healthRoutes);
app.use(suggestionsRoutes);
app.use(searchRoutes);
app.use(officesRoutes);
app.use(checklistRoutes);
app.use(serviceLocationsRoutes);
app.use(categoriesRoutes);

app.get("/", (_req, res) => {
  res.status(200).send("Qedami Scout API v1.0.0");
});

async function start() {
  try {
    await connectToDatabase();
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
      console.log("API endpoints:");
      console.log("  GET /api/v1/health");
      console.log("  GET /api/v1/scout/suggestions");
      console.log("  GET /api/v1/scout/search");
      console.log("  GET /api/v1/scout/offices/:officeId");
      console.log("  GET /api/v1/scout/checklist");
      console.log("  GET /api/v1/scout/services/:serviceId/locations");
      console.log("  GET /api/v1/scout/categories");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
