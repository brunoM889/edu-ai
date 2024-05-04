import { NextResponse } from "next/server";
import model from "@/libs/ai";

export async function POST(req) {
  const res = await req.json();
  const pregunta = res.pregunta;
  try {
    const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
        Vas a recibir una pregunta/consigna.
        En tu respuesta, vas a devolver 4 respuestas posibles, entre ellas la correcta debe estar marcada con un "*" y el resto incorrectas, las incorrectas no deben ser tan distantes de la correcta, es decir, deben ser erradas pero no exageradamente. Las respuestas deben ser relativamente cortas, pero sin comprometer la respuesta, es decir, es mas importante que la respuesta sea correcta y las incorrectas esten bien hechas a que las respuestas sean super cortas.

      **********SOLO PUEDE HABER UNA CORRECTA**********

      Por ejemplo con la pregunta "¿Cuál es el teorema fundamental utilizado para evaluar límites que involucran funciones racionales?" tu respuesta deberia tener el siguiente formato:

      Teorema del valor intermedio.
      *Teorema del límite infinito.
      Teorema de la función continua.
      Teorema del factorización.

      (aclaracion: solamente debe estar la respuesta en cada renglon, no debes agregarle nada más)
      (segunda aclaracion: si la pregunta pide nombrar multiples opciones, debes dar esas multiples opciones, por ejemplo: 

      consigna: Cuales paises formaron el eje?
      tu respuesta:
      Francia, Rusia e Inglaterra
      Brasil, Rusia e Italia
      *Alemania, Italia y Japon
      Estados Unidos, Rusia e Inglaterra
      )
      
      
      Pregunta/consigna:{${pregunta}}
      `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    //console.log(text);
    const lines = text.split("\n");
    console.log(lines);

    return NextResponse.json({ opciones: lines, error: false });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
