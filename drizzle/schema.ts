import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "agency", "admin", "super_admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  phoneE164: varchar("phoneE164", { length: 18 }),
  wilaya: varchar("wilaya", { length: 80 }),
  preferredLocale: mysqlEnum("preferredLocale", ["ar", "fr", "en"]).default("ar").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("profiles_user_unique").on(table.userId)]);

export const agencies = mysqlTable("agencies", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ownerUserId: int("ownerUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
  slug: varchar("slug", { length: 120 }).notNull(),
  legalName: varchar("legalName", { length: 180 }).notNull(),
  displayName: varchar("displayName", { length: 180 }).notNull(),
  description: text("description"),
  city: varchar("city", { length: 120 }),
  address: text("address"),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  whatsappE164: varchar("whatsappE164", { length: 18 }),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected", "suspended"]).default("pending").notNull(),
  verificationNote: text("verificationNote"),
  logoKey: varchar("logoKey", { length: 500 }),
  lastProfileUpdatedAt: timestamp("lastProfileUpdatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("agencies_slug_unique").on(table.slug),
  uniqueIndex("agencies_owner_unique").on(table.ownerUserId),
  index("agencies_verification_idx").on(table.verificationStatus),
]);

export const agencyDocuments = mysqlTable("agency_documents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  agencyId: varchar("agencyId", { length: 36 }).notNull().references(() => agencies.id, { onDelete: "cascade" }),
  documentType: mysqlEnum("documentType", ["registration", "license", "identity", "other"]).notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  reviewStatus: mysqlEnum("reviewStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewedByUserId: int("reviewedByUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("agency_documents_agency_idx").on(table.agencyId)]);

export const offers = mysqlTable("offers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  agencyId: varchar("agencyId", { length: 36 }).notNull().references(() => agencies.id, { onDelete: "restrict" }),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary"),
  priceDzd: decimal("priceDzd", { precision: 12, scale: 2 }).notNull(),
  departureWilaya: varchar("departureWilaya", { length: 80 }).notNull(),
  departureDate: timestamp("departureDate").notNull(),
  returnDate: timestamp("returnDate").notNull(),
  durationDays: int("durationDays").notNull(),
  makkahHotel: varchar("makkahHotel", { length: 180 }),
  madinahHotel: varchar("madinahHotel", { length: 180 }),
  hotelStars: int("hotelStars"),
  distanceToHaramMeters: int("distanceToHaramMeters"),
  flightType: mysqlEnum("flightType", ["direct", "stopover", "unknown"]).default("unknown").notNull(),
  airline: varchar("airline", { length: 120 }),
  transportIncluded: boolean("transportIncluded").default(false).notNull(),
  mealsIncluded: boolean("mealsIncluded").default(false).notNull(),
  visaIncluded: boolean("visaIncluded").default(false).notNull(),
  services: json("services"),
  seatsAvailable: int("seatsAvailable"),
  terms: text("terms"),
  sourceLabel: varchar("sourceLabel", { length: 180 }),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceCheckedAt: timestamp("sourceCheckedAt"),
  priceUpdatedAt: timestamp("priceUpdatedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  status: mysqlEnum("status", ["draft", "pending_review", "active", "rejected", "archived", "expired"]).default("draft").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("offers_public_search_idx").on(table.status, table.departureWilaya, table.departureDate),
  index("offers_agency_idx").on(table.agencyId, table.status),
  index("offers_expiry_idx").on(table.expiresAt),
]);

export const offerMedia = mysqlTable("offer_media", {
  id: varchar("id", { length: 36 }).primaryKey(),
  offerId: varchar("offerId", { length: 36 }).notNull().references(() => offers.id, { onDelete: "cascade" }),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  altText: varchar("altText", { length: 200 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("offer_media_offer_idx").on(table.offerId, table.sortOrder)]);

export const umrahRequests = mysqlTable("umrah_requests", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  wilaya: varchar("wilaya", { length: 80 }).notNull(),
  peopleCount: int("peopleCount").notNull(),
  travelDate: timestamp("travelDate"),
  budgetDzd: decimal("budgetDzd", { precision: 12, scale: 2 }).notNull(),
  desiredDurationDays: int("desiredDurationDays"),
  hotelPreference: varchar("hotelPreference", { length: 100 }),
  maxDistanceMeters: int("maxDistanceMeters"),
  flightPreference: mysqlEnum("flightPreference", ["direct", "stopover", "any"]).default("any").notNull(),
  requestedServices: json("requestedServices"),
  note: text("note"),
  contactPhoneE164: varchar("contactPhoneE164", { length: 18 }).notNull(),
  consentToShare: boolean("consentToShare").default(false).notNull(),
  status: mysqlEnum("status", ["new", "matched", "closed", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("umrah_requests_user_idx").on(table.userId, table.createdAt), index("umrah_requests_status_idx").on(table.status)]);

export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  requestId: varchar("requestId", { length: 36 }).notNull().references(() => umrahRequests.id, { onDelete: "cascade" }),
  agencyId: varchar("agencyId", { length: 36 }).notNull().references(() => agencies.id, { onDelete: "cascade" }),
  matchScore: int("matchScore").notNull(),
  status: mysqlEnum("status", ["proposed", "shared", "contacted", "won", "lost", "closed"]).default("proposed").notNull(),
  contactSharedAt: timestamp("contactSharedAt"),
  agencyNote: text("agencyNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("leads_request_agency_unique").on(table.requestId, table.agencyId), index("leads_agency_status_idx").on(table.agencyId, table.status)]);

export const favorites = mysqlTable("favorites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: varchar("offerId", { length: 36 }).notNull().references(() => offers.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [uniqueIndex("favorites_user_offer_unique").on(table.userId, table.offerId)]);

export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  authorUserId: int("authorUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  agencyId: varchar("agencyId", { length: 36 }).references(() => agencies.id, { onDelete: "cascade" }),
  offerId: varchar("offerId", { length: 36 }).references(() => offers.id, { onDelete: "cascade" }),
  rating: int("rating").notNull(),
  body: text("body"),
  status: mysqlEnum("status", ["pending", "published", "reported", "hidden"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("reviews_agency_status_idx").on(table.agencyId, table.status), index("reviews_offer_status_idx").on(table.offerId, table.status)]);

export const offerEvents = mysqlTable("offer_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  offerId: varchar("offerId", { length: 36 }).notNull().references(() => offers.id, { onDelete: "cascade" }),
  agencyId: varchar("agencyId", { length: 36 }).notNull().references(() => agencies.id, { onDelete: "cascade" }),
  eventType: mysqlEnum("eventType", ["view", "request", "whatsapp_click", "compare", "favorite"]).notNull(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
}, table => [index("offer_events_offer_idx").on(table.offerId, table.eventType, table.occurredAt), index("offer_events_agency_idx").on(table.agencyId, table.eventType, table.occurredAt)]);

export const auditLogs = mysqlTable("audit_logs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  actorUserId: int("actorUserId").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 120 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 36 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("audit_logs_entity_idx").on(table.entityType, table.entityId), index("audit_logs_actor_idx").on(table.actorUserId, table.createdAt)]);

export const platformSettings = mysqlTable("platform_settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: json("value").notNull(),
  updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type Agency = typeof agencies.$inferSelect;
