import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;

// ─── Base64URL helpers (JWT spec requires URL-safe base64 with no padding) ────

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(base64url: string): string {
  const padded = base64url + "==".slice(0, (4 - (base64url.length % 4)) % 4);
  return padded.replace(/-/g, "+").replace(/_/g, "/");
}

// ─── Password hashing via Web Crypto PBKDF2 ──────────────────────────────────

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return {
    hash: btoa(String.fromCharCode(...new Uint8Array(hashBuffer))),
    salt: btoa(String.fromCharCode(...saltBytes)),
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const saltBytes = Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))) === storedHash;
}

// ─── JWT via HMAC-SHA256 (base64url encoded per RFC 7519) ─────────────────────

export async function signJWT(payload: object, secret: string): Promise<string> {
  const header = toBase64Url(btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = toBase64Url(btoa(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );
  const sig = toBase64Url(btoa(String.fromCharCode(...new Uint8Array(sigBuffer))));
  return `${header}.${body}.${sig}`;
}

export async function verifyJWT<T extends object>(
  token: string,
  secret: string
): Promise<T | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(atob(fromBase64Url(sig)), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;
    const payload = JSON.parse(atob(fromBase64Url(body))) as T & { exp?: number };
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── DB query helpers ─────────────────────────────────────────────────────────

export async function verifyAdminPassword(db: Db, email: string, password: string) {
  const admin = await db.query.adminUsers.findFirst({
    where: eq(schema.adminUsers.email, email),
  });
  if (!admin) return null;
  const valid = await verifyPassword(password, admin.passwordHash, admin.passwordSalt);
  if (!valid) return null;
  await db
    .update(schema.adminUsers)
    .set({ lastSignedIn: new Date().toISOString() })
    .where(eq(schema.adminUsers.id, admin.id));
  return admin;
}

export async function verifyOwnerPassword(db: Db, email: string, password: string) {
  const owner = await db.query.ownerUsers.findFirst({
    where: eq(schema.ownerUsers.email, email),
  });
  if (!owner) return null;
  const valid = await verifyPassword(password, owner.passwordHash, owner.passwordSalt);
  if (!valid) return null;
  await db
    .update(schema.ownerUsers)
    .set({ lastSignedIn: new Date().toISOString() })
    .where(eq(schema.ownerUsers.id, owner.id));
  return owner;
}

export async function createAppointment(
  db: Db,
  data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    serviceAddress: string;
    services: string[];
    preferredDate?: Date;
    preferredTime?: string;
    notes?: string;
  }
) {
  const result = await db
    .insert(schema.appointments)
    .values({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      serviceAddress: data.serviceAddress,
      services: JSON.stringify(data.services),
      preferredDate: data.preferredDate?.toISOString() ?? null,
      preferredTime: data.preferredTime ?? null,
      notes: data.notes ?? null,
      status: "pending",
    })
    .returning({ id: schema.appointments.id });
  return result[0];
}

export async function getAppointments(
  db: Db,
  opts: {
    limit: number;
    offset: number;
    status?: "pending" | "confirmed" | "completed" | "cancelled";
  }
) {
  const query = db.select().from(schema.appointments);
  const filtered = opts.status
    ? query.where(eq(schema.appointments.status, opts.status))
    : query;
  const rows = await filtered
    .limit(opts.limit)
    .offset(opts.offset)
    .orderBy(schema.appointments.createdAt);
  return rows.map((r) => ({
    ...r,
    services: JSON.parse(r.services) as string[],
    preferredDate: r.preferredDate ? new Date(r.preferredDate) : null,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  }));
}

export async function updateAppointmentStatus(
  db: Db,
  id: number,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  await db
    .update(schema.appointments)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(schema.appointments.id, id));
}
