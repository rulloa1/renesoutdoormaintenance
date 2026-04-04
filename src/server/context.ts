import type { Db } from "./db";

export type Session = { email: string; role: "admin" | "owner" };

export type TrpcContext = {
  db: Db;
  user: Session | null;
  jwtSecret: string;
  setCookie: (cookieStr: string) => void;
};
