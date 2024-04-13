"use client";
import React, { useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Practica",
    "Chat",
    "¿Section3?",
    "Iniciar sesión",
  ];
  const path= usePathname()


  return (
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <p className="font-bold text-inherit">EDU.AI</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/practica" className={`${path == "/practica" ? ("font-normal") : ("font-extralight")} text-base p-2`}>
              PRACTICA
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/chat" className={`${path == "/chat" ? ("font-normal") : ("font-extralight")} text-base p-2`}>
              CHAT
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/apuntes" className={`${path == "/apuntes" ? ("font-normal") : ("font-extralight")} text-base p-2`}>
              APUNTES
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="rounded-full w-[40px] h-[40px] bg-white opacity-20" ></div>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="overflow-hidden">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`} >
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
