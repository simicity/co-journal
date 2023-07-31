import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const entries = await prisma.entry.findMany({ where: { published: true } });
  return NextResponse.json(entries);
}