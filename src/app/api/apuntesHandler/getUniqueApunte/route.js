import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = await req.json();

    console.log(res);

    const apunte = await prisma.apunte.findUnique({
      where: {
        id: res.id,
      },
    });

    return NextResponse.json({ error: false, content: apunte.apunte });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
