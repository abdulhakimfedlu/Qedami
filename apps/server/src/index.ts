import { env } from "@Qedami/env/server";
import { connectToDatabase } from "@Qedami/db";
import cors from "cors";
import express from "express";

import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import suggestionsRoutes from "./routes/suggestions.js";
import searchRoutes from "./routes/search.js";
import officesRoutes from "./routes/offices.js";
import checklistRoutes from "./routes/checklist.js";
import serviceLocationsRoutes from "./routes/serviceLocations.js";
import categoriesRoutes from "./routes/categories.js";

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? true : env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

app.use(express.json());

app.use(healthRoutes);
app.use(authRoutes);
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
    const port = env.PORT || 8081;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
      console.log(`Local access: http://localhost:${port}`);
      console.log(`Network access: http://192.168.1.4:${port}`);
      console.log("API endpoints:");
      console.log("  GET /api/v1/health");
      console.log("  POST /api/v1/auth/signup");
      console.log("  POST /api/v1/auth/signin");
      console.log("  GET /api/v1/auth/me");
      console.log("  POST /api/v1/auth/signout");
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
