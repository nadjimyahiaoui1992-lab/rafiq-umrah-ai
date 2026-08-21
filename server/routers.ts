import { COOKIE_NAME } from "../shared/const.js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { answerMarketplaceQuestion } from "./advisor.js";
import { systemRouter } from "./_core/systemRouter.js";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc.js";
import {
  archiveAgencyOffer,
  createAgencyOffer,
  createUmrahRequest,
  ensureProfile,
  getAdminSnapshot,
  getAgencyDashboard,
  getOwnedAgency,
  getPublicAgency,
  getPublicOffer,
  getPublicOffersByIds,
  listAdminAgencies,
  listMyFavorites,
  listMyRequests,
  listPublicAgencies,
  listPublicOffers,
  registerAgency,
  setAgencyVerification,
  toggleFavorite,
  trackOfferEvent,
} from "./marketplace.js";

const phoneSchema = z.string().regex(/^\+213[5-7]\d{8}$/, "أدخل رقمًا جزائريًا صالحًا بصيغة +213");

export const requestSchema = z.object({
  wilaya: z.string().min(2).max(80),
  peopleCount: z.number().int().min(1).max(12),
  travelDate: z.coerce.date().optional(),
  budgetDzd: z.number().positive().max(10_000_000),
  desiredDurationDays: z.number().int().min(3).max(45).optional(),
  hotelPreference: z.string().max(100).optional(),
  maxDistanceMeters: z.number().int().positive().max(100_000).optional(),
  flightPreference: z.enum(["direct", "stopover", "any"]),
  requestedServices: z.array(z.string().max(80)).max(12).optional(),
  note: z.string().max(1000).optional(),
  contactPhoneE164: phoneSchema,
  consentToShare: z.literal(true),
});

export const offerSchema = z.object({
  title: z.string().min(5).max(220),
  summary: z.string().max(3000).optional(),
  priceDzd: z.number().positive().max(10_000_000),
  departureWilaya: z.string().min(2).max(80),
  departureDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  durationDays: z.number().int().min(3).max(45),
  makkahHotel: z.string().max(180).optional(),
  madinahHotel: z.string().max(180).optional(),
  hotelStars: z.number().int().min(1).max(5).optional(),
  distanceToHaramMeters: z.number().int().min(0).max(100_000).optional(),
  flightType: z.enum(["direct", "stopover", "unknown"]),
  airline: z.string().max(120).optional(),
  transportIncluded: z.boolean(),
  mealsIncluded: z.boolean(),
  visaIncluded: z.boolean(),
  services: z.array(z.string().max(80)).max(16).optional(),
  seatsAvailable: z.number().int().min(0).max(1000).optional(),
  terms: z.string().max(5000).optional(),
  expiresAt: z.coerce.date(),
}).refine(value => value.returnDate > value.departureDate, {
  message: "تاريخ العودة يجب أن يلي تاريخ الذهاب.", path: ["returnDate"],
}).refine(value => value.expiresAt >= value.departureDate, {
  message: "لا يمكن أن ينتهي العرض قبل موعد السفر.", path: ["expiresAt"],
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  offers: router({
    list: publicProcedure.input(z.object({
      wilaya: z.string().min(2).max(80).optional(), maxPrice: z.number().positive().optional(),
      featuredOnly: z.boolean().optional(), limit: z.number().int().min(1).max(48).default(18),
    })).query(({ input }) => listPublicOffers(input)),
    byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
      const offer = await getPublicOffer(input.id);
      if (!offer) throw new TRPCError({ code: "NOT_FOUND", message: "العرض غير متاح." });
      return offer;
    }),
    compare: publicProcedure.input(z.object({ ids: z.array(z.string().uuid()).min(2).max(3) })).query(({ input }) => getPublicOffersByIds(input.ids)),
    track: publicProcedure.input(z.object({ offerId: z.string().uuid(), eventType: z.enum(["view", "request", "whatsapp_click", "compare"]) })).mutation(async ({ input }) => {
      await trackOfferEvent(input.offerId, input.eventType);
      return { success: true };
    }),
  }),
  agencies: router({
    list: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(60).default(30) })).query(({ input }) => listPublicAgencies(input.limit)),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(3).max(120) })).query(async ({ input }) => {
      const agency = await getPublicAgency(input.slug);
      if (!agency) throw new TRPCError({ code: "NOT_FOUND", message: "الوكالة غير متاحة." });
      return agency;
    }),
  }),
  advisor: router({
    answer: publicProcedure.input(z.object({ question: z.string().min(4).max(600) })).mutation(({ input }) => answerMarketplaceQuestion(input.question)),
  }),
  requests: router({
    create: publicProcedure.input(requestSchema).mutation(({ input, ctx }) => createUmrahRequest({ ...input, userOpenId: ctx.user?.openId })),
    mine: protectedProcedure.query(({ ctx }) => listMyRequests(ctx.user.openId)),
  }),
  account: router({
    profile: protectedProcedure.input(z.object({ phoneE164: phoneSchema.optional(), wilaya: z.string().max(80).optional(), preferredLocale: z.enum(["ar", "fr", "en"]).optional() })).mutation(({ ctx, input }) => ensureProfile(ctx.user.openId, input)),
    favorites: protectedProcedure.query(({ ctx }) => listMyFavorites(ctx.user.openId)),
    toggleFavorite: protectedProcedure.input(z.object({ offerId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const result = await toggleFavorite(ctx.user.openId, input.offerId);
      return result;
    }),
  }),
  agency: router({
    mine: protectedProcedure.query(({ ctx }) => getOwnedAgency(ctx.user.openId)),
    register: protectedProcedure.input(z.object({
      slug: z.string().regex(/^[a-z0-9-]{3,120}$/), legalName: z.string().min(3).max(180), displayName: z.string().min(3).max(180),
      city: z.string().max(120).optional(), whatsappE164: phoneSchema.optional(), description: z.string().max(3000).optional(),
    })).mutation(({ ctx, input }) => registerAgency(ctx.user.openId, input)),
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const dashboard = await getAgencyDashboard(ctx.user.openId);
      if (!dashboard) throw new TRPCError({ code: "NOT_FOUND", message: "سجل وكالتك أولًا للوصول إلى اللوحة." });
      return dashboard;
    }),
    createOffer: protectedProcedure.input(offerSchema).mutation(({ ctx, input }) => createAgencyOffer(ctx.user.openId, input)),
    archiveOffer: protectedProcedure.input(z.object({ offerId: z.string().uuid() })).mutation(({ ctx, input }) => archiveAgencyOffer(ctx.user.openId, input.offerId)),
  }),
  admin: router({
    snapshot: adminProcedure.query(() => getAdminSnapshot()),
    agencies: adminProcedure.query(() => listAdminAgencies()),
    setAgencyVerification: adminProcedure.input(z.object({
      agencyId: z.string().uuid(), status: z.enum(["verified", "rejected", "suspended"]), note: z.string().max(1000).optional(),
    })).mutation(({ ctx, input }) => setAgencyVerification(ctx.user.openId, input.agencyId, input.status, input.note)),
  }),
});

export type AppRouter = typeof appRouter;
