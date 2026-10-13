"use server";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName, signAdminSession } from "@/lib/admin-auth";

export type LoginState = { error: string } | undefined;

function passwordsMatch(input: string, expected: string) {
  const actual = Buffer.from(input);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length) return false;
  return timingSafeEqual(actual, wanted);
}

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected) {
    return { error: "Set ADMIN_PASSWORD in the environment before signing in." };
  }

  if (!passwordsMatch(password, expected)) {
    return { error: "That password is not correct." };
  }

  const jar = await cookies();
  jar.set(adminCookieName, signAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(adminCookieName);
  redirect("/admin");
}
