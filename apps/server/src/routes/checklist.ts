import { Router, type Request, type Response } from "express";
import { Office, Service } from "@Qedami/db";
import { isOfficeOpenNow, getTodaysHours, createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

router.get("/api/v1/scout/checklist", async (req, res) => {
  try {
    const { officeId, serviceId } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json(createErrorResponse("MISSING_PARAMS", "Both officeId and serviceId are required"));
    }

    const [office, service] = await Promise.all([
      Office.findById(String(officeId)).lean(),
      Service.findById(String(serviceId)).lean(),
    ]);

    if (!office) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "Office not found"));
    }

    if (!service) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "Service not found"));
    }

    const offering = office.offerings.find((o) => o.serviceId.toString() === String(serviceId));

    if (!offering) {
      return res.status(404).json(createErrorResponse("NOT_FOUND", "This service is not offered at this office"));
    }

    const openNow = isOfficeOpenNow(office.operatingHours as Record<string, { open?: string; close?: string; isOpen: boolean }>);
    const todaysHours = getTodaysHours(office.operatingHours as Record<string, { open?: string; close?: string; isOpen: boolean; note?: string }>);

    const requiredItems = [
      ...service.baseRequirements.required.map((req, idx) => ({
        id: `req_${idx + 1}`,
        item: req.item,
        description: req.description,
        source: "base" as const,
      })),
      ...(offering.additionalRequirements ?? []).map((req, idx) => ({
        id: `req_office_${idx + 1}`,
        item: req.item,
        description: req.description,
        source: "office" as const,
        warning: req.warning,
      })),
    ];

    const optionalItems = service.baseRequirements.optional.map((opt, idx) => ({
      id: `opt_${idx + 1}`,
      item: opt.item,
      description: opt.description,
      condition: opt.condition,
    }));

    const officeSpecificNotes: Array<{ en: string; am: string }> = [];
    if (offering.operationalNotes) {
      officeSpecificNotes.push(offering.operationalNotes);
    }
    if (offering.bestTimeToVisit) {
      officeSpecificNotes.push({
        en: `Best time to visit: ${offering.bestTimeToVisit}`,
        am: `ለመምጣት ጥሩ ጊዜ: ${offering.bestTimeToVisit}`,
      });
    }

    res.json(
      createSuccessResponse({
        office: {
          name: office.name,
          type: office.type,
          phone: office.contact.phone,
          openNow,
          todaysHours,
        },
        service: {
          name: service.identifiers,
          processingNotes: service.processingNotes,
          fees: offering.fees,
        },
        checklist: {
          required: requiredItems,
          optional: optionalItems,
        },
        officeSpecificNotes,
        lastVerifiedAt: office.lastVerifiedAt,
      })
    );
  } catch (error) {
    console.error("Checklist error:", error);
    res.status(500).json(createErrorResponse("DATABASE_ERROR", "Failed to fetch checklist"));
  }
});

export default router;
