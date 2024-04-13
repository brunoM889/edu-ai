"use client";
import ReactFlipCard from "reactjs-flip-card";

import React from "react";
import { useState } from "react";
import {
  IoChevronBackCircleOutline,
  IoChevronForwardCircleOutline,
} from "react-icons/io5";

function FlashCardSection({ response }) {
  const [contador, setContador] = useState(0);
  const styles = {
    card: {
      background: "#202020",
      color: "#fff7e9",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      width: "100%",
      borderRadius: 6,
      paddingInline: "5vw",
    },
  };
  return (
    <section className="w-full h-[80vh] min-h-[600px] flex flex-col items-center pb-10">
      {response ? (
        <div>
          <ReactFlipCard
            frontStyle={styles.card}
            backStyle={styles.card}
            frontComponent={
              <span className="text-center text-[22px] max-[700px]:text-[16px] font-extralight">
                {response[contador].front}
              </span>
            }
            backComponent={
              <span className="text-center text-[22px] max-[700px]:text-[16px] font-extralight ">
                {response[contador].back}
              </span>
            }
          />

          <div className="mt-[15px] w-full flex justify-between">
            <span className="flex items-center ml-1 select-none">
              {contador + 1}/{response.length}
            </span>
            <div className="flex gap-2 mr-1">
              <IoChevronBackCircleOutline
                className="text-[35px] cursor-pointer rounded-full active:scale-95 hover:text-[#c0b8ab] transition-all"
                onClick={() => {
                  if (contador == 0) {
                    setContador(response.length-1);
                  } else {
                    let count = contador - 1;
                    setContador(count);
                  }
                }}
              ></IoChevronBackCircleOutline>
              <IoChevronForwardCircleOutline
                className="text-[35px] cursor-pointer rounded-full active:scale-95 hover:text-[#c0b8ab] transition-all"
                onClick={() => {
                  if (contador == response.length - 1) {
                    setContador(0);
                  } else {
                    let count = contador + 1;
                    setContador(count);
                  }
                }}
              ></IoChevronForwardCircleOutline>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export default FlashCardSection;
