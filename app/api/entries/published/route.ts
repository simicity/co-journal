import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const revalidate = 0;

export async function GET() {
  const entries = await prisma.entry.findMany({
    where: {
      published: true
    },
    orderBy: {
      modifiedAt: "desc"
    }
  });
  return NextResponse.json(entries);
}