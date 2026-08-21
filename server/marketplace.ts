import { and, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  agencies,
  auditLogs,
  favorites,
  leads,
  offerEvents,
  offers,
  profiles,
  umrahRequests,
  users,
} from "../drizzle/schema";
import { getDb, getUserByOpenId } from "./db";

export const activeOfferWhere = () => and(
  eq(offers.status, "active"),
  gt(offers.expiresAt, new Date()),
  eq(agencies.verificationStatus, "verified"),
);

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db;
}

export async function resolveAppUser(openId: string) {
  return getUserByOpenId(openId);
}

export async function listPublicOffers(input: { wilaya?: string; maxPrice?: number; featuredOnly?: boolean; limit: number }) {
  const db = await requireDb();
  const conditions = [activeOfferWhere()];
  if (input.wilaya) conditions.push(eq(offers.departureWilaya, input.wilaya));
  if (input.maxPrice) conditions.push(sql`${offers.priceDzd} <= ${input.maxPrice}`);
  if (input.featuredOnly) conditions.push(eq(offers.isFeatured, true));

  return db.select({
    id: offers.id,
    title: offers.title,
    summary: offers.summary,
    priceDzd: offers.priceDzd,
    departureWilaya: offers.departureWilaya,
    departureDate: offers.departureDate,
    returnDate: offers.returnDate,
    durationDays: offers.durationDays,
    makkahHotel: offers.makkahHotel,
    madinahHotel: offers.madinahHotel,
    hotelStars: offers.hotelStars,
    distanceToHaramMeters: offers.distanceToHaramMeters,
    flightType: offers.flightType,
    transportIncluded: offers.transportIncluded,
    mealsIncluded: offers.mealsIncluded,
    seatsAvailable: offers.seatsAvailable,
    priceUpdatedAt: offers.priceUpdatedAt,
    isFeatured: offers.isFeatured,
    agencyName: agencies.displayName,
    agencySlug: agencies.slug,
    agencyVerification: agencies.verificationStatus,
  }).from(offers)
    .innerJoin(agencies, eq(offers.agencyId, agencies.id))
    .where(and(...conditions))
    .orderBy(desc(offers.isFeatured), desc(offers.priceUpdatedAt))
    .limit(input.limit);
}

