import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    const session = await getServerSession();
    const res = await req.json();
    const apunte = await prisma.apunte.findUnique({
      where: {
        email: session.user.email,
        id: res.id,
      },
    });

    return NextResponse.json({
      error: false,
      id: apunte.id,
      content: apunte.apunte,
      title: apunte.title,
      state: apunte.state,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
export async function PUT(req) {
  try {
    const res = await req.json();
    const apunte = await prisma.apunte.update({
      where: {
        id: res.id,
      },
      data: {
        apunte: res.apunte,
        title: res.title,
        state: res.state,
      },
    });

    return NextResponse.json({
      error: false,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
