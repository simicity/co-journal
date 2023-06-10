import { prisma } from "../../../db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const id = Number(params.id);
  if(typeof id !== "number"){
    throw new Error("Invalid id");
  }
  const entry = await prisma.entry.findUnique({ where: {id: id} });
  return NextResponse.json(entry);
}