export async function getPublicOffer(id: string) {
  const db = await requireDb();
  const rows = await db.select({
    id: offers.id,
    agencyId: offers.agencyId,
    title: offers.title,
    summary: offers.summary,
    priceDzd: offers.priceDzd,
    departureWilaya: offers.departureWilaya,
    departureDate: offers.departureDate,
    returnDate: offers.returnDate,
    durationDays: offers.durationDays,
    makkahHotel: offers.makkahHotel,
    madinahHotel: offers.madinahHotel,
    hotelStars: offers.hotelStars,
    distanceToHaramMeters: offers.distanceToHaramMeters,
    flightType: offers.flightType,
    airline: offers.airline,
    transportIncluded: offers.transportIncluded,
    mealsIncluded: offers.mealsIncluded,
    visaIncluded: offers.visaIncluded,
    services: offers.services,
    seatsAvailable: offers.seatsAvailable,
    terms: offers.terms,
    priceUpdatedAt: offers.priceUpdatedAt,
    sourceLabel: offers.sourceLabel,
    sourceUrl: offers.sourceUrl,
    sourceCheckedAt: offers.sourceCheckedAt,
    agencyName: agencies.displayName,
    agencySlug: agencies.slug,
    agencyWhatsapp: agencies.whatsappE164,
    agencyVerification: agencies.verificationStatus,
  }).from(offers)
    .innerJoin(agencies, eq(offers.agencyId, agencies.id))
    .where(and(eq(offers.id, id), activeOfferWhere()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublicOffersByIds(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids)).slice(0, 3);
  const rows = await Promise.all(uniqueIds.map(getPublicOffer));
  return rows.filter((row): row is NonNullable<typeof row> => row !== null);
}

export async function trackOfferEvent(offerId: string, eventType: "view" | "request" | "whatsapp_click" | "compare" | "favorite") {
  const db = await requireDb();
  const [offer] = await db.select({ agencyId: offers.agencyId }).from(offers).where(eq(offers.id, offerId)).limit(1);
  if (!offer) return;
  await db.insert(offerEvents).values({ id: randomUUID(), offerId, agencyId: offer.agencyId, eventType });
}

export async function createUmrahRequest(input: {
  userOpenId?: string;
  wilaya: string; peopleCount: number; travelDate?: Date; budgetDzd: number; desiredDurationDays?: number;
  hotelPreference?: string; maxDistanceMeters?: number; flightPreference: "direct" | "stopover" | "any";
  requestedServices?: string[]; note?: string; contactPhoneE164: string; consentToShare: boolean;
}) {
  const db = await requireDb();
  const appUser = input.userOpenId ? await resolveAppUser(input.userOpenId) : undefined;
  const id = randomUUID();
  await db.insert(umrahRequests).values({
    id, userId: appUser?.id, wilaya: input.wilaya, peopleCount: input.peopleCount, travelDate: input.travelDate,
    budgetDzd: input.budgetDzd.toFixed(2), desiredDurationDays: input.desiredDurationDays,
    hotelPreference: input.hotelPreference, maxDistanceMeters: input.maxDistanceMeters, flightPreference: input.flightPreference,
    requestedServices: input.requestedServices, note: input.note, contactPhoneE164: input.contactPhoneE164,
    consentToShare: input.consentToShare,
  });
  const matchedAgencyCount = input.consentToShare ? await matchRequestToAgencies(id, input) : 0;
  return { id, matchedAgencyCount };
}

function leadMatchScore(input: { wilaya: string; budgetDzd: number; flightPreference: "direct" | "stopover" | "any"; desiredDurationDays?: number }, offer: { departureWilaya: string; priceDzd: string; flightType: string; durationDays: number }) {
  let score = 35;
  if (offer.departureWilaya === input.wilaya) score += 30;
  if (Number(offer.priceDzd) <= input.budgetDzd) score += 25;
  if (input.flightPreference === "any" || offer.flightType === input.flightPreference) score += 7;
  if (!input.desiredDurationDays || Math.abs(offer.durationDays - input.desiredDurationDays) <= 2) score += 3;
  return Math.min(100, score);
}

async function matchRequestToAgencies(requestId: string, input: { wilaya: string; budgetDzd: number; flightPreference: "direct" | "stopover" | "any"; desiredDurationDays?: number }) {
  const db = await requireDb();
  const candidates = await db.select({ agencyId: agencies.id, departureWilaya: offers.departureWilaya, priceDzd: offers.priceDzd, flightType: offers.flightType, durationDays: offers.durationDays })
    .from(offers).innerJoin(agencies, eq(offers.agencyId, agencies.id)).where(activeOfferWhere()).limit(100);
  const strongestByAgency = new Map<string, number>();
  for (const candidate of candidates) {
    const score = leadMatchScore(input, candidate);
    const current = strongestByAgency.get(candidate.agencyId) ?? 0;
    if (score > current) strongestByAgency.set(candidate.agencyId, score);
  }
  const matches = Array.from(strongestByAgency.entries()).filter(([, score]) => score >= 60).sort((a, b) => b[1] - a[1]).slice(0, 3);
  for (const [agencyId, matchScore] of matches) {
    await db.insert(leads).values({ id: randomUUID(), requestId, agencyId, matchScore, status: "shared", contactSharedAt: new Date() }).onDuplicateKeyUpdate({ set: { matchScore, status: "shared", contactSharedAt: new Date() } });
  }
  if (matches.length) await db.update(umrahRequests).set({ status: "matched" }).where(eq(umrahRequests.id, requestId));
  return matches.length;
}

export async function listMyRequests(openId: string) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) return [];
  return db.select({
    id: umrahRequests.id, wilaya: umrahRequests.wilaya, peopleCount: umrahRequests.peopleCount,
    budgetDzd: umrahRequests.budgetDzd, travelDate: umrahRequests.travelDate, status: umrahRequests.status,
    createdAt: umrahRequests.createdAt,
  }).from(umrahRequests).where(eq(umrahRequests.userId, appUser.id)).orderBy(desc(umrahRequests.createdAt));
}

export async function toggleFavorite(openId: string, offerId: string) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) throw new Error("Application user is unavailable");
  const existing = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.userId, appUser.id), eq(favorites.offerId, offerId))).limit(1);
  if (existing[0]) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return { active: false };
  }
  await db.insert(favorites).values({ id: randomUUID(), userId: appUser.id, offerId });
  await trackOfferEvent(offerId, "favorite");
  return { active: true };
}

export async function listMyFavorites(openId: string) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) return [];
  return db.select({ offerId: offers.id, title: offers.title, priceDzd: offers.priceDzd, agencyName: agencies.displayName, createdAt: favorites.createdAt })
    .from(favorites).innerJoin(offers, eq(favorites.offerId, offers.id)).innerJoin(agencies, eq(offers.agencyId, agencies.id))
    .where(eq(favorites.userId, appUser.id)).orderBy(desc(favorites.createdAt));
}

