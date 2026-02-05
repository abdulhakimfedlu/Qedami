import { Router, type Request, type Response } from "express";
import { Service, Office } from "@Qedami/db";
import { calculateDistance, getDistanceCategory, isOfficeOpenNow, createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/scout/services/:serviceId/locations", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { lat, lng } = req.query;

    const service = await Service.findById(serviceId).lean();

    if (!service) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "Service not found"));
    }

    const userLat = lat ? Number(lat) : null;
    const userLng = lng ? Number(lng) : null;
    const locationProvided = userLat !== null && userLng !== null;

    const offices = await Office.find({
      isActive: true,
      "offerings.serviceId": service._id,
    }).lean();

    const locations = offices.map((office) => {
      const offering = office.offerings.find((o) => o.serviceId.toString() === serviceId);
      const openNow = isOfficeOpenNow(office.operatingHours as Record<string, { open?: string; close?: string; isOpen: boolean }>);

      const result: {
        office: {
          _id: string;
          name: string;
          type: string;
          address: { subcity?: string; landmark?: string };
          openNow: boolean;
        };
        isAvailable: boolean;
        operationalNotes?: { en: string; am: string };
        fees?: { amount: number; currency: string; note?: string };
        proximity?: { distanceKm: number; category: string };
      } = {
        office: {
          _id: office._id.toString(),
          name: office.name,
          type: office.type,
          address: {
            subcity: office.address.subcity,
            landmark: office.address.landmark,
          },
          openNow,
        },
        isAvailable: offering?.isAvailable ?? false,
        operationalNotes: offering?.operationalNotes,
        fees: offering?.fees,
      };

      if (locationProvided && office.location?.coordinates) {
        const [officeLng, officeLat] = office.location.coordinates;
        const distanceKm = calculateDistance(userLat, userLng, officeLat, officeLng);
        result.proximity = {
          distanceKm: Math.round(distanceKm * 10) / 10,
          category: getDistanceCategory(distanceKm),
        };
      }

      return result;
    });

    if (locationProvided) {
      locations.sort((a, b) => (a.proximity?.distanceKm ?? 999) - (b.proximity?.distanceKm ?? 999));
    }

    res.json(
      createSuccessResponse(
        {
          service: {
            _id: service._id.toString(),
            name: service.identifiers,
            category: service.category,
            authorityLevel: service.authorityLevel,
          },
          locations,
        },
        {
          locationUsed: locationProvided,
          resultCount: locations.length,
        }
      )
    );
  } catch (error) {
    console.error("Service locations error:", error);
    res.status(500).json(createErrorResponse("DATABASE_ERROR", "Failed to fetch service locations"));
  }
});

export default router;
