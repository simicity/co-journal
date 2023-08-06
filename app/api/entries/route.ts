import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { type } from "os";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if(!session?.user?.email) {
    throw new Error("Invalid session");
  }
  const {
    title,
    content,
    published
  } = await req.json();
  if(typeof title !== "string" || title.length === 0){
    throw new Error("Invalid title");
  }
  if(typeof content !== "string" || content.length === 0){
    throw new Error("Invalid content");
  }
  await prisma.entry.create({ data: {
    title: title,
    content: content, 
    published: published,
    author: { connect: { email: session.user.email } }
  } });
  return NextResponse.json({});
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if(!session?.user?.email) {
    throw new Error("Invalid session");
  }

  const { searchParams } = new URL(req.url);
  let limit;
  let cursor;
  if(searchParams.has("limit")) {
    limit = parseInt(searchParams.get("limit") ?? "0");
    if(!limit) limit = 0;
  }
  if(searchParams.has("cursor")) {
    cursor = searchParams.get("cursor");
  }

  if(cursor && typeof cursor == "string") {
    return await prisma.entry.findMany({
      take: limit,
      skip: 1,
      cursor: {
        id: cursor
      },
      where: {
        author: session.user
      },
      orderBy: {
        modifiedAt: "desc"
      }
    })
    .then((data) => {
      return NextResponse.json(data);
    })
    .catch((err) => {
      return NextResponse.json(err);
    });
  }

  return await prisma.entry.findMany({
    take: limit,
    skip: 0,
    where: {
      author: session.user
    },
    orderBy: {
      modifiedAt: "desc"
    }
  })
  .then((data) => {
    return NextResponse.json(data);
  })
  .catch((err) => {
    return NextResponse.json(err);
  });
}
