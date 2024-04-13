import { NextResponse } from "next/server";
import model from "@/libs/ai";
import PdfParse from "pdf-parse";

const promptProcess = (lines) => {
  const resFinal = [];
  for (const i of lines) {
    let comienzo = 2;
    let front = "";
    let back = "";
    for (const a of i) {
      if (comienzo == 1 && a != "{" && a != "}" && a != "[" && a != "]") {
        front += a;
      } else if (comienzo == 0 && a != "}" && a != "[" && a != "]") {
        back += a;
      }
      if (a == "{") {
        if (comienzo == 1) {
          comienzo = 0;
        } else {
          comienzo = 1;
        }
      }
    }
    resFinal.push({ front: front, back: back });
  }
  return resFinal;
};

export async function POST(req) {
  const res = await req.formData();
  const pdfBuffer = await res.get("file").arrayBuffer();
  const modalidad = await res.get("modalidad");

  const data = await PdfParse(pdfBuffer);
  const pdfText = data.text;

  try {
    if (modalidad == "Flash cards") {
      const prompt = `
      PDF:{${pdfText}}
      ACLARACIONES:
        LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
        ***IMPORTANTE*** 
        Estas son las aclaraciones de como debes responder:
        Vas a recibir una texto que representa un pdf sobre la materia y/o los temas sobre los que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS, 
        ***MUY IMPORTANTE***
        Si el texto que recibes no parece ser sobre una materia/temas academicos, vas a responder con un $.
        En cambio si el texto es valido, vas a devolver 10 flash cards relacionadas con el pdf proveido. El formato es el siguiente 
        [{Nombre del concepto o algo que haga alucion a la respuesta}{Descripcion/explicacion breve del concepto}] 
        o tambien puede ser al reves, de la siguiente forma 
        [{Descripcion/explicacion breve del concepto}{Nombre del concepto o algo que haga alucion a la respuesta}]
        ...

        Por ejemplo, supongamos que el pdf trata sobre "analisis matematico, limites" tu respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):

        [{Definición de límite}{El valor que una función se aproxima a medida que la variable independiente se acerca a cierto valor o infinito.}]
        [{Propiedad de suma de límites}{El límite de la suma de dos funciones es la suma de los límites de esas funciones individuales.}]
        [{Propiedad de producto de límites}{El límite del producto de dos funciones es el producto de los límites de esas funciones individuales}]

        y asi hasta llegar a 10, NO MAS DE 10.

        (aclaracion: En caso de que el pdf que recibiste tiene simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)

        
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        const resFinal = promptProcess(lines);

        console.log(resFinal);
        return NextResponse.json({ respuesta: resFinal, error: false });
      }
    } else if (modalidad == "Preguntas y respuestas") {
      const prompt = `
      PDF:{${pdfText}}
      ACLARACIONES:
        LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
        ***IMPORTANTE*** 
        Estas son las aclaraciones de como debes responder:
        Vas a recibir una texto que representa un pdf sobre la materia y/o los temas sobre los que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
        ***MUY IMPORTANTE***
        Si el texto que recibes no parece ser sobre una materia/temas academicos, vas a responder con un $.
        En cambio si el texto es valido, vas a devolver 10 preguntas o consignas teoricas en base a lo que extraigas del material, NO DEBES ESCRIBIR NADA MAS QUE LAS PREGUNTAS, UNA DEBAJO DE LA OTRA, esto quiere decir que no vas escribir ni un titulo, ni una descripcion, ni nada. Tu respuesta va a tener exactamente el siguiente formato:
        1-"PREGUNTA/CONSIGNA"
        2-"PREGUNTA/CONSIGNA"
        3-"PREGUNTA/CONSIGNA"
        4-"PREGUNTA/CONSIGNA"

        hasta llegar a 10, NO MAS DE 10

        Por ejemplo, supongamos que el pdf trata sobre "analisis matematico, limites" tu respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO): 
        1- ¿Qué es un límite en matemáticas y cómo se denota?
        2- Explica la diferencia entre un límite finito y un límite infinito.
        3- ¿Qué significa que una función tenga un límite en un punto?
        4- ¿Cuál es la importancia de los límites en el cálculo diferencial e integral?

        y asi hasta llegar a 10, NO MAS DE 10.
        
        (aclaracion: En caso de que el pdf que recibiste tiene simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");

        return NextResponse.json({ respuesta: lines, error: false });
      }
    } else if (modalidad == "Multiple choice") {
      const prompt = `
      PDF:{${pdfText}}
      ACLARACIONES:
        LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
        ***IMPORTANTE*** 
        Estas son las aclaraciones de como debes responder:
        Vas a recibir una texto que representa un pdf sobre la materia y/o los temas sobre los que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
        ***MUY IMPORTANTE***
        Si el texto que recibes no parece ser sobre una materia/temas academicos, vas a responder con un $.
        En cambio si el pdf es valido, vas a devolver 10 preguntas/consignas basandote en el material del pdf que **pueden ser respondidas en formato multiple choice, es decir, las respuestas a estas preguntas van a ser cortas y concisas** y debajo de cada pregunta sus respectivas 4 respuestas, la primera de estas respuestas va a ser la correcta, y el resto deben ser INCORRECTAS pero no evidentemente incorrectas (EL HECHO DE QUE SEA INCORRECTA NO SIGNIFICA QUE DEBAS RESPONDER ALGO ABSURDO), es decir, debe ser dificil darse cuenta cual es la correcta, pero debe haber si o si una correcta (la primera). Por ejemplo, supongamos que el pdf trata sobre "analisis matematico, limites" la respuesta deberia tener el siguiente formato (OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
  
        ¿Qué representa el concepto de límite en el contexto del análisis matemático?
        El valor hacia el cual tiende una función cuando la variable independiente se acerca a un cierto valor o se mueve hacia el infinito.
        Es la suma de los valores máximos y mínimos de una función en un intervalo dado.
        Es el valor absoluto más grande que puede tener una función.
        Es el punto donde una función deja de existir.

        ¿Cuál es la definición formal de límite de una función f(x) cuando x tiende a un valor c?
        Lim x->c f(x)= L si y solo si para cada ε>0, existe un δ>0 tal que si 0<|x-c|<δ, entonces |f(x)-L|<ε.
        El límite es el valor de f(x) cuando x se aproxima a c.
        El límite es la intersección de la función con el eje x.
        El límite es la pendiente de la recta tangente a la función en el punto c.

        ¿Cuál particularidad tiene la regla de l'hopital?
        Permite calcular limites de funciones racionales a partir de derivadas.
        La regla de L'Hôpital establece que el límite de una función es igual a la derivada de la función.
        La regla de L'Hôpital es aplicable solo a funciones exponenciales.
        Se utiliza para evaluar límites cuando el denominador de la función tiende a cero.

        ¿Qué enunciado describe el concepto de límite lateral?
        Teorema del Límite Fundamental para Funciones Racionales.
        Teorema del Límite de la Pendiente.
        Teorema de la Integral Definida.
        Teorema del Valor Intermedio.

        y asi hasta llegar a 10, NO MAS DE 10

        (LA RESPUESTA CORRECTA NO DEBE ESTAR REMARCADA POR NINGUNA SINTAXIS DISTINTA AL RESTO DE PREGUNTAS Y DEBE SER SIEMPRE LA PRIMERA DE LAS 4, SIN IMPORTAR NADA)
        (ES MUY IMPORTANTE QUE RESPETAS AL PIE DE LA LETRA EL FORMATO ANTERIOR DE RESPUESTA, YA QUE DE ESO DEPENDE EL FUNCIONAMIENTO CORRECTO DEL ALGORITMO, SI HAY UN SALTO DE LINEA MAS O MENOS, O UN RENGLON DE MAS, QUE NO ES NECESARIO, EL ALGORITMO VA A FALLAR)
        (aclaracion: En caso de que el pdf que recibiste tiene simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        let finalRes = [];
        let c = 0;
        let opt = [];
        let quest = "";
        for (const l of lines) {
          if (c == 4) {
            opt.push(l);
            finalRes.push({ q: quest, opciones: opt });
            opt = [];
            c++;
          } else if(c == 5){
            c = 0;
          } else if (c == 0) {
            c++;
            quest = l;
          } else {
            c++;
            opt.push(l);
          }
        }
        return NextResponse.json({
          respuesta: finalRes,
          error: false
        });
      }
    } else if (modalidad == "Verdadero o falso") {
      const prompt = `
      PDF:{${pdfText}}
      ACLARACIONES:
        LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
        ***IMPORTANTE*** 
        Estas son las aclaraciones de como debes responder:
        Vas a recibir una texto que representa un pdf sobre la materia y/o los temas sobre los que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
        ***MUY IMPORTANTE***
        Si el texto que recibes no parece ser sobre una materia/temas academicos, vas a responder con un $.
        En cambio el pdf es valido, vas a devolver 10 afirmaciones que se puedan responder con verdadero o falso sobre el/los temas de los que trata el pdf, al final de cada afirmacion debes escribir una V o una F dependiendo de si la respuesta es verdadero o falso. Por ejemplo, supongamos que el pdf trata de "analisis matematico, limites" la respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO): 
  
        Si una función tiene un límite finito en un punto, entonces la función debe ser continua en ese punto. V
        Si el límite de una función tiende a infinito, entonces la función debe ser creciente en un intervalo alrededor de ese punto. F
        Si el límite de una función cuando x tiende a cero es cero, entonces la función debe cruzar el eje x en x=0. F
        Si una función tiene un límite en el infinito, entonces la función debe ser acotada. F
      
        y asi hasta llegar a 10, NO MAS DE 10

        (aclaracion: En caso de que el pdf que recibiste tiene simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");

        const resFinal = [];
        for (const i of lines) {
          resFinal.push({
            afirmacion: i.substring(0, i.length - 1),
            vf: i.at(-1),
          });
        }

        return NextResponse.json({ respuesta: resFinal, error: false });
      }
    } else {
      return NextResponse.json({ respuesta: [], error: false });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