export async function getOwnedAgency(openId: string) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) return null;
  const rows = await db.select().from(agencies).where(eq(agencies.ownerUserId, appUser.id)).limit(1);
  return rows[0] ?? null;
}

export async function listPublicAgencies(limit: number) {
  const db = await requireDb();
  return db.select({
    id: agencies.id, slug: agencies.slug, displayName: agencies.displayName, description: agencies.description,
    city: agencies.city, websiteUrl: agencies.websiteUrl, verificationStatus: agencies.verificationStatus,
    lastProfileUpdatedAt: agencies.lastProfileUpdatedAt,
  }).from(agencies).where(eq(agencies.verificationStatus, "verified")).orderBy(desc(agencies.lastProfileUpdatedAt)).limit(limit);
}

export async function getPublicAgency(slug: string) {
  const db = await requireDb();
  const rows = await db.select({
    id: agencies.id, slug: agencies.slug, displayName: agencies.displayName, description: agencies.description,
    city: agencies.city, address: agencies.address, websiteUrl: agencies.websiteUrl, whatsappE164: agencies.whatsappE164,
    verificationStatus: agencies.verificationStatus, lastProfileUpdatedAt: agencies.lastProfileUpdatedAt,
  }).from(agencies).where(and(eq(agencies.slug, slug), eq(agencies.verificationStatus, "verified"))).limit(1);
  const agency = rows[0];
  if (!agency) return null;
  const activeOffers = await db.select().from(offers)
    .where(and(eq(offers.agencyId, agency.id), eq(offers.status, "active"), gt(offers.expiresAt, new Date())))
    .orderBy(desc(offers.priceUpdatedAt));
  return { ...agency, offers: activeOffers };
}

export async function registerAgency(openId: string, input: { slug: string; legalName: string; displayName: string; city?: string; whatsappE164?: string; description?: string }) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) throw new Error("Application user is unavailable");
  const id = randomUUID();
  await db.transaction(async tx => {
    await tx.update(users).set({ role: "agency" }).where(eq(users.id, appUser.id));
    await tx.insert(agencies).values({ id, ownerUserId: appUser.id, ...input });
  });
  return { id };
}

export async function getAgencyDashboard(openId: string) {
  const db = await requireDb();
  const agency = await getOwnedAgency(openId);
  if (!agency) return null;
  const [offerCount] = await db.select({ value: sql<number>`count(*)` }).from(offers).where(eq(offers.agencyId, agency.id));
  const [leadCount] = await db.select({ value: sql<number>`count(*)` }).from(leads).where(eq(leads.agencyId, agency.id));
  const [viewCount] = await db.select({ value: sql<number>`count(*)` }).from(offerEvents).where(and(eq(offerEvents.agencyId, agency.id), eq(offerEvents.eventType, "view")));
  const [whatsappCount] = await db.select({ value: sql<number>`count(*)` }).from(offerEvents).where(and(eq(offerEvents.agencyId, agency.id), eq(offerEvents.eventType, "whatsapp_click")));
  const ownOffers = await db.select().from(offers).where(eq(offers.agencyId, agency.id)).orderBy(desc(offers.updatedAt)).limit(30);
  const sharedLeads = await db.select({ id: leads.id, matchScore: leads.matchScore, status: leads.status, createdAt: leads.createdAt, wilaya: umrahRequests.wilaya, peopleCount: umrahRequests.peopleCount, budgetDzd: umrahRequests.budgetDzd, travelDate: umrahRequests.travelDate, flightPreference: umrahRequests.flightPreference, note: umrahRequests.note, contactPhoneE164: umrahRequests.contactPhoneE164 })
    .from(leads).innerJoin(umrahRequests, eq(leads.requestId, umrahRequests.id)).where(and(eq(leads.agencyId, agency.id), eq(leads.status, "shared"))).orderBy(desc(leads.createdAt)).limit(50);
  return { agency, metrics: { offers: Number(offerCount?.value ?? 0), leads: Number(leadCount?.value ?? 0), views: Number(viewCount?.value ?? 0), whatsappClicks: Number(whatsappCount?.value ?? 0) }, offers: ownOffers, leads: sharedLeads };
}

