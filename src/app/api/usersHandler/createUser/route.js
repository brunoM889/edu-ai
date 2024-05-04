import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const res = await req.json();
  try {
    const userExist = await prisma.user.findMany({
      where: {
        email: res.email,
      },
    });
    if (userExist.length==0) {
      const newUser = await prisma.user.create({
        data: {
          email: res.email,
          username: res.username,
          img: res.img,
          apuntes:0,
          apuntesFavoritos: "",
          cantidadApuntesFavoritos:0
        },
      });
    }
    return NextResponse.json({ error: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
