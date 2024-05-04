"use client";

import React from "react";
import { useState } from "react";

import "@/app/globals.css";
function Chat() {
  const [mensaje, setMensaje] = useState("");
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAnimation, setOpenAnimation] = useState("");
  const [mensajes, setMensajes] = useState([
    [[`¿En qué puedo ayudarte?`], "ia"],
  ]);

  const send = async (e) => {
    e.preventDefault();
    if (mensaje != "") {
      setLoad(true);
      const msjs = [...mensajes];
      msjs.push([[mensaje], "client"]);
      setMensajes(msjs);
      setMensaje("");
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          mensaje: mensaje,
          context: mensajes,
        }),
        headers: {
          "Content-Type": "/aplication/json",
        },
      });
      const data = await res.json();
      if (data) {
        setLoad(false);
      }
      msjs.push([data.mensaje, "ia"]);
      setMensajes(msjs);
    }
  };

  const close = () => {
    setOpenAnimation("off");
    setTimeout(() => {
      setOpen(false);
    }, 250);
  };
  const openn = () => {
    setOpenAnimation("on");
    setTimeout(() => {
      setOpen(true);
    }, 250);
  };

  return (
    <div className="absolute right-0 top-[0px] z-50 max-[652px]:left-0">
      <button
        className={`z-50 ${open ? "hidden" : "flex"} ${
          openAnimation == "on" ? "off" : "on"
        } opacity-100 fixed top-[85vh] w-[150px] h-[50px] flex justify-center items-center right-[120px] rounded border cursor-pointer border-[#75726c] max-[1000px]:right-[20px] max-[1140px]:right-[50px] open backdrop-blur max-[652px]:hidden`}
        onClick={() => {
          openn();
        }}
      >
        Copiloto
      </button>
      <button
        className={`z-50 opacity-100 hidden absolute justify-center items-center rounded border cursor-pointer border-[#75726c] open backdrop-blur top-[88px] left-[5vw] h-[44px] w-[100px] text-[12px] font-normal max-[400px]:w-[44px] max-[652px]:flex`}
        onClick={() => {
          openn();
        }}
      >
        IA
      </button>
      <div
        style={{ zIndex: 60 }}
        className={`${openAnimation} ${
          open ? "flex" : "hidden"
        } fixed top-[15vh] right-[50px] h-[80vh] w-[70vw] max-w-[480px] min-w-[250px] rounded-md border border-[#75726c] flex-col justify-center items-center min-h-[500px] chat-container backdrop-blur-[4px] bg-[#161616c9]`}
      >
        <div className="w-full flex justify-end pr-6 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-8 h-8 cursor-pointer rounded-full hover:bg-[#202020] p-[6px] transition-all active:scale-95`}
            onClick={close}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="w-[90%] h-[90%] flex flex-col justify-end items-center">
          <div className="h-[95%] w-[100%] overflow-auto pl-1 pr-1 mb-4">
            {mensajes.length != 0 ? (
              <>
                {mensajes.map((x, i) => {
                  return (
                    <div key={i} className="mb-4">
                      <h3>{x[1] == "client" ? "Tú" : "IA"}</h3>
                      <div>
                        {x[0].map((y, i) => {
                          return (
                            <p
                              key={i}
                              className="mb-2 text-sm font-light opacity-80  min-h-1"
                            >
                              {y}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
          <form
            className="w-full flex flex-wrap gap-2 justify-between ai-form"
            onSubmit={send}
          >
            <input
              className={`ai-inp w-[75%] p-2 h-11 rounded bg-transparent border border-[#75726c] font-light text-base max-[1150px]:w-full`}
              type="text"
              value={mensaje}
              onChange={(e) => {
                setMensaje(e.target.value);
              }}
            />
            <div className="h-11 max-[1150px]:w-full flex justify-center">
              {load ? (
                <div className="loader-1 mt-1 center w-[10%] min-w-[85px] h-11 rounded max-[1150px]:mt-[5px]">
                  <span></span>
                </div>
              ) : (
                <button className="w-[85px] h-11 rounded max-[1150px]:mt-[5px]">
                  Enviar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
