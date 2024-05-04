"use client";
import React from "react";
import { useState } from "react";
import PractForm from "@/components/practicaSecciones/PractForm";
import ModalidadHandler from "@/components/practicaSecciones/ModalidadHandler";
import "@/app/globals.css";
function PracticaPage() {
  const [modalidad, setModalidad] = useState(null);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [a, setA] = useState("on");
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [apunte, setApunte] = useState(false);
  const onSubmit = async (res) => {
    if (!loading) {
      if (res.pdf) {
        setLoading(true);
        const response = await fetch("/api/practicaHandler/practicaAIPDF", {
          method: "POST",
          body: res.pdf,
        });
        const data = await response.json();
        if (data.error) {
          setLoading(false);
          errorPopUp(
            "El pdf parece tener un formato inválido, intente nuevamente y si el error persiste, pruebe utilizando un pdf con un formato más claro"
          );
        } else {
          setLoading(false);
          setPdf(true);
          setRespuesta(data.respuesta);
          setModalidad(res.modalidad);
        }
      } else {
        if (res.apunte) {
          setLoading(true);
          const response = await fetch(
            "/api/practicaHandler/practicaAIApunte",
            {
              method: "POST",
              body: JSON.stringify({
                apunte: res.apunte,
                modalidad: res.modalidad,
              }),
              headers: {
                "Content-Type": "/aplication/json",
              },
            }
          );
          const data = await response.json();
          if (data.error) {
            setLoading(false);
            errorPopUp(
              "El pdf parece tener un formato inválido, intente nuevamente y si el error persiste, pruebe utilizando un pdf con un formato más claro"
            );
          } else {
            setLoading(false);
            setApunte(true);
            setRespuesta(data.respuesta);
            setModalidad(res.modalidad);
          }
        } else {
          setPdf(false);
          setLoading(true);
          const response = await fetch("/api/practicaHandler/practicaAI", {
            method: "POST",
            body: JSON.stringify({
              descripcion: res.prompt,
              modalidad: res.modalidad,
              pdf: res.pdf,
            }),
            headers: {
              "Content-Type": "/aplication/json",
            },
          });
          const data = await response.json();
          if (data.error) {
            setLoading(false);
            errorPopUp(
              "La descripción es poco clara o no abarca temas académicos"
            );
          } else {
            setLoading(false);
            setRespuesta(data.respuesta);
            setModalidad(res.modalidad);
          }
        }
      }
    }
  };

  const errorPopUp = (mensaje) => {
    console.log(mensaje);
    setError(mensaje);
    setTimeout(() => {
      setA("off");
      setTimeout(() => {
        setError(null);
        setA("on");
      }, 290);
    }, 6000);
  };

  return (
    <main className="w-full bg-transparent h-fit mt-[104px]">
      {loading && (
        <div className="h-[56px] loader-1 mt-[14px] center w-[10%] min-w-[85px]  rounded fixed left-1 bottom-6 z-20">
          <span></span>
        </div>
      )}
      {error && (
        <div
          className={`w-fit max-w-[250px] h-fit fixed left-5 bottom-5 rounded rounded-bl-none bg-[#fff7e9] p-3 z-20 ${
            error && a
          }`}
        >
          <p
            className={`max-[450px]:text-[12px] text-[14px] font-light text-[#161616]`}
          >
            {error}
          </p>
        </div>
      )}
      {!respuesta ? (
        <PractForm f={onSubmit} errorPopUp={errorPopUp} />
      ) : (
        <ModalidadHandler
          modalidad={modalidad}
          finish={() => {
            setModalidad(null);
            setRespuesta(null);
          }}
          pdf={pdf}
          apunte={apunte}
          respuesta={respuesta}
        />
      )}
    </main>
  );
}

export default PracticaPage;
