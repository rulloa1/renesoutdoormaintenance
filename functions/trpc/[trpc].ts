import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../src/server/router";
import { createDb, verifyJWT } from "../../src/server/db";
import type { Session } from "../../src/server/context";

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (!ctx.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable not set.");
    return new Response("Internal Server Error: JWT_SECRET not configured.", { status: 500 });
  }

  const responseHeaders = new Headers();

  // Parse session cookie
  const cookieHeader = ctx.request.headers.get("Cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("renes-session="))
    ?.slice("renes-session=".length);

  let user: Session | null = null;
  if (token) {
    user = await verifyJWT<Session>(token, ctx.env.JWT_SECRET);
  }

  const db = createDb(ctx.env.DB);

  return fetchRequestHandler({
    endpoint: "/trpc",
    req: ctx.request,
    router: appRouter,
    createContext: () => ({
      db,
      user,
      jwtSecret: ctx.env.JWT_SECRET,
      setCookie: (cookieStr: string) => {
        responseHeaders.append("Set-Cookie", cookieStr);
      },
    }),
    responseMeta: () => ({
      headers: responseHeaders,
    }),
  });
};
