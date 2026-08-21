export type MarketplaceOffer = {
  id: string;
  title: string;
  summary: string | null;
  priceDzd: string | number;
  departureWilaya: string;
  departureDate: Date;
  returnDate: Date;
  durationDays: number;
  makkahHotel: string | null;
  madinahHotel: string | null;
  hotelStars: number | null;
  distanceToHaramMeters: number | null;
  flightType: "direct" | "stopover" | "unknown";
  transportIncluded: boolean;
  mealsIncluded: boolean;
  seatsAvailable: number | null;
  priceUpdatedAt: Date;
  isFeatured: boolean;
  agencyName: string;
  agencySlug: string;
  agencyVerification: "pending" | "verified" | "rejected" | "suspended";
};

export const formatDzd = (value: string | number) => `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value))} دج`;
export const formatArabicDate = (value: Date) => new Intl.DateTimeFormat("ar-DZ", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export function scoreOffer(offer: MarketplaceOffer, input: { budget: number; wilaya?: string; flight: "any" | "direct" | "stopover"; duration?: number }) {
  let score = 50;
  if (Number(offer.priceDzd) <= input.budget) score += 25;
  else score -= Math.min(25, Math.round((Number(offer.priceDzd) - input.budget) / Math.max(input.budget, 1) * 100));
  if (!input.wilaya || offer.departureWilaya === input.wilaya) score += 14;
  if (input.flight === "any" || offer.flightType === input.flight) score += 8;
  if (!input.duration || Math.abs(offer.durationDays - input.duration) <= 2) score += 8;
  if (offer.distanceToHaramMeters !== null && offer.distanceToHaramMeters <= 800) score += 4;
  return Math.max(0, Math.min(100, score));
}
