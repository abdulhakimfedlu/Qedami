export interface Service {
  _id: string;
  identifiers: {
    en: string;
    am: string;
  };
  category: string;
  description: {
    en: string;
    am: string;
  };
  authorityLevel: string[];
  baseRequirements: {
    required: Requirement[];
    optional: Requirement[];
  };
  processingNotes: {
    en: string;
    am: string;
  };
  keywords: string[];
}

export interface Requirement {
  item: {
    en: string;
    am: string;
  };
  description: {
    en: string;
    am: string;
  };
  source?: 'base' | 'office';
  warning?: {
    en: string;
    am: string;
  };
}

export interface Office {
  _id: string;
  name: string;
  type: string;
  jurisdiction: string;
  location: [number, number]; // [longitude, latitude]
  address: {
    region: string;
    subcity: string;
    woreda?: string;
    kebeleNumber?: string;
    landmark?: string;
    directions?: {
      en: string;
      am: string;
    };
  };
  contact: {
    phone?: string;
    email?: string;
  };
  operatingHours: {
    [key: string]: {
      open?: string;
      close?: string;
      isOpen: boolean;
      note?: string;
    };
  };
  openNow?: boolean;
  services: OfficeService[];
  lastVerifiedAt: string;
}

export interface OfficeService {
  serviceId: string;
  name: {
    en: string;
    am: string;
  };
  isAvailable: boolean;
  temporaryNote?: string;
  operationalNotes?: {
    en: string;
    am: string;
  };
  fees?: {
    amount: number;
    currency: string;
    note?: string;
  };
}

export interface Suggestion {
  type: 'service' | 'category' | 'trending' | 'location_based';
  text: {
    en: string;
    am: string;
  };
  serviceId?: string;
  categoryId?: string;
  action?: string;
}

export interface ChecklistData {
  office: {
    name: string;
    type: string;
    phone?: string;
    openNow: boolean;
    todaysHours?: string;
  };
  service: {
    name: {
      en: string;
      am: string;
    };
    processingNotes?: {
      en: string;
      am: string;
    };
    fees?: {
      amount: number;
      currency: string;
    };
  };
  checklist: {
    required: Requirement[];
    optional: Requirement[];
  };
  officeSpecificNotes?: Array<{
    en: string;
    am: string;
  }>;
}