"use client";
import React, { useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoHeartDislikeOutline } from "react-icons/io5";

import "@/app/globals.css";
function ApunteCard({
  setApuntes,
  deleteApunte,
  router,
  x,
  apuntes,
  setResumenSelected,
  openAndCloseModal,
  permisos,
  comunidadApuntes,
  setComunidadApuntes,
  switchFav,
  cantFavs,
  setError,
  setA,
  error,
  setApuntesEnCache,
  apuntesEnCache,
  practica,
  selectApunte,
}) {
  const [desba, setDesba] = useState(null);
  const [cambiando, setCambiando] = useState(false);
  return (
    <div
      className={`hoja w-[250px] h-[350px] min-w-[250px] max-h-[450px] min-h-[350px] rounded-md bg-[#D2CCC0] flex flex-col px-4 items-center opacity-80 transition-all ${
        practica && "cursor-pointer hover:opacity-70"
      } ${desba == x.id && "offf"}`}
      onClick={() => {
        if (practica) {
          selectApunte(x);
        }
      }}
    >
      <div className="w-full h-full flex flex-col items-center px-2 py-4 border-l border-[#7a766c2d]">
        <div className="min-h-[80%] w-full mb-3">
          <h4 className="text-[#202020] leading-[22px] text-[18px] mt-[5px] font-bold mb-[20px]">
            {x.title}
          </h4>
          <p className="text-[14px] leading-5 font-medium text-[#2020208c] break-words">
            {x.apunte.length > 220 ? `${x.apunte.slice(0, 220)}...` : x.apunte}
          </p>
        </div>
        {!practica && (
          <>
            {permisos ? (
              <div className="flex w-[80%] justify-evenly">
                <button
                  className="h-[35px] w-[35px] rounded flex justify-center items-center hover:bg-transparent hover:shadow-[#16161667] hover:shadow-lg text-[#2020208c]"
                  onClick={() => {
                    router.push(`/apuntes/editar=${x.id}`);
                  }}
                >
                  <FaPen />
                </button>
                <button
                  className="text-[#2020208c] h-[35px] w-[35px] rounded flex justify-center items-center text-[18px] hover:bg-transparent hover:shadow-[#16161667] hover:shadow-lg"
                  onClick={() => {
                    console.log({ title: x.title, content: x.apunte });
                    openAndCloseModal();
                    setResumenSelected({ title: x.title, content: x.apunte });
                  }}
                >
                  <FaEye />
                </button>
                <button
                  className="text-[#2020208c] h-[35px] w-[35px] rounded flex justify-center items-center hover:bg-transparent hover:shadow-[#16161667] hover:shadow-lg"
                  onClick={() => {
                    deleteApunte(x.id);
                    setDesba(x.id);
                    let apts = apuntes.filter((e) => {
                      return e !== x;
                    });
                    setTimeout(() => {
                      setApuntes(apts);
                    }, 290);
                    console.log(apuntes);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              <div className="flex w-[80%] justify-evenly">
                <button
                  className="text-[#2020208c] h-[35px] w-[35px] rounded flex justify-center items-center hover:bg-transparent text-[18px] hover:shadow-[#16161667] hover:shadow-lg"
                  onClick={async () => {
                    console.log({ title: x.title, content: x.apunte });
                    let apunte = apuntesEnCache.find((a) => {
                      return a.id == x.id;
                    });
                    if (apunte != undefined) {
                      setResumenSelected({
                        title: x.title,
                        content: apunte.content,
                      });
                      openAndCloseModal();
                    } else {
                      const res = await fetch(
                        "/api/apuntesHandler/getUniqueApunte",
                        {
                          method: "POST",
                          body: JSON.stringify({
                            id: x.id,
                          }),
                          headers: {
                            "Content-Type": "/aplication/json",
                          },
                        }
                      );
                      const data = await res.json();
                      if (error) {
                        console.log("Error");
                      } else {
                        setResumenSelected({
                          title: x.title,
                          content: data.content,
                        });
                        openAndCloseModal();
                        let aux = apuntesEnCache;
                        aux.push({
                          id: x.id,
                          title: x.title,
                          content: data.content,
                        });
                        setApuntesEnCache(aux);
                      }
                    }
                  }}
                >
                  <FaEye />
                </button>
                <button
                  className="text-[#2020208c] h-[35px] w-[35px] rounded flex justify-center items-center text-[20px] hover:bg-transparent hover:shadow-[#16161667] hover:shadow-lg"
                  onClick={() => {
                    if (!cambiando) {
                      setCambiando(true);
                      if (comunidadApuntes) {
                        if (cantFavs < 3) {
                          switchFav(x);
                          setDesba(x.id);
                          let apts = comunidadApuntes.filter((e) => {
                            return e !== x;
                          });
                          setTimeout(() => {
                            setComunidadApuntes(apts);
                            setDesba(null);
                          }, 290);
                        } else {
                          if (!error) {
                            setError("Alcanzaste el límite de favoritos");
                            setTimeout(() => {
                              setA("off");
                              setTimeout(() => {
                                setError(null);
                                setA("on");
                              }, 290);
                            }, 2000);
                          }
                        }
                      } else {
                        switchFav(x);
                        setDesba(x.id);
                        let apts = apuntes.filter((e) => {
                          return e !== x;
                        });
                        setTimeout(() => {
                          setApuntes(apts);
                          setDesba(null);
                        }, 290);
                      }
                      setTimeout(() => {
                        setCambiando(false);
                      }, 500);
                    }
                  }}
                >
                  {comunidadApuntes ? (
                    <IoMdHeartEmpty />
                  ) : (
                    <IoHeartDislikeOutline />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ApunteCard;
