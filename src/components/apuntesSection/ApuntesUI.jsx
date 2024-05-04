"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import "@/app/globals.css";
import ApunteCard from "./ApunteCard";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ApuntePreview from "./ApuntePreview";
function ApuntesUI({
  userApuntes,
  favoritos,
  setCantFavs,
  cantFavs,
  userData,
  getUserApuntes,
  setFavoritos,
}) {
  const [section, setSection] = useState(0);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [a, setA] = useState("on");
  const [busqueda, setBusqueda] = useState("");
  const [searchOn, setSearchOn] = useState(false);
  const [favoritosChanges, setFavoritosChanges] = useState(null);

  const [apuntesEnCache, setApuntesEnCache] = useState([]);

  const [apuntes, setApuntes] = useState(null);
  
  const [resumenSelected, setResumenSelected] = useState(null);

  const [modal, setModal] = useState("hidden");
  const [animation, setAnimation] = useState("off");
  
  const [comunidadApuntes, setComunidadApuntes] = useState(null);

  const getComunidadApuntes = async () => {
    const res = await fetch("/api/apuntesHandler/comunidadApuntes", {
      method: "GET",
    });
    const data = await res.json();
    if (data.error) {
      console.log("Error");
    } else {
      if (data.comunidadApuntes) {
        setComunidadApuntes(data.comunidadApuntes);
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

  const deleteApunte = async (id) => {
    const res = await fetch("/api/apuntesHandler/apuntesAPI", {
      method: "DELETE",
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "/aplication/json",
      },
    });
    const data = await res.json();
  };

  const updateFavs = async (x, y, z, id) => {
    console.log(x);
    const res = await fetch("/api/apuntesHandler/comunidadApuntes", {
      method: "PUT",
      body: JSON.stringify({
        favoritos: x ? x : "",
        cantFavs: y,
        operacion: z,
        id: id,
      }),
      headers: {
        "Content-Type": "/aplication/json",
      },
    });
    const data = await res.json();
    setFavoritos(favoritosChanges);
  };

  const switchFav = (x) => {
    let list = favoritosChanges.split(",");
    if (list.includes(x.id.toString())) {
      list.splice(list.indexOf(x.id.toString()), 1);
      let auxString = list.join(",");
      console.log(auxString);

      setFavoritosChanges(auxString);
      updateFavs(auxString, cantFavs - 1, 0, x.id);
      setCantFavs(cantFavs - 1);
      setTimeout(() => {
        getComunidadApuntes();
      }, 500);
    } else {
      if (cantFavs < 3) {
        console.log(cantFavs + 1);
        setFavoritosChanges(`${favoritosChanges},${x.id}`);
        updateFavs(`${favoritosChanges},${x.id}`, cantFavs + 1, 1, x.id);
        setCantFavs(cantFavs + 1);

        let a = apuntes;
        a.splice(a.length - 1, 0, x);
        setApuntes(a);
        getUserApuntes();
      }
    }
  };

  useEffect(() => {
    setFavoritosChanges(favoritos);
    getComunidadApuntes();
    setApuntes(userApuntes);
  }, []);

  return (
    <section className="w-[82%] flex flex-col items-center max-[960px]:w-[95%]">
      {error && (
        <div
          className={`w-fit max-w-[250px] h-fit fixed left-5 bottom-5 rounded rounded-bl-none bg-[#FFf7e9] p-3 z-20 ${
            error ? a : ""
          }`}
        >
          <p className="max-[450px]:text-[12px] text-[14px] font-light text-[#161616]">
            {error}
          </p>
        </div>
      )}
      {resumenSelected && (
        <ApuntePreview
          resumen={resumenSelected.content.split("\n")}
          modal={modal}
          animation={animation}
          openAndCloseModal={openAndCloseModal}
          title={resumenSelected.title}
          transferir={false}
        />
      )}
      <nav
        className={`flex w-full gap-10 flex-wrap justify-center max-[806px]:gap-8 fixed backdrop-blur-sm py-[30px] transition-all bg-gradient-to-b from-[#161616c9] to-transparent max-[806px]:pt-[20px] ${
          section == 0 ? "max-[806px]:h-[90px]" : "max-[806px]:h-[170px]"
        } overflow-hidden z-20`}
      >
        <div className="flex justify-center gap-10 max-[425px]:gap-2">
          <button
            className={`text-[16px] font-extralight p-[6px] px-4 border-b border-[#fff7e900] hover:bg-transparent max-[425px]:text-[14px] max-[350px]:text-[12px] hover:border-[#fff7e965] h-fit ${
              section == 0 && "border-[#fff7e965]"
            }`}
            onClick={() => {
              setSearchOn(false);
              setSection(0);
              setBusqueda("");
            }}
          >
            Mis apuntes
          </button>
          <button
            className={`text-[16px] font-extralight h-fit p-[6px] px-4 border-b border-[#fff7e900] hover:bg-transparent max-[425px]:text-[14px] max-[350px]:text-[12px] hover:border-[#fff7e965] max-[311px]:mb-2 ${
              section == 1 && "border-[#fff7e965]"
            }`}
            onClick={() => {
              setSection(1);
              setSearchOn(true);
            }}
          >
            Apuntes de la comunidad
          </button>
        </div>

        <div
          className={`w-fit h-fit flex items-center ${
            searchOn ? "opacity-100" : "opacity-0"
          } transition-all`}
        >
          <input
            className={`p-3 placeholder:text-[#fff7e9ad] font-extralight rounded border bg-transparent max-[806px]:w-[70vw] border-[#fff7e9ad] w-[30vw] min-w-[250px] h-fit max-w-[500px] ml-[28px] max-[400px]:w-[90vw]  ${
              section == 0 && "cursor-default"
            }`}
            placeholder="Search"
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            maxLength={section == 0 ? 0 : 100}
          />
          <IoSearch
            className={`w-[30px] h-[30px] text-[#fff7e9ad] relative right-[42px] rounded-full hover:text-[#fff7e9] transition-all charge ${
              section == 0 ? "cursor-default" : "cursor-pointer"
            }`}
          />
        </div>
      </nav>
      {section == 0 ? (
        <div className="on">
          {apuntes ? (
            <div
              className={`flex gap-[20px] flex-wrap mt-32 max-[806px]:mt-44 max-[1316px]:w-[790px] min-[1316px]:w-[1060px] max-[883px]:w-[545px] max-[883px]:justify-between max-[883px]:gap-[5vw] max-[590px]:w-full max-[555px]:justify-around overflow-hidden ${
                apuntes.length == 1 && "justify-center"
              }`}
            >
              {apuntes.map((x, i) => {
                if (x == 0) {
                  return (
                    <div
                      key={i}
                      className="w-[250px] h-[350px] min-w-[250px] max-h-[450px] min-h-[350px] rounded-md flex justify-center"
                    >
                      <div className="w-full h-full flex justify-center mt-16">
                        <button
                          style={{ textShadow: "0px 0px 10px #161616" }}
                          className="rounded font-light h-fit px-8 gap-2 py-[14px] flex justify-center text-[14px] items-center bg-[#d2ccc085] active:scale-95 hover:bg-[#D2CCC0] transition-all"
                          onClick={() => {
                            router.push(`/apuntes/crear`);
                          }}
                        >
                          <FaPlus />
                          Crear nuevo apunte
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <ApunteCard
                      setApuntes={setApuntes}
                      router={router}
                      deleteApunte={deleteApunte}
                      x={x}
                      key={i}
                      apuntes={apuntes}
                      setResumenSelected={setResumenSelected}
                      openAndCloseModal={openAndCloseModal}
                      switchFav={switchFav}
                      permisos={x.email == userData.email ? true : false}
                      setApuntesEnCache={setApuntesEnCache}
                      apuntesEnCache={apuntesEnCache}
                    ></ApunteCard>
                  );
                }
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="on">
          {comunidadApuntes && (
            <div
              className={`flex gap-[20px] flex-wrap mt-32 max-[806px]:mt-44 max-[1316px]:w-[790px] min-[1316px]:w-[1060px] max-[883px]:w-[545px] max-[883px]:justify-between max-[883px]:gap-[5vw] max-[590px]:w-full max-[555px]:justify-around overflow-hidden`}
            >
              {comunidadApuntes.map((x, i) => {
                return (
                  <ApunteCard
                    setApuntes={setApuntes}
                    router={router}
                    deleteApunte={deleteApunte}
                    x={x}
                    key={i}
                    apuntes={apuntes}
                    setResumenSelected={setResumenSelected}
                    openAndCloseModal={openAndCloseModal}
                    permisos={false}
                    comunidadApuntes={comunidadApuntes}
                    setComunidadApuntes={setComunidadApuntes}
                    switchFav={switchFav}
                    cantFavs={cantFavs}
                    setError={setError}
                    error={error}
                    setA={setA}
                    setApuntesEnCache={setApuntesEnCache}
                    apuntesEnCache={apuntesEnCache}
                  ></ApunteCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ApuntesUI;
