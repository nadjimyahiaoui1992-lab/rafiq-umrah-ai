import createApp from "../server/_core/app";

// Vercel invokes this Express-compatible handler for /api/trpc, OAuth, and storage routes.
export default createApp();
