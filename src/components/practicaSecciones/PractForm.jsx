"use client";
import React, { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { Tooltip } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";

function PractForm({ f }) {
  const [prompt, setPrompt] = useState("");
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [client, setClient] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const onOff = (modo) => {
    if (error1) {
      setError1(false);
    }
    setSelected(modo);
  };

  const modos = [
    { modo: "Flash cards", description: "Descr" },
    { modo: "Preguntas y respuestas", description: "Descri" },
    { modo: "Multiple choice", description: "Descrip" },
    { modo: "Ejercicios prácticos", description: "Descripc" },
    { modo: "Verdadero o falso", description: "Descripcio" },
    { modo: "Crucigramas", description: "Descripci" },
  ];
  const send = () => {
    if (!pdf) {
      if (selected && prompt != "") {
        f({ modalidad: selected, prompt: prompt, pdf: null });
      } else {
        if (!selected) {
          setError1(true);
        }
        if (prompt == "") {
          setError2(true);
        }
      }
    } else {
      const formData = new FormData();
      formData.append("file", pdf);
      formData.append("modalidad", selected);
      if (selected) {
        f({ pdf: formData, modalidad: selected });
      } else {
        setError1(true);
      }
    }
  };

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <section className="w-full">
      {client ? (
        <form
          onClick={() => {
            setIsOpen("");
          }}
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="w-full flex flex-wrap gap-5 justify-center mt-12 max-[893px]:flex-col max-[893px]:items-center  pb-10"
        >
          <div className="w-[40%] flex flex-col items-center max-[893px]:w-[90%]">
            <h2
              htmlFor="prompt"
              className="text-center mb-6 text-[18px] font-extralight flex items-center gap-2"
            >
              Describí los temas qué vas a estudiar
              <Tooltip
                showArrow
                placement="bottom"
                delay={20}
                content={`Recomendamos usar el siguiente input para obtener el mejor resultado: \'{Nombre de la materia o area de los temas}, tema1, tema2, tema3...\'`}
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
                <button
                  type="button"
                  className="hover:bg-[#161616] cursor-default mt-[2px]"
                >
                  <CiCircleInfo className="text-[18px]"></CiCircleInfo>
                </button>
              </Tooltip>
            </h2>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (prompt != "" && error2) {
                  setError2(false);
                }
              }}
              maxLength={pdf ? 0 : 200}
              className="w-[70%] text-[14px] h-48 bg-[#202020] resize-none rounded p-3 font-light text-base placeholder:text-[#fff7e97b]"
              placeholder="Algebra y geometria analítica 2, análisis combinatorio, matrices y determinantes."
            />
            <span
              className={`text-[#a4204a] text-[13px] w-[69%] text-right mt-1 font-medium max-[1220px]:w-[94%] opacity-0 ${
                error2 && "opacity-100"
              }`}
            >
              Requerido
            </span>
            <div className="w-[69%] mt-1 min-h-[34px] flex items-center gap-[10px] font-medium relative top-[-15px] max-[1220px]:w-[94%]">
              {prompt == "" && (
                <>
                  <label
                    htmlFor="f"
                    className={`p-2 px-5 text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 active:text-[#161616] transition-all hover:bg-[#464441] cursor-pointer ${
                      pdf && "bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]"
                    }`}
                  >
                    USAR PDF
                  </label>
                  <input
                    id="f"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    key={fileInputKey}
                    onChange={(e) => {
                      setPdf(e.target.files[0]);
                      console.log(e.target.files[0]);
                    }}
                  />
                  {pdf && (
                    <IoClose
                      className="cursor-pointer text-[25px] rounded-full p-[4px] bg-[#202020] transition-all active:scale-90"
                      onClick={() => {
                        setPdf(null);
                        setFileInputKey(Date.now());
                      }}
                    ></IoClose>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="w-[50%] h-fit flex flex-col min-w-[270px] max-w-[750px] items-center max-[893px]:w-[90%] max-[893px]:mt-[30px]">
            <label
              htmlFor="prompt"
              className="text-center mb-6 text-[18px] font-extralight "
            >
              Seleccioná la metodologia de estudio
            </label>
            <div className="flex w-[610px] flex-wrap gap-[12px] buttons-container max-[463px]:w-[95%] max-[405px]:w-[100%] max-[405px]:gap-2 justify-between max-[348px]:gap-1 min-w-[293.5px]">
              {modos.map((x, i) => {
                return (
                  <Tooltip
                    key={i}
                    showArrow
                    isOpen={isOpen == x.modo && true}
                    placement="bottom"
                    delay={0}
                    onClick={() => {
                      setTimeout(() => {
                        setIsOpen(x.modo);
                      }, 5);
                    }}
                    closeDelay={200}
                    content={x.description}
                    classNames={{
                      base: [
                        // arrow color
                        "before:bg-[#FFF7E9] dark:before:bg-[#FFF7E9]",
                      ],
                      content: [
                        "p-4",
                        "text-[#202020] bg-[#FFF7E9] backdrop-filte-blur-1 text-[13px] font-normal rounded max-w-[250px] backdrop-filter backdrop-blur-sm",
                      ],
                    }}
                  >
                    <button
                      key={i}
                      type="button"
                      className={`p-3 px-7 font-light rounded-full max-[463px]:text-[12px] max-[463px]:font-normal max-[405px]:mb-2 bg-[#202020]  active:bg-[#FFF7E9] max-[367px]:px-6 max-[348px]:px-5 active:text-[#161616] transition-all ${
                        x.modo == "Crucigramas" ? "px-[35px]" : ""
                      }  ${
                        selected == x.modo
                          ? "hover:bg-[#FFF7E9]"
                          : "hover:bg-[#464441]"
                      } ${
                        selected == x.modo ? "bg-[#FFF7E9] text-[#161616]" : ""
                      }`}
                      onClick={() => {
                        onOff(x.modo);
                        setTimeout(() => {
                          setIsOpen(x.modo);
                        }, 5);
                      }}
                    >
                      {x.modo}
                    </button>
                  </Tooltip>
                );
              })}
              <span
                className={`text-[#a4204a] pl-[5px] w-full text-[13px] font-medium relative top-[-8.5px] opacity-0 ${
                  error1 && "opacity-100"
                }`}
              >
                Requerido
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center mt-6">
            <button type="submit" className="p-4 px-6 rounded bg-[#202020]">
              Comenzar sesión
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
    </section>
  );
}

export default PractForm;
