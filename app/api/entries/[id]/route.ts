import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if(!id || typeof id !== "string"){
    throw new Error("Invalid id");
  }
  const entry = await prisma.entry.findUnique({ where: { id: id } });
  return NextResponse.json(entry);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const {
    content,
    published
  } = await req.json();
  const id = params.id;
  if(!id || typeof id !== "string") {
    throw new Error("Invalid id");
  }
  if(typeof content !== "string" || content.length === 0) {
    throw new Error("Invalid content");
  }
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if(!id || typeof id !== "string"){
    throw new Error("Invalid id");
  }
  await prisma.entry.delete({ where: { id: id } });
  return NextResponse.json({});
}
