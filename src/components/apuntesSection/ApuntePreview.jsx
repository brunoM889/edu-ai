"use client";
import React from "react";
import { IoClose } from "react-icons/io5";

function ApuntePreview({
  modal,
  resumen,
  animation,
  openAndCloseModal,
  transferir,
  title,
}) {
  
  return (
    <div
      className={`${modal} ${animation}  w-[100vw] h-[100vh] min-h-fit flex flex-col items-center fixed backdrop-blur-[4px] pt-5 z-30 ${
        title && "bg-[#161616c9]"
      }`}
    >
      <div className="w-full flex items-center justify-end h-[44px] mt-[4px] max-w-[800px] px-4 gap-4 z-30">
        {title && <h2 className="text-[20px] font-extralight w-[100%]">{title}</h2>}
        {transferir && (
          <button
            className={`p-2 px-5 w-fit text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer`}
            onClick={transferir}
          >
            Transferir a mi apunte
          </button>
        )}
        <IoClose
          className="text-[30px] p-1 rounded-full cursor-pointer bg-[#202020] active:scale-90 hover:bg-[#464441] transition-all"
          onClick={() => {
            openAndCloseModal();
          }}
        ></IoClose>
      </div>
      <div
        className={`resumen w-full max-w-[800px] h-[80vh] px-4 overflow-auto rounded mt-4`}
      >
        
        {resumen.map((x, i) => {
          if (transferir) {
            return (
              <div
                key={i}
                className="mb-5 border-b p-4 border-[#fff7e967] pb-5"
              >
                {x.map((z, y) => {
                  return (
                    <p
                      className={`mb-[2px]  font-light ${
                        x.indexOf(z) == x.length - 1
                          ? "text-end opacity-100 font-normal mt-4 text-[12px]"
                          : "opacity-80 text-[14px]"
                      }  min-h-[8px] max-[550px]:text-[12px]`}
                      key={y}
                    >
                      {z}
                    </p>
                  );
                })}
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className={`px-4 ${x[0]=="^" && x[1]=="^" && "border-b border-[#fff7e967] mb-2 py-4 pb-6"} `}
              >
                <p
                  className={`mb-[2px] font-light min-h-[24px] max-[550px]:text-[12px] break-words max-[550px]:mb-[0px] max-[550px]:min-h-[16px]`}
                >
                  {x}
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default ApuntePreview;
