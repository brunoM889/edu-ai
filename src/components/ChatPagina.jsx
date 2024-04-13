"use client";
import React from "react";
import "@/app/globals.css";
import { useState } from "react";
function ChatPagina() {
  const [mensaje, setMensaje] = useState("");
  const [load, setLoad] = useState(false);
  const [mensajes, setMensajes] = useState([
    [[`¿En qué puedo ayudarte ${"username"}?`], "ia"],
  ]);

  const send = async (e) => {
    e.preventDefault();
    if (mensaje != "") {
      setLoad(true);
      const msjs = [...mensajes];
      msjs.push([[mensaje], "client"]);
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

  return (
    <div
      className={`h-full w-full rounded-md border border-[#75726C]  flex flex-col justify-center items-center`}
    >
      <div className="w-[90%] h-[90%] flex flex-col justify-end items-center">
        <div className="h-[95%] w-[100%] overflow-auto pl-1 pr-1 mb-4 rounded">
          {mensajes.length != 0 ? (
            <>
              {mensajes.map((x, i) => {
                return (
                  <div key={i} className="mb-4 rounded">
                    <h3>{x[1] == "client" ? "Tú" : "AI"}</h3>
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
          <textarea
            className="ai-inp w-[85%] p-2 h-11 rounded bg-transparent border border-[#75726C] font-light text-base min-h-11 max-h-[150px]"
            type="text"
            value={mensaje}
            onChange={(e) => {
              setMensaje(e.target.value);
            }}
          />
          <div className="h-11">
            {load ? (
              <div className="loader-1 mt-1 center w-[10%] min-w-[85px] h-11 rounded max-[885px]:mt-[15px]">
                <span></span>
              </div>
            ) : (
              <button className="w-[85px] h-11 rounded max-[885px]:mt-[15px]">Enviar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatPagina;
