import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(req) {
  try {
    const res = await req.json();
    const apunteDeleted = await prisma.apunte.delete({
      where: {
        id: res.id,
      },
    });
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        apuntes: user.apuntes - 1,
      },
    });

    return NextResponse.json({ error: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}

export async function POST(req) {
  try {
    const res = await req.json();
    const session = await getServerSession();
    const email = session.user.email;
    const username = session.user.name;
    const newApunte = await prisma.apunte.create({
      data: {
        title: res.title == "" ? "Sin titulo" : res.title,
        apunte: res.apunte,
        email: email,
        username: username,
        state: 0,
        cantidadFavoritos: 0,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        apuntes: user.apuntes + 1,
      },
    });

    return NextResponse.json({ error: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (session) {
      let apuntes = await prisma.apunte.findMany({
        where: {
          email: session.user.email,
        },
      });
      const userData = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (userData.apuntesFavoritos != "") {
        for (const id of userData.apuntesFavoritos.split(",")) {
          if (id != "" && id != " ") {
            let apunte = await prisma.apunte.findUnique({
              where: {
                id: parseInt(id),
              },
            });
            if (apunte) {
              apuntes.push(apunte);
            }
          }
        }
      }
      return NextResponse.json({
        error: false,
        response: session.user,
        apuntes: apuntes,
        cantFavs: userData.cantidadApuntesFavoritos,
        favoritos: userData.apuntesFavoritos,
      });
    } else {
      return NextResponse.json({ error: false, response: session });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
