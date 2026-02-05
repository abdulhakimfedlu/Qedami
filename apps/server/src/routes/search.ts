import { Router, type Request, type Response } from "express";
import { Service, Office } from "@Qedami/db";
import { calculateDistance, getDistanceCategory, isOfficeOpenNow, createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/scout/search", async (req, res) => {
  try {
    const { q, lat, lng, category, limit = "20" } = req.query;

    if (!q || String(q).length < 2) {
      return res.status(400).json(createErrorResponse("INVALID_QUERY", "Search query must be at least 2 characters", "q"));
    }

    const searchText = String(q);
    const searchLimit = Math.min(Number(limit) || 20, 50);
    const userLat = lat ? Number(lat) : null;
    const userLng = lng ? Number(lng) : null;
    const locationProvided = userLat !== null && userLng !== null;

    const serviceQuery: Record<string, unknown> = {
      $or: [
        { "identifiers.en": { $regex: searchText, $options: "i" } },
        { "identifiers.am": { $regex: searchText, $options: "i" } },
        { keywords: { $regex: searchText, $options: "i" } },
        { "description.en": { $regex: searchText, $options: "i" } },
        { "description.am": { $regex: searchText, $options: "i" } },
      ],
    };

    if (category) {
      serviceQuery.category = String(category);
    }

    const matchingServices = await Service.find(serviceQuery).lean();
    const serviceIds = matchingServices.map((s) => s._id);
    const serviceMap = new Map(matchingServices.map((s) => [s._id.toString(), s]));

    const offices = await Office.find({
      isActive: true,
      "offerings.serviceId": { $in: serviceIds },
    }).lean();

    const results: Array<{
      type: string;
      proximity?: { distanceKm: number; category: string };
      office: {
        _id: string;
        name: string;
        type: string;
        address: { subcity?: string; kebeleNumber?: string; landmark?: string };
        openNow: boolean;
      };
      matchedService: {
        _id: string;
        name: { en: string; am: string };
        category: string;
        isAvailable: boolean;
        operationalNotes?: { en: string; am: string };
      };
    }> = [];

    for (const office of offices) {
      for (const offering of office.offerings) {
        const service = serviceMap.get(offering.serviceId.toString());
        if (!service) continue;

        const openNow = isOfficeOpenNow(office.operatingHours as Record<string, { open?: string; close?: string; isOpen: boolean }>);

        const result: (typeof results)[0] = {
          type: "office_service_match",
          office: {
            _id: office._id.toString(),
            name: office.name,
            type: office.type,
            address: {
              subcity: office.address.subcity,
              kebeleNumber: office.address.kebeleNumber,
              landmark: office.address.landmark,
            },
            openNow,
          },
          matchedService: {
            _id: service._id.toString(),
            name: service.identifiers,
            category: service.category,
            isAvailable: offering.isAvailable,
            operationalNotes: offering.operationalNotes,
          },
        };

        if (locationProvided && office.location?.coordinates) {
          const [officeLng, officeLat] = office.location.coordinates;
          const distanceKm = calculateDistance(userLat, userLng, officeLat, officeLng);
          result.proximity = {
            distanceKm: Math.round(distanceKm * 10) / 10,
            category: getDistanceCategory(distanceKm),
          };
        }

        results.push(result);
      }
    }

    if (locationProvided) {
      results.sort((a, b) => (a.proximity?.distanceKm ?? 999) - (b.proximity?.distanceKm ?? 999));
    }

    res.json(
      createSuccessResponse(results.slice(0, searchLimit), {
        locationUsed: locationProvided,
        query: searchText,
        resultCount: results.length,
      })
    );
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json(createErrorResponse("SEARCH_ERROR", "Failed to perform search"));
  }
});

export default router;
