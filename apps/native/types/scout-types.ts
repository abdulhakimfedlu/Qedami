// TypeScript interfaces for Scout feature data structures

export interface ServiceCardData {
  id: string;
  serviceName: string;
  description: string;
  category: string;
  documentsRequired: number;
  officeLocation: string;
  distance: string;
}

export interface OfficeCardData {
  id: string;
  officeName: string;
  officeType: string;
  address: string;
  distance: string;
  operatingHours: string;
  isOpen: boolean;
  servicesCount: number;
}

export interface Document {
  id: string;
  name: string;
  note?: string;
  checked?: boolean;
}

export interface DownloadableForm {
  id: string;
  name: string;
  fileType: string;
  downloadUrl: string;
}

export interface NearestOffice {
  name: string;
  address: string;
  distance: string;
  operatingHours: string;
  isOpen: boolean;
}

export interface ServiceDetail {
  id: string;
  serviceName: string;
  description: string;
  category: string;
  documents: Document[];
  forms: DownloadableForm[];
  nearestOffice: NearestOffice;
  relatedServices: ServiceCardData[];
}

export interface OfficeDetail {
  id: string;
  officeName: string;
  officeType: string;
  address: string;
  phone?: string;
  email?: string;
  operatingHours: string;
  isOpen: boolean;
  rating?: number;
  services: ServiceCardData[];
  facilities?: string[];
}
