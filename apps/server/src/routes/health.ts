import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import { createSuccessResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/health", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  res.json(
    createSuccessResponse({
      status: "operational",
      database: dbStatus,
      searchIndex: "active",
      version: "1.0.0",
    })
  );
});

export default router;
