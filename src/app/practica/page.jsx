"use client";
import React from "react";
import { useState } from "react";
import PractForm from "@/components/practicaSecciones/PractForm";
import ModalidadHandler from "@/components/practicaSecciones/ModalidadHandler";
function PracticaPage() {
  const [modalidad, setModalidad] = useState(null);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [a, setA] = useState("on");
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(false);
  const onSubmit = async (res) => {
    if (!loading && !error) {
      if (res.pdf) {
        setLoading(true);
        const response = await fetch("/api/practicaAIPDF", {
          method: "POST",
          body: res.pdf,
        });
        const data = await response.json();
        if (data.error) {
          setLoading(false);
          setError("Error");
          setTimeout(() => {
            setA("off");
            setTimeout(() => {
              setError(null);
              setA("on");
            }, 290);
          }, 4000);
        } else {
          setLoading(false);
          setPdf(true);

          setRespuesta(data.respuesta);
          setModalidad(res.modalidad);
        }
      } else {
        setLoading(true);
        const response = await fetch("/api/practicaAI", {
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
          setError(
            "El prompt debe ser un poco más específico sobre los temas que quieres estudiar."
          );
          setTimeout(() => {
            setA("off");
            setTimeout(() => {
              setError(null);
              setA("on");
            }, 290);
          }, 4000);
        } else {
          setLoading(false);
          setRespuesta(data.respuesta);
          setModalidad(res.modalidad);
        }
      }
    }
  };
  return (
    <main className="w-full bg-[#161616] h-fit">
      {loading && (
        <div className="h-[56px] loader-1 mt-[14px] center w-[10%] min-w-[85px]  rounded fixed left-1 bottom-6">
          <span></span>
        </div>
      )}
      {error && (
        <div
          className={`w-fit max-w-[250px] h-fit fixed left-5 bottom-5 rounded rounded-bl-none bg-[#FFf7e9] p-3 ${
            error ? a : ""
          }`}
        >
          <p className="max-[450px]:text-[12px] text-[14px] font-light text-[#161616]">
            {error}
          </p>
        </div>
      )}
      {!respuesta ? (
        <PractForm f={onSubmit} />
      ) : (
        <ModalidadHandler
          modalidad={modalidad}
          finish={() => {
            setModalidad(null);
            setRespuesta(null);
          }}
          pdf={pdf}
          respuesta={respuesta}
        />
      )}
    </main>
  );
}

export default PracticaPage;
