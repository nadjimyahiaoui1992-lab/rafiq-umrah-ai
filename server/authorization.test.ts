import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const baseContext = (user: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: () => undefined } as TrpcContext["res"],
});

describe("Marketplace authorization", () => {
  it("blocks an anonymous visitor from reading personal favorites", async () => {
    const caller = appRouter.createCaller(baseContext(null));
    await expect(caller.account.favorites()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks a standard user from admin metrics", async () => {
    const caller = appRouter.createCaller(baseContext({
      id: 1, openId: "standard-user", name: "Standard User", email: "user@example.com", loginMethod: "manus",
      role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));
    await expect(caller.admin.snapshot()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
