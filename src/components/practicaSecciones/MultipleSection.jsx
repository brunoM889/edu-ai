"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { IoCloseOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";

function Multiple({ response, finish }) {
  const [contador, setContador] = useState(0);
  const [opciones, setOpciones] = useState(null);
  const [selected, setSeleted] = useState(null);
  const [correcta, setCorrecta] = useState(null);
  const [posiciones, setPosiciones] = useState(null);
  const [historial, setHistorial] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  function generarNumerosAleatorios() {
    var numeros = [];
    while (numeros.length < 4) {
      var numero = Math.floor(Math.random() * 4);
      if (numeros.indexOf(numero) === -1) {
        numeros.push(numero);
      }
    }
    return numeros;
  }
  const sendResponse = async (x) => {
    if (!selected && contador != 10) {
      if (x != "x") {
        if (x == correcta) {
          let h = historial;
          h[contador-1] = 1;
          setHistorial(h);
          console.log("correcto");
        } else {
          let h = historial;
          h[contador-1] = 2;
          setHistorial(h);
          console.log("incorrecto");
        }
        setTimeout(() => {
          setSeleted(x);
        }, 20);
      }

      const peticion = async () => {
        const res = await fetch("/api/sendOptions", {
          method: "POST",
          body: JSON.stringify({
            pregunta: response[contador],
          }),
          headers: {
            "Content-Type": "/aplication/json",
          },
        });
        const data = await res.json();
        return data;
      };
      const respuesta = await peticion();
      if (respuesta.error) {
        console.log(respuesta.error);
        sendResponse(x);
      } else {
        setContador(contador + 1);
        setOpciones(respuesta.opciones);
        setSeleted(null);
        console.log(respuesta);
        setCorrecta(respuesta.opciones[0]);
        setPosiciones(generarNumerosAleatorios);
      }
    } else if (contador == 10) {
      if (x != "x") {
        if (x == correcta) {
          let h = historial;
          h[contador-1] = 1;
          setHistorial(h);
        } else {
          let h = historial;
          h[contador-1] = 2;
          setHistorial(h);
        }
        setTimeout(() => {
          setSeleted(x);
        }, 20);
      }
      setTimeout(() => {
        finish();
      }, 5000);
    }
  };

  useEffect(() => {
    sendResponse("x");
  }, []);

  return (
    <section className="w-full flex justify-center">
      {opciones ? (
        <div className="w-[90%] max-w-[600px] flex flex-col items-center mt-[7vh]">
          <h2 className="text-center text-[20px] font-extralight px-2 pb-14 ">
            {response[contador - 1]}
          </h2>
          {opciones ? (
            <div className="w-full flex flex-col justify-center gap-5">
              <div className="w-full flex justify-center gap-5 flex-wrap">
                <button
                  className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                    !selected && "active:bg-[#fff7e9] active:text-[#202020]"
                  } transition-all justify-center py-4  min-w-[250px] min-h-[80px] font-light ${
                    selected == opciones[posiciones[0]] &&
                    "bg-[rgb(255,247,233)] text-[#202020] hover:bg-[#fff7e9]"
                  }`}
                  onClick={() => {
                    sendResponse(opciones[posiciones[0]]);
                  }}
                >
                  {opciones[posiciones[0]]}
                </button>
                <button
                  className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                    !selected && "active:bg-[#fff7e9] active:text-[#202020]"
                  } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                    selected == opciones[posiciones[1]] &&
                    "bg-[#fff7e9] text-[#202020] hover:bg-[#fff7e9]"
                  }`}
                  onClick={() => {
                    sendResponse(opciones[posiciones[1]]);
                  }}
                >
                  {opciones[posiciones[1]]}
                </button>
              </div>
              <div className="w-full flex justify-center gap-5 flex-wrap">
                <button
                  className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                    !selected && "active:bg-[#fff7e9] active:text-[#202020]"
                  } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                    selected == opciones[posiciones[2]] &&
                    "bg-[#fff7e9] text-[#202020] hover:bg-[#fff7e9]"
                  }`}
                  onClick={() => {
                    sendResponse(opciones[posiciones[2]]);
                  }}
                >
                  {opciones[posiciones[2]]}
                </button>
                <button
                  className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                    !selected && "active:bg-[#fff7e9] active:text-[#202020]"
                  } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                    selected == opciones[posiciones[3]] &&
                    "bg-[#fff7e9] text-[#202020] hover:bg-[#fff7e9]"
                  }`}
                  onClick={() => {
                    sendResponse(opciones[posiciones[3]]);
                  }}
                >
                  {opciones[posiciones[3]]}
                </button>
              </div>
              <div className="w-full flex gap-1 justify-center items-center max-[375px]:px-[65px] max-[375px]:flex-wrap mt-3">
                {historial.map((x, i) => {
                  return (
                    <div key={i} className="h-fit w-fit flex items-center">
                      {x == 0 ? (
                        <div className="w-[30px] h-[30px] rounded-full bg-[#202020]"></div>
                      ) : (
                        <>
                          {x == 1 ? (
                            <IoCheckmark className="text-[30px] p-1 rounded-full bg-[#202020]"></IoCheckmark>
                          ) : (
                            <IoCloseOutline className="text-[30px] p-1 rounded-full bg-[#202020]"></IoCloseOutline>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export default Multiple;
