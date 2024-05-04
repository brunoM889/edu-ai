"use client";
import React, { useState } from "react";
import "@/app/globals.css";

function PreguntasSection({ response }) {
  const [contador, setContador] = useState(0);
  const [correcciones, setCorrecciones] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [puntaje, setPuntaje] = useState(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [a, setA] = useState("on");
  const getCorreccion = async (x) => {
    if (respuesta != "") {
      setLoad(true);
      const res = await fetch("/api/practicaHandler/getCorrections", {
        method: "POST",
        body: JSON.stringify({
          resultados: x,
          tipoDeRespuesta: 0,
        }),
        headers: {
          "Content-Type": "/aplication/json",
        },
      });
      const data = await res.json();
      if (data) {
        setLoad(false);
      }
      console.log(data);
      let c = correcciones;
      if (data.error) {
        setError(
          "La respuesta no tiene relación con la consigna, o posee contenido indeseado."
        );
        setTimeout(() => {
          setA("off");
          setTimeout(() => {
            setError(null);
            setA("on");
          }, 290);
        }, 2000);
      } else {
        setContador(contador + 1);
        setRespuesta("");
        c.push({ q: x.q, a: x.a, fb: data.correccion, nota: data.nota });
        setCorrecciones(c);
      }

      if (correcciones.length == 10) {
        let p = 0;
        let n = 0;
        for (const i of correcciones) {
          if (i.nota != "0") {
            p += parseInt(i.nota);
            n += 1;
          }
        }
        if (n == 0) {
          setPuntaje(0);
        } else {
          setPuntaje(p / n);
        }
      }

      console.log(correcciones);
    } else {
      setError("Debes escribir una respuesta.");
      setTimeout(() => {
        setA("off");
        setTimeout(() => {
          setError(null);
          setA("on");
        }, 290);
      }, 2000);
    }
  };

  const saltar = async (x) => {
    setLoad(true);
    const res = await fetch("/api/practicaHandler/getCorrections", {
      method: "POST",
      body: JSON.stringify({
        resultados: x,
        tipoDeRespuesta: 1,
      }),
      headers: {
        "Content-Type": "/aplication/json",
      },
    });
    const data = await res.json();
    if (data) {
      setLoad(false);
    }
    let c = correcciones;
    if (data.error) {
      setError("Intente nuevamente");
      setTimeout(() => {
        setA("off");
        setTimeout(() => {
          setError(null);
          setA("on");
        }, 290);
      }, 2000);
    } else {
      c.push({ q: x, a: data.a, fb: null, nota: "0" });
      setCorrecciones(c);
      setContador(contador + 1);
      setRespuesta("");
    }

    if (correcciones.length == 10) {
      let p = 0;
      let n = 0;
      for (const i of correcciones) {
        if (i.nota != "0") {
          p += parseInt(i.nota);
          n += 1;
        }
      }
      if (n == 0) {
        setPuntaje(0);
      } else {
        setPuntaje(p / n);
      }
    }
  };

  return (
    <section className="w-full flex justify-center pb-10">
      {error && (
        <div
          className={`w-fit h-fit fixed left-5 bottom-5 rounded bg-[#fff7e9] rounded-bl-none p-3 ${
            error ? a : ""
          }`}
        >
          <p
            className={`max-[450px]:text-[12px] text-[14px] font-light text-[#161616]`}
          >
            {error}
          </p>
        </div>
      )}
      {correcciones.length == 10 ? (
        <div className="w-[90%] max-w-[1352px] flex flex-wrap mt-10 gap-4 max-[1352px]:max-w-[600px] max-[1352px]:flex-col max-[1352px]:items-center ">
          <h3 className="w-full self-start mb-3">
            Promedio en base a tus respuestas: {puntaje}
          </h3>
          {correcciones.map((x, i) => {
            return (
              <div
                key={i}
                className={`w-[600px] h-fit rounded p-5 flex flex-col max-[1352px]:w-full bg-gradient-to-b from-[#202020] to-[#161616] opacity-80`}
              >
                <h4 className="mb-1">{x.q}</h4>
                {!x.fb && (
                  <h3 className="font-light text-sm mb-1">
                    Respuesta de la ia:
                  </h3>
                )}
                <p className="max-[450px]:text-[12px] mb-3 text-[14px] opacity-60 font-extralight">
                  {x.a}
                </p>
                {x.fb && (
                  <div className="flex w-full flex-col">
                    <h3 className="font-light text-sm">Devolución:</h3>
                    <span
                      className={`text-[14px] font-light p-2 px-3 rounded text-[#D2CCC0]`}
                    >
                      {x.fb}
                    </span>
                  </div>
                )}

                {x.nota != "0" && (
                  <h3 className="text-[12px] font-light mr-1 text-right">
                    Nota: {x.nota}
                  </h3>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-[90%] max-w-[600px] flex flex-col items-center">
          <h2 className="w-full h-fit text-[20px] font-extralight  px-2 pb-5 mt-5">
            {response[contador]}
          </h2>
          <textarea
            className={`w-full p-3 resize-none h-[500px] text-[14px] bg-gradient-to-t from-[#202020] to-[#161616] rounded-md font-light text-base placeholder:text-[#D2CCC0]`}
            value={respuesta}
            placeholder="Desarrollá tu respuesta!!"
            onChange={(e) => {
              setError(null);
              setRespuesta(e.target.value);
            }}
          />
          <div className="min-h-[56px] mt-[15px] w-full flex justify-between">
            <span className="flex items-center ml-1 select-none">
              {contador + 1}/{response.length}
            </span>
            {contador == 10 || load ? (
              <div className="h-[56px] loader-1 mt-[14px] center w-[10%] min-w-[85px]  rounded">
                <span></span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className={`p-4 px-6 rounded bg-[#202020]`}
                  onClick={() => {
                    saltar(response[contador]);
                  }}
                >
                  Saltar
                </button>
                <button
                  className={`p-4 px-6 rounded bg-[#202020]`}
                  onClick={() => {
                    getCorreccion({ q: response[contador], a: respuesta });
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default PreguntasSection;
