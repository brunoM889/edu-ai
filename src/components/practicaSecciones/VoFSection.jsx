"use client";
import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import "@/app/globals.css";

function VoFSection({ response, finish }) {
  const [contador, setContador] = useState(0);
  const [historial, setHistorial] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [decision, setDecision] = useState(null);
  const handleResponse = (x) => {
    if (!decision && contador != 9) {
      setDecision(x)
      let h = historial;
      if (x == response[contador].vf) {
        h[contador] = 1;
        setHistorial(h);
        console.log("correcto");
      } else {
        h[contador] = 2;
        setHistorial(h);
        console.log("incorrecto");
      }
      setTimeout(()=>{
        setDecision(null)
        setContador(contador+1)
      },1000)
    }else if(contador== 9){
      setDecision(x)
      let h = historial;
      if (x == response[contador].vf) {
        h[contador] = 1;
        setHistorial(h);
        console.log("correcto");
      } else {
        h[contador] = 2;
        setHistorial(h);
        console.log("incorrecto");
      }
      setTimeout(() => {
        finish();
      }, 5000);
    }
    
  };

  return (
    <section className="w-full flex justify-center">
      <div className="w-[90%] max-w-[600px] flex flex-col items-center mt-[7vh]">
        <div className="w-full flex flex-wrap justify-center gap-5">
          <h2 className="w-full text-center text-[20px] font-extralight px-2 pb-10 min-h-[100px]">
            {response[contador].afirmacion}
          </h2>
          <button
            className={`px-5 w-[35%] rounded flex items-center bg-[#202020] ${
              !decision && "active:bg-[#fff7e9] active:text-[#202020]"
            } transition-all justify-center py-4  min-w-[250px] min-h-[80px] font-light ${
              decision == "V" &&
              "bg-[rgb(255,247,233)] text-[#202020] hover:bg-[#fff7e9]"
            }`}
            onClick={() => {
              handleResponse("V");
            }}
          >
            Verdadero
          </button>
          <button
            className={`px-5 w-[35%] rounded flex items-center bg-[#202020] ${
              !decision && "active:bg-[#fff7e9] active:text-[#202020]"
            } transition-all justify-center py-4  min-w-[250px] min-h-[80px] font-light ${
              decision == "F" &&
              "bg-[rgb(255,247,233)] text-[#202020] hover:bg-[#fff7e9]"
            }`}
            onClick={() => {
              handleResponse("F");
            }}
          >
            Falso
          </button>
        </div>
        <div className="w-full flex gap-1 justify-center items-center max-[375px]:px-[65px] max-[375px]:flex-wrap mt-14">
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
    </section>
  );
}

export default VoFSection;
