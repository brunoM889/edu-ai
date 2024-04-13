import { NextResponse } from "next/server";
import model from "@/libs/ai";

export async function POST(req) {
  const res = await req.json();
  const resultados = res.resultados;
  try {
    const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
        Vas a recibir una pregunta/consigna y una respuesta que dio el usuario a esa pregunta.
        En tu respuesta, vas a devolver, de ser necesario, una correccion/feedback de la respuesta del usuario, de no ser necesario vas a decirle al usuario que la respuesta es correcta(de forma creativa), la correccion debe ser relativamente corta, debe indicar en que parte de la respuesta esta el error y alguna recomendacion de como mejorar, aparte de la correccion se debe dar un puntaje del uno al diez dependiendo que tan correcta sea la respuesta(la correccion no debe tener mas de un parrafo). En la correccion vas a ser exigente, si la respuesta no esta lo suficientemente justificada, le falta contenido o tiene errores de cualquier tipo, lo vas a penalizar reduciendo la nota que le vas a dar.
      
      Por ejemplo con la pregunta "Analiza las consecuencias sociales y económicas de la guerra en Europa" y la respuesta "Las consecuencias sociales de la guerra en Europa fueron marcadas por la pérdida masiva de vidas humanas, el sufrimiento y el trauma generalizado debido a la destrucción de ciudades y la muerte de millones de personas. En términos económicos, la guerra dejó a muchas naciones europeas en ruina, con industrias paralizadas, desempleo masivo y una carga de deuda significativa. La reconstrucción requería enormes inversiones y esfuerzos a largo plazo, mientras que la dependencia de la ayuda externa para la recuperación económica prolongó las dificultades económicas en toda la región durante décadas." tu respuesta deberia tener el siguiente formato:

      Si bien la respuesta es precisa, podría mejorarse agregando ejemplos específicos de países o eventos que ilustren el impacto de la guerra en la sociedad y la economía europea. Esto haría que la respuesta fuera más concreta y ayudaría a los lectores a comprender mejor las consecuencias reales de la guerra.
      8

      (aclaracion1: Debe estar la correcion y en el siguiente renglon la nota y la nota debe ser si o si un numero entero entre el 1 y el 10, no puede ser 0, debe haber un salto de linea entre la correccion y la nota)

      (aclaracion2: Si la la respuesta que recibes no esta relacionada con la pregunta, entonces debes devolver el siguiente mensaje 
      
      $error, respuesta invalida
      )

      Pregunta/consigna:{${resultados.q}}

      Respuesta:{${resultados.a}}
      `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    //console.log(text);
    const lines = text.split("\n");
    console.log(lines);

    if (text[0] == "$") {
      return NextResponse.json({ error: true });
    } else {
      if (lines[1] == "") {
        return NextResponse.json({
          correccion: lines[0],
          nota: lines[2],
          error: false,
        });
      } else if (lines[1] != "") {
        return NextResponse.json({
          correccion: lines[0],
          nota: lines[1],
          error: false,
        });
      } else {
        return NextResponse.json({
          correccion: lines[0],
          nota: 5,
          error: false,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
