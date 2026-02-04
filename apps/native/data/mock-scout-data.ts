import { ServiceCardData } from "@/types/scout-types";

export const sampleServices: ServiceCardData[] = [
    {
        id: "1",
        serviceName: "Birth Certificate Registration",
        description:
            "Register a new birth and obtain an official birth certificate. Required for all newborns within 90 days.",
        category: "Identity",
        documentsRequired: 3,
        officeLocation: "Bole Kebele",
        distance: "2.3 km",
    },
    {
        id: "2",
        serviceName: "National ID Card Renewal",
        description:
            "Renew your expired or expiring national identification card. Process takes 5-7 business days.",
        category: "Identity",
        documentsRequired: 2,
        officeLocation: "Kirkos Sub-City",
        distance: "1.8 km",
    },
    {
        id: "3",
        serviceName: "Business License Application",
        description:
            "Apply for a new business license or renew an existing one. Required for all commercial activities.",
        category: "Business",
        documentsRequired: 5,
        officeLocation: "Addis Ketema",
        distance: "4.1 km",
    },
    {
        id: "4",
        serviceName: "Property Tax Payment",
        description:
            "Pay your annual property tax online or schedule an in-person appointment at your local office.",
        category: "Finance",
        documentsRequired: 2,
        officeLocation: "Yeka Sub-City",
        distance: "3.5 km",
    },
    {
        id: "5",
        serviceName: "Marriage Certificate",
        description:
            "Register your marriage and obtain an official marriage certificate recognized by all government institutions.",
        category: "Identity",
        documentsRequired: 4,
        officeLocation: "Arada Kebele",
        distance: "1.2 km",
    },
    {
        id: "6",
        serviceName: "Land Ownership Certificate",
        description:
            "Apply for or renew your land ownership certificate. Essential for property transactions and legal matters.",
        category: "Property",
        documentsRequired: 6,
        officeLocation: "Nifas Silk-Lafto",
        distance: "5.7 km",
    },
];
