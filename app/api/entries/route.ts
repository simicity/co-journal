import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  const res = await request.json();
  const title = res.title;
  if(typeof title !== "string" || title.length === 0){
    throw new Error("Invalid title");
  }
  const content = res.content;
  if(typeof content !== "string" || content.length === 0){
    throw new Error("Invalid content");
  }
  await prisma.entry.create({ data: {title, content} });
  return NextResponse.json({});
}

export async function GET() {
  const entries = await prisma.entry.findMany();
  return NextResponse.json(entries);
}
