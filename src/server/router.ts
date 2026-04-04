import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import {
  verifyAdminPassword,
  verifyOwnerPassword,
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  signJWT,
} from "./db";

const SESSION_COOKIE = "renes-session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const appRouter = router({
  admin: router({
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          password: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!input.email || !input.password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email and password are required",
          });
        }

        // Guard: JWT_SECRET must be configured
        if (!ctx.jwtSecret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Server misconfiguration: JWT_SECRET is not set",
          });
        }

        // Try admin table first, then owner table
        const admin = await verifyAdminPassword(ctx.db, input.email, input.password);
        const role: "admin" | "owner" | null = admin
          ? "admin"
          : (await verifyOwnerPassword(ctx.db, input.email, input.password))
          ? "owner"
          : null;

        if (!role) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const token = await signJWT(
          {
            email: input.email,
            role,
            exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
          },
          ctx.jwtSecret
        );

        ctx.setCookie(
          `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`
        );

        return { success: true };
      }),

    me: publicProcedure.query(({ ctx }) => {
      return ctx.user ?? null;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.setCookie(
        `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
      );
      return { success: true };
    }),
  }),

  appointments: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerPhone: z.string().min(1),
          customerEmail: z.string().email(),
          serviceAddress: z.string().min(1),
          services: z.array(z.string()).min(1),
          preferredDate: z.date().optional(),
          preferredTime: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await createAppointment(ctx.db, input);
        return { success: true, id: result.id };
      }),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        return getAppointments(ctx.db, input);
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await updateAppointmentStatus(ctx.db, input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
