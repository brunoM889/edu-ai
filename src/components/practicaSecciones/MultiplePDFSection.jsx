"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { IoCloseOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";

function MultiplePDFSection({ response, finish }) {
  const [contador, setContador] = useState(0);
  const [selected, setSeleted] = useState(null);
  const [correcta, setCorrecta] = useState(null);
  const [noAcerto, setNoAcerto] = useState(false);
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
    if (!selected && contador != 9) {
      if (x == correcta) {
        let h = historial;
        h[contador] = 1;
        setHistorial(h);
      } else {
        let h = historial;
        h[contador] = 2;
        setHistorial(h);
        setNoAcerto(true);
      }
      setTimeout(() => {
        setSeleted(x);
      }, 20);

      setTimeout(() => {
        setContador(contador + 1);
        setSeleted(null);
        setNoAcerto(false);
        setPosiciones(generarNumerosAleatorios);
        for (let o of response[contador + 1].opciones) {
          if (o[o.length - 1] == "*") {
            o.pop();
          }
          if (o[o.length - 1] == "*") {
            o.pop();
          }
          if (o[o.length - 1] == "*") {
            o.pop();
          }
        }
        for (let o of response[contador + 1].opciones) {
          if (
            o[2] == "*" ||
            o[0] == "*" ||
            o[1] == "*" ||
            o[3] == "*" ||
            o[4] == "*" ||
            o[5] == "*" ||
            o[6] == "*"
          ) {
            let c = o.replace("*", "");
            response[contador + 1].opciones[
              response[contador + 1].opciones.indexOf(o)
            ] = c;
            setCorrecta(c);
            break;
          }
        }
      }, 2000);
    } else if (contador == 9) {
      if (x == correcta) {
        let h = historial;
        h[contador] = 1;
        setHistorial(h);
      } else {
        let h = historial;
        h[contador] = 2;
        setHistorial(h);
        setNoAcerto(true);
      }
      setTimeout(() => {
        setSeleted(x);
      }, 20);

      setTimeout(() => {
        finish();
      }, 5000);
    }
  };

  useEffect(() => {
    for (let o of response[contador].opciones) {
      if (
        o[2] == "*" ||
        o[0] == "*" ||
        o[1] == "*" ||
        o[3] == "*" ||
        o[4] == "*" ||
        o[5] == "*" ||
        o[6] == "*"
      ) {
        let c = o.replace("*", "");
        response[contador].opciones[response[contador].opciones.indexOf(o)] = c;
        setCorrecta(c);
        break;
      }
    }
    for (let o of response[contador + 1].opciones) {
      if (o[o.length - 1] == "*") {
        o.pop();
      }
      if (o[o.length - 1] == "*") {
        o.pop();
      }
      if (o[o.length - 1] == "*") {
        o.pop();
      }
    }
    setPosiciones(generarNumerosAleatorios);
  }, []);

  return (
    <section className="w-full flex justify-center">
      {posiciones ? (
        <div className="w-[90%] max-w-[600px] flex flex-col items-center mt-[7vh]">
          <h2 className="text-center text-[20px] font-extralight px-2 pb-14 ">
            {response[contador].q}
          </h2>

          <div className="w-full flex flex-col justify-center gap-5">
            <div className="w-full flex justify-center gap-5 flex-wrap">
              <button
                className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                  !selected &&
                  `active:bg-[#fff7e9] active:text-[#161616]`
                } ${
                  noAcerto &&
                  correcta == response[contador].opciones[posiciones[0]] &&
                  `bg-[#464441]`
                } transition-all justify-center py-4  min-w-[250px] min-h-[80px] font-light ${
                  selected == response[contador].opciones[posiciones[0]] &&
                  `bg-[rgb(255,247,233)] text-[#161616] hover:bg-[#fff7e9]`
                }`}
                onClick={() => {
                  sendResponse(response[contador].opciones[posiciones[0]]);
                }}
              >
                {response[contador].opciones[posiciones[0]]}
              </button>
              <button
                className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                  !selected &&
                  `active:bg-[#fff7e9] active:text-[#161616]`
                } ${
                  noAcerto &&
                  correcta == response[contador].opciones[posiciones[1]] &&
                  `bg-[#464441]`
                } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                  selected == response[contador].opciones[posiciones[1]] &&
                  `bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]`
                }`}
                onClick={() => {
                  sendResponse(response[contador].opciones[posiciones[1]]);
                }}
              >
                {response[contador].opciones[posiciones[1]]}
              </button>
            </div>
            <div className="w-full flex justify-center gap-5 flex-wrap">
              <button
                className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                  !selected &&
                  `active:bg-[#fff7e9] active:text-[#161616]`
                } ${
                  noAcerto &&
                  correcta == response[contador].opciones[posiciones[2]] &&
                  `bg-[#464441]`
                } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                  selected == response[contador].opciones[posiciones[2]] &&
                  `bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]`
                }`}
                onClick={() => {
                  sendResponse(response[contador].opciones[posiciones[2]]);
                }}
              >
                {response[contador].opciones[posiciones[2]]}
              </button>
              <button
                className={`px-5 w-[45%] rounded flex items-center bg-[#202020] ${
                  !selected &&
                  `active:bg-[#fff7e9] active:text-[#161616]`
                } ${
                  noAcerto &&
                  correcta == response[contador].opciones[posiciones[3]] &&
                  `bg-[#464441]`
                } transition-all justify-center py-4 min-w-[250px] min-h-[80px] font-light ${
                  selected == response[contador].opciones[posiciones[3]] &&
                  `bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]`
                }`}
                onClick={() => {
                  sendResponse(response[contador].opciones[posiciones[3]]);
                }}
              >
                {response[contador].opciones[posiciones[3]]}
              </button>
            </div>
            <div className="w-full flex gap-1 justify-center items-center max-[375px]:px-[65px] max-[375px]:flex-wrap mt-3">
              {historial.map((x, i) => {
                return (
                  <div key={i} className="h-fit w-fit flex items-center">
                    {x == 0 ? (
                      <div
                        className={`w-[30px] h-[30px] rounded-full bg-[#202020]`}
                      ></div>
                    ) : (
                      <>
                        {x == 1 ? (
                          <IoCheckmark
                            className={`text-[30px] p-1 rounded-full bg-[#202020]`}
                          />
                        ) : (
                          <IoCloseOutline
                            className={`text-[30px] p-1 rounded-full bg-[#202020]`}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export default MultiplePDFSection;
