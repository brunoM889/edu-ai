"use client";
import React, { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { Tooltip } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import ApunteCard from "../apuntesSection/ApunteCard";
import "@/app/globals.css";
function PractForm({ f, errorPopUp }) {
  const [prompt, setPrompt] = useState("");
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [client, setClient] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [apunte, setApunte] = useState(null);

  const [userApuntes, setUserApuntes] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [animation, setAnimation] = useState("off");
  const [modal, setModal] = useState("hidden");
  const onOff = (modo) => {
    if (error1) {
      setError1(false);
    }
    setSelected(modo);
  };

  const modos = [
    {
      modo: "Flash cards",
      description:
        "La metodología de estudio con flashcards implica utilizar tarjetas con preguntas o conceptos en un lado y respuestas en el otro. Se lee el concepto en el frente de la tarjeta y se intenta deducir la respuesta o la información relacionada que se encuentra en la parte trasera.",
    },
    {
      modo: "Preguntas y respuestas",
      description:
        "En esta modalidad, recibirás 10 preguntas que intentarás responder, y luego recibirás una corrección o retroalimentación para cada una de tus respuestas, junto con una nota final. Este formato es ideal para practicar para exámenes, ya que se asemeja al estilo comúnmente utilizado en la mayoría de las evaluaciones.",
    },
    {
      modo: "Multiple choice",
      description:
        "Multiple choice es una práctica en la que recibirás preguntas con múltiples opciones de respuesta. Es un método ideal para estudiar de forma entretenida y, al mismo tiempo, productiva.",
    },
    {
      modo: "Acierta la palabra",
      description:
        "Es una modalidad en la que tendrás que descifrar la palabra a la que hace referencia un concepto usando las letras que se te proporcionan. Esta forma de estudiar es genial, ya que sentirás que estás jugando un juego y al mismo tiempo estarás adquiriendo conceptos para tu examen.",
    },
    {
      modo: "Verdadero o falso",
      description:
        "Similar a la modalidad de multiple choice, este modo es rápido y sencillo pero a su vez eficaz. Recibirás afirmaciones y tendrás que decidir si son Verdaderas o Falsas.",
    },
    { modo: "Crucigramas", description: "En desarrollo" },
  ];
  const send = () => {
    if (!pdf) {
      if (apunte) {
        if (selected) {
          f({ pdf: null, apunte: apunte.apunte, modalidad: selected });
        } else {
          setError1(true);
        }
      } else {
        if (selected && prompt != "") {
          f({ modalidad: selected, prompt: prompt, pdf: null, apunte: null });
        } else {
          if (!selected) {
            setError1(true);
          }
          if (prompt == "") {
            setError2(true);
          }
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

  const openApunteSelector = async () => {
    if (!userApuntes) {
      const res = await fetch("/api/apuntesHandler/apuntesAPI", {
        method: "GET",
      });
      const data = await res.json();

      if (data.error) {
        errorPopUp("Ocurrió un error encontrando sus apuntes");
      } else {
        if (data.response) {
          openAndCloseModal();
          console.log(data.apuntes);
          setUserApuntes(data.apuntes);
        } else {
          errorPopUp("Iniciá sesión para usar tus apuntes");
        }
      }
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

  useEffect(() => {
    setClient(true);
  }, []);
  const [isOpen2, setIsOpen2] = useState(false);
  return (
    <section
      className="w-full min-h-[75vh] z-10"
      onClick={() => {
        setIsOpen("");
        setIsOpen2(false);
      }}
    >
      {userApuntes && (
        <div
          className={`${modal} ${animation} justify-center h-[95vh] top-[64px] pt-[20px] z-40 bg-[#20202000] backdrop-blur-sm left-0 right-0 m-auto flex fixed px-2`}
        >
          <div className={`max-w-[815px] w-[95vw] max-[1000px]:max-w-[530px]`}>
            <div className="w-full h-[50px] flex justify-end">
              <IoClose
                className={`text-[30px] p-1 rounded-full cursor-pointer bg-[#202020] active:scale-90 hover:bg-[#464441] transition-all`}
                onClick={() => {
                  if (animation == "on") {
                    openAndCloseModal();
                  }
                }}
              ></IoClose>
            </div>
            <div className="w-full flex flex-wrap gap-3 max-[539px]:justify-center apuntes-container overflow-y-auto h-[80vh]">
              {userApuntes.map((x, i) => {
                return (
                  <ApunteCard
                    x={x}
                    key={i}
                    permisos={false}
                    practica={true}
                    selectApunte={(x) => {
                      setApunte(x);
                      openAndCloseModal();
                      console.log(x);
                    }}
                  ></ApunteCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {client ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
            setIsOpen("");
            setIsOpen2(false);
          }}
          className="w-full flex flex-wrap gap-5 justify-center max-[893px]:flex-col max-[893px]:items-center"
        >
          <div className="w-[40%] max-w-[550px] min-[893px]:pt-10 flex flex-col items-center max-[893px]:w-[90%]">
            <h2
              htmlFor="prompt"
              className="text-center mb-6 max-[397px]:max-w-[261px] text-[18px] font-extralight flex items-center gap-2"
            >
              Describí los temas qué vas a estudiar
              <Tooltip
                showArrow
                placement="left"
                style={{ zIndex: 10 }}
                isOpen={isOpen2 && true}
                delay={20}
                content={`Recomendamos usar el siguiente input para obtener el mejor resultado: \'{Nombre de la materia o area de los temas}, tema1, tema2, tema3...\'`}
                classNames={{
                  base: [
                    // arrow color
                    `before:bg-[#fff7e9] dark:before:bg-[#D2CCC0] rounded`,
                  ],
                  content: [
                    "p-4",
                    `text-[#202020] text-[13px] font-normal bg-[#D2CCC0] z-10 rounded max-w-[250px]`,
                  ],
                }}
              >
                <button
                  type="button"
                  className={`hover:bg-[#161616] mt-[2px] rounded-full cursor-pointer`}
                  onClick={() => {
                    if (!isOpen2) {
                      setTimeout(() => {
                        setIsOpen2(true);
                      }, 2);
                    }
                  }}
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
              maxLength={pdf || apunte ? 0 : 200}
              className={`w-[70%] text-[14px] h-48 bg-[#202020] resize-none rounded-md p-3 font-light text-base`}
              placeholder="Algebra y geometria analítica 2, análisis combinatorio, matrices y determinantes."
            />
            <span
              className={`text-[#a4204a] text-[13px] w-[69%] text-right mt-1 font-medium max-[1220px]:w-[94%] opacity-0 ${
                error2 && "opacity-100"
              } max-[350px]:relative max-[350px]:top-[-30px] max-[350px]:left-[-8px] max-[350px]:text-[12px] `}
            >
              Requerido
            </span>
            <div className="w-[69%] mt-1 min-h-[34px] flex items-center gap-[10px] font-medium relative top-[-15px] max-[1220px]:w-[94%]">
              {prompt == "" && (
                <>
                  <button
                    className={`p-2 px-5 text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 active:text-[#161616] transition-all hover:bg-[#464441] cursor-pointer ${
                      apunte && `bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]`
                    }`}
                    type="button"
                    onClick={() => {
                      if (animation == "off") {
                        openApunteSelector();
                      }
                    }}
                  >
                    Mis apuntes
                  </button>

                  {!pdf && apunte && (
                    <IoClose
                      className={`cursor-pointer text-[25px] rounded-full p-[4px] bg-[#202020] transition-all active:scale-90`}
                      onClick={() => {
                        setApunte(null);
                      }}
                    ></IoClose>
                  )}
                  {!apunte && (
                    <label
                      htmlFor="f"
                      className={`p-2 px-5 text-[12px] font-normal rounded-full bg-[#202020] active:scale-90 active:text-[#161616] transition-all hover:bg-[#464441] cursor-pointer ${
                        pdf && `bg-[#fff7e9] text-[#161616] hover:bg-[#fff7e9]`
                      }`}
                    >
                      Usar pdf
                    </label>
                  )}

                  <input
                    id="f"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    key={fileInputKey}
                    onChange={(e) => {
                      setPdf(e.target.files[0]);
                    }}
                  />
                  {pdf && !apunte && (
                    <IoClose
                      className={`cursor-pointer text-[25px] rounded-full p-[4px] bg-[#202020] transition-all active:scale-90`}
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
          <div className="w-[50%] min-[893px]:min-h-[400px] flex flex-col min-w-[270px] max-w-[750px] items-center max-[893px]:w-[90%] min-[893px]:pt-10">
            <label
              htmlFor="prompt"
              className="text-center mb-6 text-[18px] font-extralight opacity-100"
            >
              Seleccioná la metodologia de estudio
            </label>
            <div className="flex w-[610px] flex-wrap gap-[12px] buttons-container max-[463px]:w-[95%] max-[405px]:w-[100%] max-[405px]:gap-2 justify-between max-[348px]:gap-1 min-w-[293.5px]">
              {modos.map((x, i) => {
                return (
                  <Tooltip
                    key={i}
                    showArrow
                    style={{ zIndex: 10 }}
                    isOpen={isOpen == x.modo && true}
                    placement="bottom"
                    delay={0}
                    closeDelay={200}
                    content={x.description}
                    classNames={{
                      base: [
                        // arrow color
                        `before:bg-[#D2CCC0]  dark:before:bg-[#D2CCC0]`,
                      ],
                      content: [
                        "p-4",
                        `text-[#161616] bg-[#D2CCC0] backdrop-filte-blur-1 text-[13px] font-normal rounded max-w-[270px] backdrop-filter backdrop-blur-sm`,
                      ],
                    }}
                  >
                    <button
                      key={i}
                      type="button"
                      className={`p-3 px-7 font-light rounded-full max-[463px]:text-[12px] max-[463px]:font-normal max-[405px]:mb-2 bg-[#202020] active:bg-[#fff7e9] max-[367px]:px-6 max-[348px]:px-5 active:text-[#161616] transition-all ${
                        x.modo == "Crucigramas" ? "px-[35px]" : ""
                      }  ${
                        selected == x.modo
                          ? `hover:bg-[#fff7e9]`
                          : `hover:bg-[#464441]`
                      } ${
                        selected == x.modo ? `bg-[#fff7e9] text-[#161616]` : ""
                      }`}
                      onClick={() => {
                        onOff(x.modo);
                        if (isOpen != x.modo) {
                          setTimeout(() => {
                            setIsOpen(x.modo);
                          }, 2);
                        }
                      }}
                    >
                      {x.modo}
                    </button>
                  </Tooltip>
                );
              })}
              <span
                className={`text-[#a4204a] pr-[3px] w-full text-[13px] font-medium relative top-[-6px] opacity-0 max-[350px]:text-[12px] text-end ${
                  error1 && "opacity-100"
                }`}
              >
                Requerido
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center pt-6 min-h-[20vh]">
            <button
              type="submit"
              className={`p-4 h-fit px-6 rounded bg-[#202020]`}
            >
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
