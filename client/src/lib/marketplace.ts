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

export type SourceOffer = {
  id: string;
  title: string;
  departureWilaya: string;
  departureDate: string;
  durationDays: number;
  flightType: "direct" | "stopover" | "unknown";
  priceDzd: number;
  hotel: string | null;
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
};

/** عروض منشورة خارجيًا: للعرض المرجعي فقط وليست عروضًا نشطة أو وكالات موثقة. */
export const publishedSourceOffers: SourceOffer[] = [
  { id: "elomradz-948f67f5", title: "عمرة المولد النبوي الشريف 22 أوت 2026", departureWilaya: "تقرت", departureDate: "2026-08-22", durationDays: 15, flightType: "direct", priceDzd: 211000, hotel: null, sourceName: "ElOmraDZ", sourceUrl: "https://elomradz.com/offre/948f67f5-75ee-4bed-a266-5b35bde7ba2e", checkedAt: "2026-08-21" },
  { id: "elomradz-44b8642f", title: "عمرة 22 أوت 2026", departureWilaya: "سكيكدة", departureDate: "2026-08-22", durationDays: 15, flightType: "direct", priceDzd: 195000, hotel: null, sourceName: "ElOmraDZ", sourceUrl: "https://elomradz.com/offre/44b8642f-c96a-4a58-940b-f4a43dc144a2", checkedAt: "2026-08-21" },
  { id: "elomradz-a6d3dfa2", title: "عمرة 23 أوت 2026", departureWilaya: "وهران", departureDate: "2026-08-23", durationDays: 15, flightType: "stopover", priceDzd: 165000, hotel: null, sourceName: "ElOmraDZ", sourceUrl: "https://elomradz.com/offre/a6d3dfa2-0141-45e8-bfcc-74885d381fb8", checkedAt: "2026-08-21" },
  { id: "elomradz-7bfdcdc5", title: "عمرة 23 أوت 2026", departureWilaya: "عنابة", departureDate: "2026-08-23", durationDays: 15, flightType: "direct", priceDzd: 205000, hotel: null, sourceName: "ElOmraDZ", sourceUrl: "https://elomradz.com/offre/7bfdcdc5-00ce-4157-a948-625d23176ada", checkedAt: "2026-08-21" },
  { id: "ahdjez-200", title: "عرض عمرة سبتمبر", departureWilaya: "الجزائر", departureDate: "2026-09-05", durationDays: 15, flightType: "unknown", priceDzd: 155000, hotel: "نور المسك / زهرة الفرسان / منارات غزة (400م)", sourceName: "أحجز", sourceUrl: "https://ahdjez.com/ar/umrah/details/200/", checkedAt: "2026-08-21" },
  { id: "ahdjez-210", title: "عرض عمرة سبتمبر", departureWilaya: "تقرت", departureDate: "2026-09-03", durationDays: 15, flightType: "unknown", priceDzd: 196000, hotel: "مكة رياض الضيافة (900م)", sourceName: "أحجز", sourceUrl: "https://ahdjez.com/ar/umrah/details/210/", checkedAt: "2026-08-21" },
  { id: "ahdjez-190", title: "عرض عمرة 31 أوت 2026", departureWilaya: "الجزائر", departureDate: "2026-08-31", durationDays: 15, flightType: "unknown", priceDzd: 159000, hotel: "الصفافات (>1200م)", sourceName: "أحجز", sourceUrl: "https://ahdjez.com/ar/umrah/details/190/", checkedAt: "2026-08-21" },
];

export const sourceFlightLabel = (flight: SourceOffer["flightType"]) => flight === "direct" ? "مباشرة" : flight === "stopover" ? "غير مباشرة" : "غير مذكور";
export const sourceDateLabel = (date: string) => new Intl.DateTimeFormat("ar-DZ", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
