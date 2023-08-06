import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const revalidate = 0;

export async function GET(req: NextRequest) {
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
        published: true
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
      published: true
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
