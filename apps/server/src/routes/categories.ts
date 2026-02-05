import { Router, type Request, type Response } from "express";
import { Service } from "@Qedami/db";
import { createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

const CATEGORY_METADATA: Record<string, { name: { en: string; am: string }; icon: string }> = {
  vital: {
    name: { en: "Vital Records", am: "ወሳኝ ሰነዶች" },
    icon: "document",
  },
  identity: {
    name: { en: "Identity Services", am: "የማንነት አገልግሎቶች" },
    icon: "id-card",
  },
  property: {
    name: { en: "Property Services", am: "የንብረት አገልግሎቶች" },
    icon: "home",
  },
  business: {
    name: { en: "Business Registration", am: "የንግድ ምዝገባ" },
    icon: "briefcase",
  },
  judicial: {
    name: { en: "Judicial Services", am: "የዳኝነት አገልግሎቶች" },
    icon: "gavel",
  },
  health: {
    name: { en: "Health Services", am: "የጤና አገልግሎቶች" },
    icon: "heart",
  },
  security: {
    name: { en: "Security Services", am: "የፀጥታ አገልግሎቶች" },
    icon: "shield",
  },
};

router.get("/api/v1/scout/categories", async (_req, res) => {
  try {
    const categoryCounts = await Service.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categories = categoryCounts.map((cat) => ({
      id: cat._id,
      ...CATEGORY_METADATA[cat._id],
      serviceCount: cat.count,
    }));

    res.json(createSuccessResponse({ categories }));
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json(createErrorResponse("DATABASE_ERROR", "Failed to fetch categories"));
  }
});

router.get("/api/v1/scout/categories/:categoryId/services", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const services = await Service.find({ category: categoryId })
      .select("identifiers category description authorityLevel estimatedProcessingTime")
      .lean();

    if (services.length === 0) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "Category not found or has no services"));
    }

    res.json(
      createSuccessResponse({
        category: {
          id: categoryId,
          ...CATEGORY_METADATA[categoryId],
        },
        services: services.map((s) => ({
          _id: s._id.toString(),
          name: s.identifiers,
          description: s.description,
          authorityLevel: s.authorityLevel,
          processingTime: s.estimatedProcessingTime,
        })),
      })
    );
  } catch (error) {
    console.error("Category services error:", error);
    res.status(500).json(createErrorResponse("DATABASE_ERROR", "Failed to fetch category services"));
  }
});

export default router;