export async function createAgencyOffer(openId: string, input: {
  title: string; summary?: string; priceDzd: number; departureWilaya: string; departureDate: Date; returnDate: Date;
  durationDays: number; makkahHotel?: string; madinahHotel?: string; hotelStars?: number; distanceToHaramMeters?: number;
  flightType: "direct" | "stopover" | "unknown"; airline?: string; transportIncluded: boolean; mealsIncluded: boolean;
  visaIncluded: boolean; services?: string[]; seatsAvailable?: number; terms?: string; expiresAt: Date;
}) {
  const db = await requireDb();
  const agency = await getOwnedAgency(openId);
  if (!agency) throw new Error("Agency account required");
  const id = randomUUID();
  await db.insert(offers).values({
    id, agencyId: agency.id, title: input.title, summary: input.summary, priceDzd: input.priceDzd.toFixed(2),
    departureWilaya: input.departureWilaya, departureDate: input.departureDate, returnDate: input.returnDate,
    durationDays: input.durationDays, makkahHotel: input.makkahHotel, madinahHotel: input.madinahHotel,
    hotelStars: input.hotelStars, distanceToHaramMeters: input.distanceToHaramMeters, flightType: input.flightType,
    airline: input.airline, transportIncluded: input.transportIncluded, mealsIncluded: input.mealsIncluded,
    visaIncluded: input.visaIncluded, services: input.services, seatsAvailable: input.seatsAvailable,
    terms: input.terms, expiresAt: input.expiresAt, status: "draft",
  });
  return { id };
}

export async function archiveAgencyOffer(openId: string, offerId: string) {
  const db = await requireDb();
  const agency = await getOwnedAgency(openId);
  if (!agency) throw new Error("Agency account required");
  const result = await db.update(offers).set({ status: "archived" })
    .where(and(eq(offers.id, offerId), eq(offers.agencyId, agency.id)));
  if (result[0].affectedRows !== 1) throw new Error("Offer not found or not owned by agency");
}

export async function getAdminSnapshot() {
  const db = await requireDb();
  const [agencyCount] = await db.select({ value: sql<number>`count(*)` }).from(agencies);
  const [verifiedCount] = await db.select({ value: sql<number>`count(*)` }).from(agencies).where(eq(agencies.verificationStatus, "verified"));
  const [pendingCount] = await db.select({ value: sql<number>`count(*)` }).from(agencies).where(eq(agencies.verificationStatus, "pending"));
  const [activeOfferCount] = await db.select({ value: sql<number>`count(*)` }).from(offers).where(eq(offers.status, "active"));
  const [leadCount] = await db.select({ value: sql<number>`count(*)` }).from(leads);
  return { agencies: Number(agencyCount?.value ?? 0), verifiedAgencies: Number(verifiedCount?.value ?? 0), pendingAgencies: Number(pendingCount?.value ?? 0), activeOffers: Number(activeOfferCount?.value ?? 0), leads: Number(leadCount?.value ?? 0) };
}

export async function listAdminAgencies() {
  const db = await requireDb();
  return db.select({
    id: agencies.id, slug: agencies.slug, displayName: agencies.displayName, legalName: agencies.legalName,
    city: agencies.city, verificationStatus: agencies.verificationStatus, createdAt: agencies.createdAt,
    ownerName: users.name, ownerEmail: users.email,
  }).from(agencies).innerJoin(users, eq(agencies.ownerUserId, users.id)).orderBy(desc(agencies.createdAt)).limit(100);
}

export async function writeAuditLog(actorUserId: number, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
  const db = await requireDb();
  await db.insert(auditLogs).values({ id: randomUUID(), actorUserId, action, entityType, entityId, metadata });
}

export async function setAgencyVerification(actorOpenId: string, agencyId: string, status: "verified" | "rejected" | "suspended", note?: string) {
  const db = await requireDb();
  const actor = await resolveAppUser(actorOpenId);
  if (!actor || !["admin", "super_admin"].includes(actor.role)) throw new Error("Not authorized");
  await db.update(agencies).set({ verificationStatus: status, verificationNote: note }).where(eq(agencies.id, agencyId));
  await writeAuditLog(actor.id, `agency.${status}`, "agency", agencyId, note ? { note } : undefined);
}

export async function ensureProfile(openId: string, input: { phoneE164?: string; wilaya?: string; preferredLocale?: "ar" | "fr" | "en" }) {
  const db = await requireDb();
  const appUser = await resolveAppUser(openId);
  if (!appUser) throw new Error("Application user is unavailable");
  const existing = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, appUser.id)).limit(1);
  if (existing[0]) {
    await db.update(profiles).set(input).where(eq(profiles.id, existing[0].id));
    return { id: existing[0].id };
  }
  const id = randomUUID();
  await db.insert(profiles).values({ id, userId: appUser.id, ...input });
  return { id };
}
