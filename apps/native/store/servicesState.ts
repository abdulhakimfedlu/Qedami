import { observable } from '@legendapp/state';

export interface SearchResult {
  type: 'office_service_match';
  proximity?: {
    distanceKm: number;
    category: 'nearby' | 'moderate' | 'distant';
  };
  office: {
    _id: string;
    name: string;
    type: string;
    address: {
      subcity: string;
      kebeleNumber?: string;
      landmark?: string;
    };
    openNow?: boolean;
  };
  matchedService: {
    _id: string;
    name: {
      en: string;
      am: string;
    };
    category: string;
    isAvailable: boolean;
    operationalNotes?: {
      en: string;
      am: string;
    };
  };
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export const servicesState = observable<SearchState>({
  query: '',
  results: [],
  loading: false,
  error: null,
});