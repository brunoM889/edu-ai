"use client";
import React, { useEffect, useState } from "react";
import ApuntesUI from "@/components/apuntesSection/ApuntesUI";
import "@/app/globals.css";
function ApuntesPage() {
  const [userData, setUserData] = useState(null);
  const [isCharged, setIsCharged] = useState(false);
  const [apuntes, setApuntes] = useState(null);
  const [favoritos, setFavoritos] = useState(null);
  const [cantFavs, setCantFavs] = useState(null);
  const getUserApuntes = async () => {
    const res = await fetch("/api/apuntesHandler/apuntesAPI", {
      method: "GET",
    });
    const data = await res.json();
    if (data.error) {
      console.log("Error");
    } else {
      if (data.response) {
        setUserData(data.response);
        data.apuntes.push(0);
        setApuntes(data.apuntes);
        setCantFavs(data.cantFavs);
        setFavoritos(data.favoritos);
      }
    }
    setIsCharged(true);
  };

  useEffect(() => {
    getUserApuntes();
  }, []);

  return (
    <main className="w-full bg-transparent h-fit flex justify-center mt-[64px]">
      {isCharged ? (
        <div className="w-full flex justify-center">
          {userData ? (
            <ApuntesUI
              userApuntes={apuntes}
              favoritos={favoritos}
              cantFavs={cantFavs}
              setFavoritos={setFavoritos}
              setCantFavs={setCantFavs}
              userData={userData}
              getUserApuntes={getUserApuntes}
            ></ApuntesUI>
          ) : (
            <section></section>
          )}
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}

export default ApuntesPage;
