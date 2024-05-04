"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import "@/app/globals.css";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = ["Practica", "Chat", "¿Section3?", "Iniciar sesión"];
  const [userData, setUserData] = useState(null);
  const [isCharged, setIsCharged] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [menu, setMenu] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState("");
  const [hidde, setHidde] = useState(true);
  const path = usePathname();
  const route = useRouter();

  const getUserData = async () => {
    const session = await getSession();
    if (session) {
      setUserData({
        username: session.user.name,
        email: session.user.email,
        img: session.user.image,
      });

      const res = await fetch("/api/usersHandler/createUser", {
        method: "POST",
        body: JSON.stringify({
          email: session.user.email,
          username: session.user.name,
          img: session.user.image,
        }),
        headers: {
          "Content-Type": "/aplication/json",
        },
      });
      const data = await res.json();
    }

    setAnimation(true);
    setTimeout(() => {
      setIsCharged(true);
    }, 290);
  };

  const switchMenu = () => {
    if (menu) {
      setMenuAnimation("off");
      setTimeout(() => {
        setMenu(false);
        setHidde(true);
      }, 290);
    } else {
      setHidde(false);
      setMenuAnimation("on");
      setTimeout(() => {
        setMenu(true);
      }, 290);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={`fixed backdrop-blur-sm bg-[#161616c9]`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden hover:bg-transparent"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">EDU.AI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            href="/practica"
            style={{
              textShadow: `${
                path == "/practica"
                  ? "0px 0px 10px white"
                  : "0px 0px 0px transparent"
              }`,
            }}
            className={`${
              path == "/practica" ? `border-[#75726c]` : "border-[#fff7e900]"
            } py-[6px] px-4 border-b hover:border-[#75726c] transition-all font-extralight text-[18px]`}
          >
            Práctica
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/chat"
            style={{
              textShadow: `${
                path == "/chat"
                  ? "0px 0px 10px white"
                  : "0px 0px 0px transparent"
              }`,
            }}
            className={`${
              path == "/chat" ? `border-[#75726c]` : "border-[#fff7e900]"
            } py-[6px] px-4 border-b hover:border-[#75726c] transition-all font-extralight text-[18px]`}
          >
            Chat
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/apuntes"
            style={{
              textShadow: `${
                path == "/apuntes"
                  ? "0px 0px 10px white"
                  : "0px 0px 0px transparent"
              }`,
            }}
            className={`${
              path.slice(0, 8) == "/apuntes"
                ? `border-[#75726c]`
                : "border-[#fff7e900]"
            } py-[6px] px-4 border-b hover:border-[#75726c] transition-all font-extralight text-[18px]`}
          >
            Apuntes
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem
          className={`${animation && "on"}  ${
            isCharged ? "opacity-100" : "opacity-0"
          } transition-all`}
        >
          {userData ? (
            <img
              src={userData.img}
              className="rounded-full w-[30px] h-[30px] cursor-pointer"
              onClick={() => {
                switchMenu();
              }}
            />
          ) : (
            <IoPerson
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={() => {
                switchMenu();
              }}
            />
          )}
        </NavbarItem>
        <div
          className={`${menu ? "opacity-100" : "opacity-0"} ${menuAnimation} ${
            hidde ? "hidden" : "fixed"
          } w-[85%] max-w-72 h-fit pb-10 bg-[#D2CCC0] rounded top-[60px] p-5 flex flex-col items-center justify-center rounded-tr-none text-[#161616] z-50`}
          onMouseLeave={() => {
            switchMenu();
          }}
        >
          {userData ? (
            <div className="w-full h-full flex flex-col items-center">
              <button
                onClick={() => {
                  route.push("/");
                  signOut();
                }}
                style={{ boxShadow: `0px 0px 20px #16161642` }}
                className={`rounded-md text-[13px] p-2 font-medium w-fit shadow-inner px-5 transition-all bg-[#fff7e900] hover:bg-[#D2CCC0] flex justify-center items-center gap-2 min-h-[50px] max-[295px]:px-3 active:scale-95`}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center">
              <h3 className="mb-1 text-[18px] font-semibold">EDU.AI</h3>
              <p className="text-[12px] font-normal mb-6 text-center">
                {/*Explicacion de por que te conviene loguearte, que
                funcionalidades necesitan de este requisito, etc...*/}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
                laboriosam quia voluptates, reprehenderit.
              </p>
              <button
                style={{ boxShadow: `0px 0px 20px #16161642` }}
                className={`rounded-md text-[13px] p-2 font-medium w-fit shadow-inner px-5 transition-all bg-[#fff7e900] hover:bg-[#D2CCC0] flex justify-center items-center gap-2 min-h-[50px] max-[295px]:px-3 active:scale-95`}
                onClick={() => {
                  if (menu) {
                    signIn("google");
                  }
                }}
              >
                <FcGoogle className="text-[25px]" />
                <span className="text-wrap">Iniciar sesión con Google</span>
              </button>
            </div>
          )}
        </div>
      </NavbarContent>
      <NavbarMenu className="overflow-hidden backdrop-blur-sm">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-fit p-1"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
export default React.memo(Nav);
