import { Router, type Request, type Response } from "express";
import { Office, Service } from "@Qedami/db";
import { isOfficeOpenNow, createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/scout/offices/:officeId", async (req, res) => {
  try {
    const { officeId } = req.params;

    const office = await Office.findById(officeId).lean();

    if (!office) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "Office not found"));
    }

    const serviceIds = office.offerings.map((o) => o.serviceId);
    const services = await Service.find({ _id: { $in: serviceIds } })
      .select("identifiers category")
      .lean();
    const serviceMap = new Map(services.map((s) => [s._id.toString(), s]));

    const openNow = isOfficeOpenNow(office.operatingHours as Record<string, { open?: string; close?: string; isOpen: boolean }>);

    const enrichedServices = office.offerings.map((offering) => {
      const service = serviceMap.get(offering.serviceId.toString());
      return {
        serviceId: offering.serviceId.toString(),
        name: service?.identifiers ?? { en: "Unknown", am: "ያልታወቀ" },
        category: service?.category,
        isAvailable: offering.isAvailable,
        operationalNotes: offering.operationalNotes,
        fees: offering.fees,
        temporaryNote: offering.temporaryNote,
        bestTimeToVisit: offering.bestTimeToVisit,
      };
    });

    res.json(
      createSuccessResponse({
        _id: office._id.toString(),
        name: office.name,
        type: office.type,
        jurisdiction: office.jurisdiction,
        location: office.location.coordinates,
        address: office.address,
        contact: office.contact,
        operatingHours: office.operatingHours,
        openNow,
        services: enrichedServices,
        lastVerifiedAt: office.lastVerifiedAt,
      })
    );
  } catch (error) {
    console.error("Office detail error:", error);
    res.status(500).json(createErrorResponse("DATABASE_ERROR", "Failed to fetch office details"));
  }
});

export default router;
