"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
function Acierta({ response, finish }) {
  const [contador, setContador] = useState(0);
  const [historial, setHistorial] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [palabra, setPalabra] = useState([]);
  const abc = "abcdefghijklmnñopqrstuvwxyz";
  const [letras, setLetras] = useState([]);
  const [fin, setFin] = useState(true);
  const [acerto, setAcerto] = useState(false);
  function desordenarString(texto) {
    for (var i = texto.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = texto[i];
      texto[i] = texto[j];
      texto[j] = temp;
    }
    return texto;
  }

  const desordenaLetras = (c) => {
    let auxiliar = [];
    let auxiliar2 = [];
    for (const i of response[c].palabra) {
      auxiliar.push(i);
      auxiliar2.push({ char: "", index: null });
    }
    setPalabra(auxiliar2);
    let long = 12;
    if (response[c].palabra.length > 6) {
      long = response[c].palabra.length * 2;
    }
    for (let i = auxiliar.length; i < long; i++) {
      let letraRandom = Math.floor(Math.random() * abc.length);
      auxiliar.push(abc[letraRandom]);
      console.log(letraRandom, abc[letraRandom]);
    }
    setLetras(desordenarString(auxiliar));
  };

  const handleResponse = (x) => {
    let pal = "";
    for (const i of x) {
      pal += i.char;
    }
    if (contador != 9) {
      let h = historial;
      if (pal == response[contador].palabra) {
        h[contador] = 1;
        setHistorial(h);
        setAcerto(true);
      } else {
        h[contador] = 2;
        setHistorial(h);
      }
      setTimeout(() => {
        setLetras([]);
        setPalabra([]);
        desordenaLetras(contador + 1);
        setContador(contador + 1);
        setAcerto(false);
      }, 1500);
    } else if (contador == 9 && fin) {
      setFin(false);
      let h = historial;
      if (pal == response[contador].palabra.split("")) {
        h[contador] = 1;
        setHistorial(h);
        setAcerto(true);
      } else {
        h[contador] = 2;
        setHistorial(h);
      }
      setTimeout(() => {
        finish();
      }, 5000);
    }
  };

  useEffect(() => {
    console.log(response);
    desordenaLetras(contador);
  }, []);

  const incluye = (list, i) => {
    for (const x of list) {
      if (x.index == i) {
        return true;
      }
    }
    return false;
  };

  return (
    <section className="w-full flex justify-center">
      <div className="w-[90%] max-w-[800px] flex flex-col items-center mt-[2vh]">
        <div className="w-full flex flex-wrap justify-center">
          <h2 className="w-full text-center text-[20px] max-[516px]:text-[16px] font-extralight px-2 mb-6 min-[600px]:min-h-[100px] max-[600px]:min-h-[50px]">
            {response[contador].referencia}
          </h2>
          <div
            className={`w-full min-h-[60px] max-[600px]:w-[95vw] max-[600px]:min-h-[12vw] flex justify-center gap-2 ${
              response[contador].palabra.length > 9 && "max-[830px]:flex-wrap"
            }`}
          >
            {palabra.length != 0 &&
              palabra.map((x, i) => {
                return (
                  <div
                    key={i}
                    className={`h-[60px] w-[60px] min-w-[40px] min-h-[40px] max-[600px]:h-[10vw] max-[600px]:w-[10vw] max-[600px]:text-[16px] max-[600px]:font-normal text-[22px] rounded flex justify-center bg-[#202020] items-center select-none transition-all ${
                      x.char != "" && "cursor-pointer"
                    } ${
                      acerto && `bg-[#D2CCC0] text-[#202020]`
                    }`}
                    onClick={() => {
                      if (x.char != "") {
                        let aux = [...palabra];
                        aux[i].char = "";
                        aux[i].index = null;
                        setPalabra(aux);
                      }
                    }}
                  >
                    {x.char}
                  </div>
                );
              })}
          </div>
          <div className="flex w-[60%] flex-wrap justify-center gap-4 max-[600px]:mt-6 mt-14 max-[600px]:w-[90%]">
            {letras.length != 0 &&
              letras.map((x, i) => {
                return (
                  <button
                    key={i}
                    className={`h-[60px] w-[60px] max-[600px]:h-[12vw] max-[600px]:w-[12vw] max-[600px]:text-[16px] max-[600px]:font-normal text-[22px] max-[336px]:h-[55px] max-[336px]:w-[55px] font-extralight bg-[#202020] rounded flex justify-center items-center transition-all max-[516px]:w-[16vw] max-[516px]:h-[16vw] ${
                      incluye(palabra, i) &&
                      `bg-[#fff7e9] hover:bg-[#fff7e9] text-[#161616]`
                    }`}
                    onClick={() => {
                      if (!incluye(palabra, i) && incluye(palabra, null)) {
                        console.log(1);
                        let aux = [...palabra];
                        for (const a of aux) {
                          if (a.char == "") {
                            aux[aux.indexOf(a)].char = x;
                            aux[aux.indexOf(a)].index = i;
                            setPalabra(aux);
                            break;
                          }
                        }
                        if (aux[aux.length - 1].char != "") {
                          handleResponse(aux);
                        }
                      }
                    }}
                  >
                    {x}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="w-full flex gap-1 justify-center items-center max-[375px]:px-[65px] max-[375px]:flex-wrap mt-14 max-[328px]:px-[16vw] max-[600px]:mt-6">
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
    </section>
  );
}

export default Acierta;
