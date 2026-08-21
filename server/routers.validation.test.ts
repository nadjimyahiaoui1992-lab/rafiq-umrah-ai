import { describe, expect, it } from "vitest";
import { offerSchema, requestSchema } from "./routers";

describe("Marketplace input validation", () => {
  it("rejects a request when consent or phone formatting is invalid", () => {
    const result = requestSchema.safeParse({
      wilaya: "الجزائر", peopleCount: 2, budgetDzd: 220000, flightPreference: "direct",
      contactPhoneE164: "0550000000", consentToShare: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an agency offer whose return precedes departure", () => {
    const result = offerSchema.safeParse({
      title: "عرض عمرة منظم", priceDzd: 220000, departureWilaya: "الجزائر",
      departureDate: "2026-10-20", returnDate: "2026-10-10", durationDays: 10,
      flightType: "direct", transportIncluded: true, mealsIncluded: false, visaIncluded: false,
      expiresAt: "2026-10-20",
    });
    expect(result.success).toBe(false);
  });
});
