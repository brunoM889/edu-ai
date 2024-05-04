"use client";
import React, { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/react";
import Chat from "@/components/Chat";
import ApuntePreview from "@/components/apuntesSection/ApuntePreview";
import { useRouter } from "next/navigation";
import { Switch } from "@nextui-org/react";

import "@/app/globals.css";
function CrearPage({ params }) {
  const [file, setFile] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [modal, setModal] = useState("hidden");
  const [animation, setAnimation] = useState("off");
  const [textValue, setTextValue] = useState("");
  const [title, setTitle] = useState("");
  const [permisos, setPermisos] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(0);
  const onSubmit = async (x) => {
    const formData = new FormData();
    formData.append("file", x);
    const res = await fetch("/api/apuntesHandler/getResumen", {
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

  const save = async () => {
    if (params.id == "crear") {
      const res = await fetch("/api/apuntesHandler/apuntesAPI", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          apunte: textValue,
          state: isSelected,
        }),
        headers: {
          "Content-Type": "/aplication/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error al guardar el resumen");
      } else {
        router.push("/apuntes");
      }
    } else {
      const res = await fetch("/api/apuntesHandler/editarApunte", {
        method: "PUT",
        body: JSON.stringify({
          title: title,
          apunte: textValue,
          state: isSelected,
          id: id,
        }),
        headers: {
          "Content-Type": "/aplication/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.log("Error al guardar el resumen");
      } else {
        router.push("/apuntes");
      }
    }
  };

  const getResumen = async (id) => {
    console.log(id);
    const res = await fetch("/api/apuntesHandler/editarApunte", {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await res.json();
    if (data.error) {
      router.push("/apuntes");
    } else {
      setTitle(data.title);
      setTextValue(data.content);
      setId(data.id);
      setIsSelected(data.state);
      setPermisos(true);
    }
  };

  useEffect(() => {
    if (params.id != "crear") {
      if (params.id.slice(0, 7) == "editar%") {
        getResumen(parseInt(params.id.slice(9, params.id.length)));
      } else {
        router.push("/apuntes");
      }
    } else if (params.id == "crear") {
      setPermisos(true);
    }
  }, []);

  return (
    <main
      className={`w-full bg-transparent h-fit flex justify-center pt-[64px]`}
    >
      {permisos && (
        <section className="w-full bg-transparent h-fit flex justify-center">
          {resumen && (
            <ApuntePreview
              transferir={transferir}
              resumen={resumen}
              modal={modal}
              animation={animation}
              title={false}
              openAndCloseModal={openAndCloseModal}
            />
          )}
          <div className="flex flex-col gap-4 w-[90%] max-w-[600px] h-[80vh] min-h-[600px] mt-[24px]">
            <div className="flex justify-between max-[652px]:gap-4 max-[652px]:justify-end flex-wrap gap-2">
              {!file ? (
                <div className="gap-2 hidden max-[652px]:flex">
                  <Tooltip
                    showArrow
                    placement="bottom"
                    delay={20}
                    content={`Sube tu propio PDF y resúmelo automáticamente con IA para tu apunte. Aviso: con apuntes que poseen una sintaxis fuera de lo común como por ejemplo la notación matemática, al reinterpretar el apunte se pueden encontrar errores.`}
                    classNames={{
                      base: [
                        // arrow color
                        "before:bg-[#D2CCC0] dark:before:bg-[#D2CCC0] rounded",
                      ],
                      content: [
                        "p-4",
                        "text-[#202020] text-[13px] font-normal bg-[#D2CCC0] rounded max-w-[250px]",
                      ],
                    }}
                  >
                    <label
                      htmlFor="f"
                      className={`px-5 w-fit flex items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11`}
                    >
                      Usar pdf
                    </label>
                  </Tooltip>
                </div>
              ) : (
                <div className="min-h-[35px] justify-center items-center hidden max-[652px]:flex">
                  {resumen ? (
                    <button
                      className={`px-5 w-fit flex items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11`}
                      onClick={() => {
                        openAndCloseModal();
                      }}
                    >
                      Ver resumen
                    </button>
                  ) : (
                    <div className="h-[16px] loader-1 center w-fit min-w-[85px] rounded relative">
                      <span></span>
                    </div>
                  )}
                </div>
              )}
              <label
                className={`px-5 w-fit items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11 hidden max-[652px]:flex`}
                onClick={save}
              >
                Guardar
              </label>
              <input
                type="text"
                placeholder="Sobre qué trata tu apunte?"
                maxLength={32}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="w-[62%] font-light rounded placeholder:text-[#fff7e97b] bg-gradient-to-tl to-[#202020] from-[#161616] min-w-[250px] h-11 px-3 text-[14px] max-[652px]:w-full max-[652px]:mb-1"
              />
              {!file ? (
                <div className="flex max-[652px]:hidden gap-2">
                  <Tooltip
                    showArrow
                    placement="bottom"
                    delay={20}
                    content={`Sube tu propio PDF y resúmelo automáticamente con IA para tu apunte. Aviso: con apuntes que poseen una sintaxis fuera de lo común como por ejemplo la notación matemática, al reinterpretar el apunte se pueden encontrar errores.`}
                    classNames={{
                      base: [
                        // arrow color
                        "before:bg-[#D2CCC0] dark:before:bg-[#D2CCC0] rounded",
                      ],
                      content: [
                        "p-4",
                        "text-[#202020] text-[13px] font-normal bg-[#D2CCC0] rounded max-w-[250px]",
                      ],
                    }}
                  >
                    <label
                      htmlFor="f"
                      className={`px-5 w-fit flex items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11`}
                    >
                      Usar pdf
                    </label>
                  </Tooltip>
                </div>
              ) : (
                <div className="min-h-[35px] flex max-[652px]:hidden justify-center items-center">
                  {resumen ? (
                    <button
                      className={`px-5 w-fit flex items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11`}
                      onClick={() => {
                        openAndCloseModal();
                      }}
                    >
                      Ver resumen
                    </button>
                  ) : (
                    <div className="h-[16px] loader-1 center w-fit min-w-[85px] rounded relative">
                      <span></span>
                    </div>
                  )}
                </div>
              )}
              <label
                className={`px-5 w-fit flex max-[652px]:hidden items-center text-[12px] font-normal rounded bg-[#202020] active:scale-90 transition-all hover:bg-[#464441] cursor-pointer h-11`}
                onClick={save}
              >
                Guardar
              </label>
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
            </div>
            <textarea
              className="resize-none w-full h-[100%] text-[14px] bg-gradient-to-tr from-[#202020] to-[#161616] to-80% rounded p-3 text-base placeholder:text-[#fff7e97b] border-none outline-none font-extralight"
              style={{ boxShadow: "0px -10px 15px rgb(0,0,0, .1)" }}
              value={textValue}
              onChange={(e) => {
                setTextValue(e.target.value);
              }}
            ></textarea>
            <div className="flex w-[100%] justify-center items-center mt-[10px] text-[#6E6A66] text-[14px]">
              <Switch
                size="sm"
                isSelected={isSelected == 1 ? true : false}
                onClick={() => {
                  if (isSelected == 1) {
                    setIsSelected(0);
                  } else {
                    setIsSelected(1);
                  }
                }}
              ></Switch>
              <span
                className="w-[46px] select-none"
                style={{ textShadow: "0px 0px 5px rgb(0,0,0,.3)" }}
              >
                {isSelected == 1 ? "Público" : "Privado"}
              </span>
            </div>
          </div>
          <Chat />
        </section>
      )}
    </main>
  );
}

export default CrearPage;
