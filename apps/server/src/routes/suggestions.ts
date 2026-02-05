import { Router, type Request, type Response } from "express";
import { Service } from "@Qedami/db";
import { createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/scout/suggestions", async (req, res) => {
  try {
    const { q, limit = "6" } = req.query;

    if (!q || String(q).length < 1) {
      const trending = await Service.find({})
        .select("identifiers category")
        .limit(6)
        .lean();

      const suggestions = trending.map((s) => ({
        type: "service",
        text: s.identifiers,
        serviceId: s._id.toString(),
      }));

      return res.json(
        createSuccessResponse({
          suggestions,
          trending: suggestions,
          recentSearches: [],
        })
      );
    }

    const searchText = String(q);
    const searchLimit = Math.min(Number(limit) || 6, 10);

    const services = await Service.find({
      $or: [
        { "identifiers.en": { $regex: searchText, $options: "i" } },
        { "identifiers.am": { $regex: searchText, $options: "i" } },
        { keywords: { $regex: searchText, $options: "i" } },
      ],
    })
      .select("identifiers category")
      .limit(searchLimit)
      .lean();

    const suggestions = services.map((s) => ({
      type: "service",
      text: s.identifiers,
      serviceId: s._id.toString(),
    }));

    res.json(
      createSuccessResponse({
        suggestions,
        recentSearches: [],
      })
    );
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json(createErrorResponse("SEARCH_ERROR", "Failed to fetch suggestions"));
  }
});

export default router;
