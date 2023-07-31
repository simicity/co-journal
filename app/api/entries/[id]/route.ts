import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;
  if(!id || typeof id !== "string"){
    throw new Error("Invalid id");
  }
  const entry = await prisma.entry.findUnique({ where: { id: id } });
  return NextResponse.json(entry);
}

export async function PUT(request: Request, { params }: { params: { id: number } }) {
  const res = await request.json();
  const id = params.id;
  if(!id || typeof id !== "string") {
    throw new Error("Invalid id");
  }
  const content = res.content;
  if(typeof content !== "string" || content.length === 0) {
    throw new Error("Invalid content");
  }
  const published = res.published;
  if(typeof published != "boolean") {
    throw new Error("Invalid published flag")
  }
  await prisma.entry.update({
    where: {
      id: id,
    },
    data: {
      content: content,
      published: published
    },
  })
  return NextResponse.json({});
}

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;
  if(!id || typeof id !== "string"){
    throw new Error("Invalid id");
  }
  await prisma.entry.delete({ where: { id: id } });
  return NextResponse.json({});
}
