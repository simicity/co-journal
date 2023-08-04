import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const res = await request.json();
  const title = res.title;
  if(!session?.user?.email) {
    throw new Error("Invalid session");
  }
  if(typeof title !== "string" || title.length === 0){
    throw new Error("Invalid title");
  }
  const content = res.content;
  if(typeof content !== "string" || content.length === 0){
    throw new Error("Invalid content");
  }
  await prisma.entry.create({ data: {
    title: title,
    content: content, 
    published: res.published,
    author: { connect: { email: session.user.email } }
  } });
  return NextResponse.json({});
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if(!session?.user?.email) {
    throw new Error("Invalid session");
  }
  const entries = await prisma.entry.findMany({ where: { author: session.user } });
  return NextResponse.json(entries);
}
