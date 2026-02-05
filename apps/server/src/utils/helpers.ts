export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDistanceCategory(distanceKm: number): "nearby" | "moderate" | "distant" {
  if (distanceKm < 5) return "nearby";
  if (distanceKm < 15) return "moderate";
  return "distant";
}

export function isOfficeOpenNow(operatingHours: Record<string, { open?: string; close?: string; isOpen: boolean }>): boolean {
  const now = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const day = days[now.getDay()];
  const hours = operatingHours[day];

  if (!hours || !hours.isOpen || !hours.open || !hours.close) {
    return false;
  }

  const currentTime = now.toTimeString().slice(0, 5);
  return currentTime >= hours.open && currentTime <= hours.close;
}

export function getTodaysHours(operatingHours: Record<string, { open?: string; close?: string; isOpen: boolean; note?: string }>): string {
  const now = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const day = days[now.getDay()];
  const hours = operatingHours[day];

  if (!hours || !hours.isOpen) {
    return "Closed";
  }

  return `${hours.open} - ${hours.close}${hours.note ? ` (${hours.note})` : ""}`;
}

export function createSuccessResponse<T>(data: T, meta: { locationUsed?: boolean; query?: string; resultCount?: number } = {}) {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      locationUsed: meta.locationUsed ?? false,
      ...meta,
    },
  };
}

export function createErrorResponse(code: string, message: string, field?: string) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(field && { field }),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}
