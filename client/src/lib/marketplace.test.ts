import { describe, expect, it } from "vitest";
import { MarketplaceOffer, publishedSourceOffers, scoreOffer } from "./marketplace";

const offer: MarketplaceOffer = {
  id: "offer-1", title: "عرض منظم", summary: null, priceDzd: "220000", departureWilaya: "الجزائر",
  departureDate: new Date("2026-10-01"), returnDate: new Date("2026-10-13"), durationDays: 12,
  makkahHotel: null, madinahHotel: null, hotelStars: null, distanceToHaramMeters: 700,
  flightType: "direct", transportIncluded: true, mealsIncluded: false, seatsAvailable: null,
  priceUpdatedAt: new Date(), isFeatured: false, agencyName: "وكالة اختبار", agencySlug: "test-agency", agencyVerification: "verified",
};

describe("publishedSourceOffers", () => {
  it("keeps every imported source offer traceable", () => {
    expect(publishedSourceOffers.length).toBeGreaterThan(0);
    for (const sourceOffer of publishedSourceOffers) {
      expect(sourceOffer.sourceUrl).toMatch(/^https:\/\//);
      expect(sourceOffer.sourceName.length).toBeGreaterThan(0);
      expect(sourceOffer.checkedAt).toMatch(/^2026-08-21$/);
      expect(sourceOffer.priceDzd).toBeGreaterThan(0);
      expect(sourceOffer.departureWilaya.length).toBeGreaterThan(0);
    }
  });
});

describe("scoreOffer", () => {
  it("prioritizes a verified offer that matches budget, wilaya, duration, and flight", () => {
    expect(scoreOffer(offer, { budget: 250000, wilaya: "الجزائر", flight: "direct", duration: 12 })).toBe(100);
  });

  it("penalizes a budget and route mismatch without returning an invalid score", () => {
    const result = scoreOffer(offer, { budget: 100000, wilaya: "وهران", flight: "stopover", duration: 25 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(50);
  });
});
