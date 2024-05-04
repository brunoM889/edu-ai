"use client";
import React, { useState } from "react";
import ChatPagina from "@/components/ChatPagina";
import { FaCopy } from "react-icons/fa";
import "@/app/globals.css";
function ChatPage() {
  const [sugerencias, setSugerencias] = useState([
    {
      user: "TestUser1",
      prompt: [
        "Necesito crear un resumen completo y detallado sobre la Segunda Guerra Mundial. El resumen debe abordar todas las áreas clave de este conflicto histórico, incluyendo las causas principales, los eventos significativos, las batallas clave en tierra, mar y aire, así como las consecuencias políticas, económicas y sociales tanto a corto como a largo plazo.",
        "Por favor, asegúrate de cubrir los siguientes puntos:",
        "1-Contexto histórico: Explica las circunstancias que llevaron al estallido de la Segunda Guerra Mundial, incluyendo las consecuencias del Tratado de Versalles y los factores que contribuyeron al ascenso de regímenes totalitarios en Europa.",
        "2-Eventos principales: Describe los eventos más importantes que ocurrieron durante la guerra, como la invasión de Polonia, la Batalla de Stalingrado, el Desembarco de Normandía y la Batalla de Midway.",
        "3-Participantes clave: Menciona los países y líderes más destacados involucrados en el conflicto, como Adolf Hitler, Winston Churchill, Franklin D. Roosevelt, Joseph Stalin y otros líderes de potencias aliadas y del Eje."
      ],
    },
    {
      user: "TestUser2",
      prompt: [
        "Texto a corregir: [...]",
        "Quiero que revises mi texto en busca de errores de gramática, puntuación y estilo. También, espero que me des tu opinión sobre la coherencia narrativa y la estructura del relato. Cualquier sugerencia para mejorar la calidad general de la historia será muy apreciada.",
        "Además debes darme una calificación del 1 al 10, donde 1 significa que hay múltiples errores y falta de coherencia, mientras que 10 representa un texto prácticamente perfecto en términos de gramática, estilo y cohesión narrativa.",
        "Por favor, señala los errores específicos que encuentres en mi texto y hazme sugerencias para mejorarlos. También, me gustaría que resaltes los aspectos positivos y me des consejos para fortalecer mi escritura.",
      ],
    },
    {
      user: "TestUser3",
      prompt: [
        ""
      ],
    },
  ]);

  return (
    <main className="w-full bg-transparent flex justify-center gap-[3vw] mt-[84px] flex-wrap">
      <section className="w-[38%] h-[87vh] min-h-[600px] max-w-[600px] min-w-[270px] sugerencias-container rounded-md flex flex-col">
        <h2 className="text-3xl font-extralight text-center mb-8">
          SUGERENCIAS
        </h2>
        <div className="overflow-auto p-2 rounded">
          {sugerencias.map((x, i) => {
            return (
              <div
                key={i}
                className={`w-[100%] mb-3 bg-[#202020] p-5 rounded opacity-80`}
              >
                <h3 className="mb-2 opacity-100">{x.user}</h3>
                {x.prompt.map((a, b) => {
                  return (
                    <p
                      key={b}
                      className="mb-2 text-sm font-light opacity-80 min-h-1"
                    >
                      {a}
                    </p>
                  );
                })}
                <div className="flex flex-col h-7 justify-center">
                  <FaCopy
                    className="self-end opacity-50 text-3xl cursor-pointer active:opacity-40 transition-all"
                    style={{ padding: "3px" }}
                    onClick={() => {
                      let text = "";
                      x.prompt.map((c) => {
                        if (c == "" || c == " ") {
                          text += "\n";
                        } else {
                          text += c;
                        }
                      });
                      navigator.clipboard.writeText(text);
                      console.log(text);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="w-[60%] max-[1320px]:w-[50%] max-[1040px]:w-[80%] max-[500px]:w-[95%] h-[87vh] min-h-[600px] max-w-[750px] min-w-[270px] chatPag-container">
        <ChatPagina />
      </section>
    </main>
  );
}

export default ChatPage;
