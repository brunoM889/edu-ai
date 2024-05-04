import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
export async function GET() {
  try {
    const session = await getServerSession();
    const apuntes = await prisma.apunte.findMany({
      where: {
        state: 1,
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    const newApuntes = apuntes.filter((x) => {
      let id = x.id.toString();
      return (
        x.email != session.user.email &&
        !user.apuntesFavoritos.split(",").includes(id)
      );
    });

    for (const a of newApuntes) {
      a.apunte = a.apunte.slice(0, 220);
    }

    const comparaFavs = (a, b) => {
      return a.cantidadFavoritos - b.cantidadFavoritos;
    };

    newApuntes.sort(comparaFavs);
    newApuntes.reverse();

    return NextResponse.json({ error: false, comunidadApuntes: newApuntes });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}

export async function PUT(req) {
  try {
    const res = await req.json();
    const session = await getServerSession();
    console.log(`${res.favoritos}////${res.cantFavs}`);
    if (res.favoritos == null) {
      const userUpdated = await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          cantidadApuntesFavoritos: res.cantFavs,
          apuntesFavoritos: "",
        },
      });
    } else {
      const userUpdated = await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          cantidadApuntesFavoritos: res.cantFavs,
          apuntesFavoritos: res.favoritos,
        },
      });
    }

    const apunte = await prisma.apunte.findUnique({
      where: {
        id: res.id,
      },
    });

    if (res.operacion == 0) {
      await prisma.apunte.update({
        where: {
          id: res.id,
        },
        data: {
          cantidadFavoritos: apunte.cantidadFavoritos - 1,
        },
      });
    } else {
      await prisma.apunte.update({
        where: {
          id: res.id,
        },
        data: {
          cantidadFavoritos: apunte.cantidadFavoritos + 1,
        },
      });
    }

    let apuntes = await prisma.apunte.findMany({
      where: {
        email: session.user.email,
      },
    });
    if (res.favoritos != "" && res.favoritos) {
      for (let id of res.favoritos.split(",")) {
        if (id != "" && id != " ") {
          let apunte = await prisma.apunte.findUnique({
            where: {
              id: parseInt(id),
            },
          });
          apuntes.push(apunte);
        }
      }
    }

    return NextResponse.json({ error: false, userApuntes: apuntes });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
}
