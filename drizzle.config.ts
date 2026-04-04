import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: "c773fdc5-8e6d-4321-a23c-1ab4cf10c8f0",
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
