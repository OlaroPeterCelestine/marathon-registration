import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const adminCookieName = "marathon_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function signAdminSession() {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update("marathon-admin-session").digest("hex");
}

export function isValidAdminSession(value: string | undefined) {
  const expected = signAdminSession();
  if (!value || !expected) return false;

  const actual = Buffer.from(value);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length) return false;
  return timingSafeEqual(actual, wanted);
}

export async function isAdmin() {
  const jar = await cookies();
  return isValidAdminSession(jar.get(adminCookieName)?.value);
}
