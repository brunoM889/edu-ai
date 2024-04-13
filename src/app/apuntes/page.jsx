"use client";
import React, { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import Chat from "@/components/Chat";
import { IoClose } from "react-icons/io5";

function ApuntesPage() {
  const [file, setFile] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [modal, setModal] = useState("hidden");
  const [animation, setAnimation] = useState("off");
  const [textValue, setTextValue] = useState("");
  const onSubmit = async (x) => {
    const formData = new FormData();
    formData.append("file", x);
    const res = await fetch("/api/getResumen", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    } else {
      console.log(data.resumen);
      setResumen(data.resumen);
    }
  };

  const openAndCloseModal = () => {
    if (animation == "off") {
      setAnimation("on");
      setTimeout(() => {
        setModal("fixed");
      }, 390);
    } else {
      setAnimation("off");
      setTimeout(() => {
        setModal("hidden");
      }, 200);
    }
  };

  const transferir = () => {
    let texto = "";
    for (const i of resumen) {
      for (const l of i) {
        if (i.length - 1 == i.indexOf(l)) {
          texto += `\n`;
          texto += `^^------${l}------^^\n`;
          texto += `\n`;
        } else {
          texto += `${l}\n`;
        }
      }
    }
    setTextValue(texto);
  };

  return (
    <main className="w-full bg-[#161616] h-fit flex justify-center">
      {resumen && (
        <div
          className={`${modal} ${animation}  w-[100vw] h-[100vh] bg-[#16161670] flex flex-col items-center fixed mt-5`}
        >
          <div className="w-full flex items-center justify-end h-[50px] max-w-[800px] px-4 gap-4 pb-[20px] bg-[#16161670] backdrop-blur">
            <button
              className={`p-2 px-5 w-fit text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer`}
              onClick={transferir}
            >
              Transferir a mi apunte
            </button>
            <IoClose
              className="self-end text-[30px] p-1 rounded-full cursor-pointer bg-[#202020] active:scale-90"
              onClick={() => {
                openAndCloseModal();
              }}
            ></IoClose>
          </div>
          <div
            className={`w-full max-w-[800px] h-[80vh] px-4 min-h-[600px] overflow-auto rounded bg-[#16161670] backdrop-blur`}
          >
            {resumen.map((x, i) => {
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
            })}
          </div>
        </div>
      )}
      <div className=""></div>
      <div className="flex flex-col gap-4 w-[90%] max-w-[600px] h-[80vh] min-h-[600px] mt-20">
        {!file ? (
          <Tooltip
            showArrow
            placement="bottom"
            delay={20}
            content={`Sube tu propio PDF y resúmelo automáticamente con IA para tu apunte. Aviso: con apuntes que poseen una sintaxis fuera de lo común como por ejemplo la notación matemática, al reinterpretar el apunte se pueden encontrar errores.`}
            classNames={{
              base: [
                // arrow color
                "before:bg-[#FFF7E9] dark:before:bg-[#FFF7E9] rounded",
              ],
              content: [
                "p-4",
                "text-[#202020] text-[13px] font-normal bg-[#FFF7E9] rounded max-w-[250px]",
              ],
            }}
          >
            <label
              htmlFor="f"
              className={`p-2 px-5 w-fit text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer`}
            >
              USAR PDF
            </label>
          </Tooltip>
        ) : (
          <div className="min-h-[35px]">
            {resumen ? (
              <button
                className={`p-2 px-5 w-fit text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer`}
                onClick={() => {
                  openAndCloseModal();
                }}
              >
                Ver resumen
              </button>
            ) : (
              <div className="h-[16px] loader-1 center w-fit min-w-[85px] rounded relative left-[-20px]">
                <span></span>
              </div>
            )}
          </div>
        )}
        <input
          id="f"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files[0]);
            onSubmit(e.target.files[0]);
          }}
        />

        <textarea
          className="resize-none w-full h-[90%] text-[14px] bg-gradient-to-t from-[#202020] to-[#161616] to-80% rounded p-3 font-light text-base placeholder:text-[#fff7e97b] border-none outline-none"
          style={{ boxShadow: "0px -10px 15px rgb(0,0,0, .1)" }}
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
        ></textarea>
      </div>
      <Chat></Chat>
    </main>
  );
}

export default ApuntesPage;
