/**
 * Vercel Serverless Function — API entry point.
 *
 * Vercel automatically wraps this exported Express app as a serverless
 * function. All requests to /api/* are rewritten here (see vercel.json).
 * Do NOT call app.listen() — Vercel handles the HTTP server.
 *
 * Required environment variables (set in Vercel project settings):
 *   DATABASE_URL   — PostgreSQL connection string (e.g. Neon, Supabase, Railway)
 *   REPL_ID        — Your Replit app ID, used as the OIDC client_id
 *   ISSUER_URL     — OIDC issuer (defaults to https://replit.com/oidc)
 *   SESSION_SECRET — Secret for session signing (any long random string)
 */
import app from '../artifacts/api-server/src/app';

export default app;
