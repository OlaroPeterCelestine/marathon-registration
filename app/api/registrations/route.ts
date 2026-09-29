import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_SET = new Set<string>(COUNTRIES);

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function GET() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ registrations });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const email = clean(body.email, 180).toLowerCase();
  const name = clean(body.name, 120);
  const country = clean(body.country, 80);
  const contact = clean(body.contact, 40);
  const socials = clean(body.socials, 400);

  if (!name || !contact || !socials || !EMAIL.test(email)) {
    return NextResponse.json(
      { error: "Email, name, country, contact, and socials are all required." },
      { status: 400 },
    );
  }

  if (!COUNTRY_SET.has(country)) {
    return NextResponse.json({ error: "Choose a country from the list." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.create({
      data: { email, name, country, contact, socials },
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "That email is already registered." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Could not save this registration." },
      { status: 500 },
    );
  }
}
