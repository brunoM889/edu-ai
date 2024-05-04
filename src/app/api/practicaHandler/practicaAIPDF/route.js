import { NextResponse } from "next/server";
import model from "@/libs/ai";
import PdfParse from "pdf-parse";

export async function POST(req) {
  const res = await req.formData();
  const pdfBuffer = await res.get("file").arrayBuffer();
  const modalidad = await res.get("modalidad");
  let fragmentos = [];
  const data = await PdfParse(pdfBuffer);
  const pdfText = data.text;
  let tipoDeProceso = 0;

  if (data.numpages > 100) {
    tipoDeProceso = -1;
  } else if (data.numpages <= 3) {
    tipoDeProceso = -1;
  } else if (data.numpages >= 80) {
    tipoDeProceso = 10;
    const chars = data.text.length / tipoDeProceso;
    for (let i = 0; i < tipoDeProceso; i++) {
      fragmentos.push(pdfText.slice(i * chars, chars + i * chars));
    }
  } else if (data.numpages >= 30) {
    tipoDeProceso = 5;
    const chars = data.text.length / tipoDeProceso;
    for (let i = 0; i < tipoDeProceso; i++) {
      fragmentos.push(pdfText.slice(i * chars, chars + i * chars));
    }
  } else if (data.numpages >= 20) {
    tipoDeProceso = 2;
    const chars = data.text.length / tipoDeProceso;
    for (let i = 0; i < tipoDeProceso; i++) {
      fragmentos.push(pdfText.slice(i * chars, chars + i * chars));
    }
  }

  try {
    if (tipoDeProceso == 0) {
      if (modalidad == "Flash cards") {
        let prompt = `
        PDF:{${pdfText}}
        ACLARACIONES:
          LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
          ***IMPORTANTE*** 
          Estas son las aclaraciones de como debes responder:
          Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS 
          ***MUY IMPORTANTE***
          Si el texto que recibes no parece ser sobre temas academicos, vas a responder con un $.
          En cambio si el texto es valido, vas a devolver 10 flash cards relacionadas con el pdf proveido. El formato es el siguiente 
          Nombre del concepto o algo que haga alucion a la respuesta
          Descripcion/explicacion breve del concepto
          ...
  
          Por ejemplo, supongamos que el pdf trata sobre "analisis matematico, limites" tu respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
  
          Definición de límite
          El valor que una función se aproxima a medida que la variable independiente se acerca a cierto valor o infinito

          Propiedad de suma de límites
          El límite de la suma de dos funciones es la suma de los límites de esas funciones individuales

          Propiedad de producto de límites
          El límite del producto de dos funciones es el producto de los límites de esas funciones individuales
  
          y asi hasta llegar a 10, NO MAS DE 10.
        
          (NO DEBES ASIGNARLE NUMEROS A LAS FLASHCARDS)
          (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
          `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text[0] == "$") {
          return NextResponse.json({ error: true });
        } else {
          //console.log(text);
          const lines = text.split("\n");
          const resFinal = [];
          let toAppend = { front: null, back: null };
          for (const i of lines) {
            if (i != "" && i != " ") {
              if (toAppend.front) {
                toAppend.back = i;
                resFinal.push(toAppend);
                toAppend = { front: null, back: null };
              } else {
                toAppend.front = i;
              }
            }
          }

          console.log(resFinal);
          return NextResponse.json({ respuesta: resFinal, error: false });
        }
      } else if (modalidad == "Preguntas y respuestas") {
        let prompt = `
        PDF:{${pdfText}}
        ACLARACIONES:
          LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
          ***IMPORTANTE*** 
          Estas son las aclaraciones de como debes responder:
          Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
          ***MUY IMPORTANTE***
          Si el texto que recibes no parece ser sobre temas academicos, vas a responder con un $.
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
          
          (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
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
        let prompt = `
          PDF:{${pdfText}}
          ACLARACIONES:
            LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
            ***IMPORTANTE*** 
            Estas son las aclaraciones de como debes responder:
            Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
            ***MUY IMPORTANTE***
            Si el texto que recibes no parece ser sobre temas academicos, vas a responder con un $.
            En cambio si el pdf es valido, vas a devolver 10 preguntas/consignas  pura y exclusivamente en el material del pdf que **pueden ser respondidas en formato multiple choice, es decir, las respuestas a estas preguntas van a ser relativamente cortas** y debajo de cada pregunta 4 respuestas posibles, la respuesta correcta va a estar marcada con un "*", y el resto deben ser INCORRECTAS pero (EL HECHO DE QUE SEA INCORRECTA NO SIGNIFICA QUE DEBAS RESPONDER ALGO ABSURDO). Por ejemplo, supongamos que el pdf trata sobre "analisis matematico, limites" la respuesta deberia tener exactamente el siguiente formato, ni un renglon mas ni uno menos (OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
      
            1. ¿Qué representa el concepto de límite en el contexto del análisis matemático?
            Es la suma de los valores máximos y mínimos de una función en un intervalo dado.
            *El valor hacia el cual tiende una función cuando la variable independiente se acerca a un cierto valor o se mueve hacia el infinito.
            Es el valor absoluto más grande que puede tener una función.
            Es el punto donde una función deja de existir.
  
            2. ¿Cuál es la definición formal de límite de una función f(x) cuando x tiende a un valor c?
            El límite es el valor de f(x) cuando x se aproxima a c.
            El límite es la intersección de la función con el eje x.
            *Lim x->c f(x)= L si y solo si para cada ε>0, existe un δ>0 tal que si 0<|x-c|<δ, entonces |f(x)-L|<ε.
            El límite es la pendiente de la recta tangente a la función en el punto c.
  
            3. ¿Cuál particularidad tiene la regla de l'hopital?
            *Permite calcular limites de funciones racionales a partir de derivadas.
            La regla de L'Hôpital establece que el límite de una función es igual a la derivada de la función.
            La regla de L'Hôpital es aplicable solo a funciones exponenciales.
            Se utiliza para evaluar límites cuando el denominador de la función tiende a cero.
  
            4. ¿Qué enunciado describe el concepto de límite lateral?
            Teorema del Límite de la Pendiente.
            Teorema de la Integral Definida.
            Teorema del Valor Intermedio.
            *Teorema del Límite Fundamental para Funciones Racionales.
  
            y asi hasta llegar a 10, NO MAS DE 10

            **********SOLO PUEDE HABER UNA CORRECTA**********
            
            (NO DEBES ESCRIBIR NADA MAS QUE LAS PREGUNTAS Y SUS RESPUESTAS, ni un titulo, ni ningun renglon ademas de las preguntas y las respuestas)
            (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
          `;

        let result = await model.generateContent(prompt);
        let response = await result.response;
        let text = response.text();
        console.log(text);

        if (text[0] == "$") {
          return NextResponse.json({ error: true });
        } else {
          let lines = text.split("\n");
          for (const l of lines) {
            if (l.includes("?") || l.includes("¿") || l.includes("1.")) {
              break;
            } else {
              lines.splice(lines.indexOf(l), 1);
            }
          }
          for (const i of lines) {
            if (i == " " || i == "") {
              lines.splice(lines.indexOf(i), 1);
            }
          }
          let finalRes = [];
          let c = 0;
          let opt = [];
          let quest = "";
          for (const l of lines) {
            if (c == 4) {
              opt.push(l);
              finalRes.push({ q: quest, opciones: opt });
              opt = [];
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
            error: false,
          });
        }
      } else if (modalidad == "Verdadero o falso") {
        let prompt = `
        PDF:{${pdfText}}
        ACLARACIONES:
          LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
          ***IMPORTANTE*** 
          Estas son las aclaraciones de como debes responder:
          Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
          ***MUY IMPORTANTE***
          Si el texto que recibes no parece ser sobre temas academicos, vas a responder con un $.
          En cambio el pdf es valido, vas a devolver 10 afirmaciones que se puedan responder con verdadero o falso sobre el/los temas de los que trata el pdf, al final de cada afirmacion debes escribir una V o una F dependiendo de si la respuesta es verdadero o falso. Por ejemplo, supongamos que el pdf trata de "analisis matematico, limites" la respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO): 
    
          Si una función tiene un límite finito en un punto, entonces la función debe ser continua en ese punto. V
          Si el límite de una función tiende a infinito, entonces la función debe ser creciente en un intervalo alrededor de ese punto. F
          Si el límite de una función cuando x tiende a cero es cero, entonces la función debe cruzar el eje x en x=0. F
          Si una función tiene un límite en el infinito, entonces la función debe ser acotada. F
        
          y asi hasta llegar a 10, NO MAS DE 10
  
          (aclaracion: NO PUEDEN SER TODAS VERDADERAS O TODAS FALSAS)
          (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
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
      } else if (modalidad == "Acierta la palabra") {
        const prompt = `
        PDF:{${pdfText}}
        ACLARACIONES: 
          LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
          ***IMPORTANTE*** 
          Estas son las aclaraciones de como debes responder:
          Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS. 
          ***MUY IMPORTANTE***
          Si el pdf es coherente, vas a devolver 10 PALABRAS INDIVIDUALES de no mas de 12 letras cada una, relacionadas al material que se te provee y debajo de cada palabra, un texto relativamente corto que haga referencia a la palabra, el texto debe permitir a la persona que lo lee descifrar la palabra sin conocer la palabra.

          Por ejemplo, supongamos que el pdf trata de "analisis matematico" la respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
    
          Limite
          Cuando nos acercamos cada vez más a un valor específico en una función, nos acercamos al concepto de esta herramienta fundamental en el cálculo.
          Deriva
          En el estudio del cambio instantáneo, esta operación nos permite calcular la tasa de cambio de una función en un punto dado.
          Integral
          Al sumar infinitesimalmente pequeñas áreas bajo una curva, llegamos a este concepto central en el cálculo que representa la acumulación de cantidades.
          Funcion
          Una relación matemática que asigna a cada elemento de un conjunto de entrada exactamente uno de un conjunto de salida.

          y asi hasta llegar a 10, NO MAS DE 10

          (LAS PALABRAS NO DEBEN ESTAR NUMERADAS Y NO PUEDEN TENER MAS DE 8 LETRAS, NO PUEDEN SER DOS PALABRAS EN UNA MISMA CONSIGNA, NI TAMPOCO DEBEN TENER CARACTERES ACENTUADOS NI SIGNOS DE PUNTUACION Y DEBEN ESTAR TODAS EN MINISCULAS)
          (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
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
          let palabra = null;
          let referencia = null;
          for (const i of lines) {
            if (i != "" || i != " " || i != "\n") {
              if (palabra) {
                referencia = i;
                resFinal.push({ palabra: palabra, referencia: referencia });
                referencia = null;
                palabra = null;
              } else {
                palabra = i;
              }
            }
          }

          for (const i of resFinal) {
            if (i.palabra.includes(" ") && i.palabra.length > 10) {
              return NextResponse.json({ error: true });
            } else {
              if (i.referencia.includes(i.palabra)) {
                let asteriscos = "";
                for (const a of i.palabra) {
                  asteriscos += "*";
                }
                i.referencia = i.referencia.replace(i.palabra, asteriscos);
              }
            }
          }
          console.log(resFinal);

          return NextResponse.json({ respuesta: resFinal, error: false });
        }
      } else {
        return NextResponse.json({ respuesta: [], error: false });
      }
    } else if (tipoDeProceso == -1) {
      return NextResponse.json({ error: true });
    } else {
      if (modalidad == "Flash cards") {
        let toSend = [];

        const getResponse = async (x) => {
          const prompt = `
            FRAGMENTO:${x}
            ACLARACIONES:
              LOS "*" se representan enfasis en determinadas partes del prompt. 
              ***IMPORTANTE*** 
              Estas son las aclaraciones de como debes responder:
              Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LA SIGUIENTE FORMA
              ***MUY IMPORTANTE***
              Vas a devolver ${
                10 / tipoDeProceso
              } flash card basadas en el contenido del fragmento proveido. El formato es el siguiente, en un renglon el nombre del concepto o algo que haga alucion a la respuesta y justo en el siguiente renglon, una descripcion o explicacion breve del concepto. No debe haber nada mas que eso, una flashcard debajo de la otra, sin numeraciones ni titulos ni caracteres para hacer enfasis.

              Nombre del concepto o algo que haga alucion a la respuesta
              Descripcion/explicacion breve del concepto 
              ...
              
              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }

              Por ejemplo, supongamos que el fragmento trata sobre "analisis matematico, definicion de limite y propiedad de la suma de limites" tu respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL FRAGMENTO, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):

              Definición de límite
              El valor que una función se aproxima a medida que la variable independiente se acerca a cierto valor o infinito
              ...

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }
              (ES IMPORTANTE QUE NO LES ASIGNES NUMEROS A LAS FLASHCARDS)
              (NO ESCRIBAS MAS QUE LA PARTE FRONTAL Y TRASERA DE LA FLASHCARD, )
              (aclaracion: En caso de que el fragmento que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el fragmento, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
              (aclaracion: Si el fragmento no te proporciona suficiente informacion como para dar dos flashcards con un formato correcto, vas generarlas con contenido relacionado al tema del que trata el fragmento y no necesariamente este en el texto)
              `;

          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`----------`);
            console.log(text);
            const lines = text.split("\n");

            const resFinal = [];
            let toAppend = { front: null, back: null };
            for (const i of lines) {
              if (i != "" && i != " ") {
                if (toAppend.front) {
                  toAppend.back = i;
                  resFinal.push(toAppend);
                  toAppend = { front: null, back: null };
                } else {
                  toAppend.front = i;
                }
              }
            }
            toSend = toSend.concat(resFinal);
          } catch (error) {
            console.log(error);
            toSend.push("error");
          }
        };

        for (const f of fragmentos) {
          await getResponse(f);
          if (toSend.includes("error")) {
            break;
          }
        }

        if (toSend.length != 10) {
          toSend.push("error");
        }

        if (toSend.includes("error")) {
          return NextResponse.json({ error: true });
        } else {
          return NextResponse.json({ respuesta: toSend, error: false });
        }
      } else if (modalidad == "Preguntas y respuestas") {
        let toSend = [];
        const getResponse = async (x) => {
          const prompt = `
            FRAGMENTO:${x}
            ACLARACIONES:
              LOS "*" se representan enfasis en determinadas partes del prompt. 
              ***IMPORTANTE*** 
              Estas son las aclaraciones de como debes responder:
              Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LA SIGUIENTE FORMA. 
              ***MUY IMPORTANTE***
              Vas a devolver ${
                10 / tipoDeProceso
              } preguntas o consignas teoricas en base a lo que extraigas del fragmento, NO DEBES ESCRIBIR NADA MAS QUE LAS PREGUNTAS, UNA DEBAJO DE LA OTRA, esto quiere decir que no vas escribir ni un titulo, ni una descripcion, ni nada. Tu respuesta va a tener exactamente el siguiente formato:
              "PREGUNTA/CONSIGNA"
              ...

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }
      
              Por ejemplo, supongamos que el fragmento trata sobre "analisis matematico, limites" tu respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL FRAGMENTO, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO): 
              ¿Qué es un límite en matemáticas y cómo se denota?
              ...

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }
              (ES IMPORTANTE QUE NO LES ASIGNES NUMEROS A LAS PREGUNTAS)
              (aclaracion: En caso de que el fragmento que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el fragmento, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
              (aclaracion: Si el fragmento no te proporciona suficiente informacion como para dar dos consignas/preguntas con un formato correcto, vas generarlas con contenido relacionado al tema del que trata el fragmento y no necesariamente este en el texto)
              `;

          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`----------`);
            console.log(text);
            const lines = text.split("\n");
            toSend = toSend.concat(lines);
          } catch (error) {
            console.log(error);
            toSend.push("error");
          }
        };

        for (const f of fragmentos) {
          await getResponse(f);
          if (toSend.includes("error")) {
            break;
          }
        }

        if (toSend.includes("error")) {
          return NextResponse.json({ error: true });
        } else {
          return NextResponse.json({ respuesta: toSend, error: false });
        }
      } else if (modalidad == "Multiple choice") {
        let toSend = [];
        const getResponse = async (x) => {
          const prompt = `
            FRAGMENTO:${x}
            ACLARACIONES:
              LOS "*" se representan enfasis en determinadas partes del prompt. 
              ***IMPORTANTE*** 
              Estas son las aclaraciones de como debes responder:
              Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LA SIGUIENTE FORMA. 
              ***MUY IMPORTANTE***
              Vas a devolver ${
                10 / tipoDeProceso
              } preguntas/consignas basandote pura y exclusivamente en el material del fragmento que **pueden ser respondidas en formato multiple choice, es decir, las respuestas a estas preguntas van a ser relativamente cortas** y debajo de cada pregunta 4 respuestas posibles, la respuesta correcta va a estar marcada con un "*", y el resto deben ser INCORRECTAS pero (EL HECHO DE QUE SEA INCORRECTA NO SIGNIFICA QUE DEBAS RESPONDER ALGO ABSURDO). Por ejemplo, supongamos que el fragmento trata sobre "analisis matematico, limites" la respuesta deberia tener exactamente el siguiente formato, ni un renglon mas ni uno menos (OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL FRAGMENTO, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
        
              ¿Qué representa el concepto de límite en el contexto del análisis matemático?
              Es la suma de los valores máximos y mínimos de una función en un intervalo dado.
              *El valor hacia el cual tiende una función cuando la variable independiente se acerca a un cierto valor o se mueve hacia el infinito.
              Es el valor absoluto más grande que puede tener una función.
              Es el punto donde una función deja de existir.

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }

              **********SOLO PUEDE HABER UNA CORRECTA**********

              (NO DEBES ESCRIBIR NADA MAS QUE LAS PREGUNTAS Y SUS RESPUESTAS, ni un titulo, ni ningun renglon ademas de las preguntas y las respuestas)
              (ES IMPORTANTE QUE NO LES ASIGNES NUMEROS A LAS PREGUNTAS)
              (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el fragmento, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
              (aclaracion: Si el fragmento no te proporciona suficiente informacion como para dar dos preguntas con sus cuatro posibles soluciones y un formato correcto, vas generarlas con contenido relacionado al tema del que trata el fragmento y no necesariamente este en el texto)
            `;

          try {
            let result = await model.generateContent(prompt);
            let response = await result.response;
            let text = response.text();
            console.log(`----------`);
            console.log(text);
            let lines = text.split("\n");
            for (const i of lines) {
              if (i == " " || i == "") {
                lines.splice(lines.indexOf(i), 1);
              }
            }
            let c = 0;
            let opt = [];
            let quest = "";
            for (const l of lines) {
              if (c == 4) {
                opt.push(l);
                toSend.push({ q: quest, opciones: opt });
                opt = [];
                c = 0;
              } else if (c == 0) {
                c++;
                quest = l;
              } else {
                c++;
                opt.push(l);
              }
            }
          } catch (error) {
            console.log(error);
            toSend.push("error");
          }
        };

        for (const f of fragmentos) {
          await getResponse(f);
          if (toSend.includes("error")) {
            break;
          }
        }

        if (toSend.includes("error")) {
          return NextResponse.json({ error: true });
        } else {
          return NextResponse.json({
            respuesta: toSend,
            error: false,
          });
        }
      } else if (modalidad == "Verdadero o falso") {
        let toSend = [];
        const getResponse = async (x) => {
          const prompt = `
            FRAGMENTO:${x}
            ACLARACIONES:
              LOS "*" se representan enfasis en determinadas partes del prompt. 
              ***IMPORTANTE*** 
              Estas son las aclaraciones de como debes responder:
              Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LA SIGUIENTE FORMA. 
              ***MUY IMPORTANTE***
              Vas a devolver ${
                10 / tipoDeProceso
              } afirmaciones que se puedan responder con verdadero o falso basandote pura y exclusivamente en el material del fragmento, al final de cada afirmacion debes escribir una V o una F dependiendo de si la afirmacion es verdadera o falsa. Por ejemplo, supongamos que el fragmento trata de "analisis matematico, limites, continuidad en un punto" la respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL FRAGMENTO, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO): 
        
              -Si una función tiene un límite finito en un punto, entonces la función debe ser continua en ese punto. V
              ...

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }
              (ES IMPORTANTE QUE NO LES ASIGNES NUMEROS A LAS AFIRMACIONES)
              (aclaracion: NO PUEDEN SER TODAS VERDADERAS O TODAS FALSAS)
              (aclaracion: En caso de que el fragmento que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el fragmento, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
              
              `;

          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`----------`);
            console.log(text);
            const lines = text.split("\n");

            for (const i of lines) {
              toSend.push({
                afirmacion: i.substring(0, i.length - 1),
                vf: i.at(-1),
              });
            }
          } catch (error) {
            console.log(error);
            toSend.push("error");
          }
        };

        for (const f of fragmentos) {
          await getResponse(f);
          if (toSend.includes("error")) {
            break;
          }
        }

        if (toSend.includes("error")) {
          return NextResponse.json({ error: true });
        } else {
          return NextResponse.json({ respuesta: toSend, error: false });
        }
      } else if (modalidad == "Acierta la palabra") {
        let toSend = [];
        const getResponse = async (x) => {
          const prompt = `
            FRAGMENTO:{${x}}
            ACLARACIONES: 
              LOS "*" se representan que una parte del enfasis en determinadas partes del prompt. 
              ***IMPORTANTE*** 
              Estas son las aclaraciones de como debes responder:
              Vas a recibir un texto que representa un fragmento de pdf sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LA SIGUIENTE FORMA. 
              ***MUY IMPORTANTE***
              Vas a devolver ${
                10 / tipoDeProceso
              } PALABRAS INDIVIDUALES de no mas de 12 letras en lo posible cada una, relacionadas al material que se te provee y debajo de cada palabra, un texto relativamente corto que haga referencia a la palabra para que el usuario pueda adivinar la palabra reflexionando sobre ese texto.
              Por ejemplo, supongamos que el pdf trata de "analisis matematico" la respuesta deberia tener el siguiente formato(OBVIAMENTE LAS CONSIGNAS QUE TIENES QUE DEVOLVER DEBEN ESTAR BASADAS EN EL MATERIAL DEL PDF, ESTE ES SOLO UN EJEMPLO, NO DEBES DEVOLVER NADA RELACIONADO AL SIGUIENTE EJEMPLO):
        
              Limite
              Cuando nos acercamos cada vez más a un valor específico en una función, nos acercamos al concepto de esta herramienta fundamental en el cálculo.

              Y así hasta llegar a ${10 / tipoDeProceso}, no mas que ${
            10 / tipoDeProceso
          }

              (LAS PALABRAS NO DEBEN ESTAR NUMERADAS Y EN LO POSIBLE DEBEN TENER MENOS DE 12 LETRAS NI TAMPOCO DEBEN TENER CARACTERES ACENTUADOS NI SIGNOS DE PUNTUACION Y DEBEN ESTAR TODAS EN MINISCULAS)
              (aclaracion: En caso de que el pdf que recibiste tenga simbolos fuera de lo comun, o una sintaxis que no parece ser natural, vas a reinterpretar el texto, y en tu respuesta no vas a escribir literalmente lo que diga en el apunte, es decir, las partes que tienen esta sintaxis fuera de lo comun las vas a escribir con una sintaxis mas clara)
            `;
          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`----------`);
            console.log(text);
            const lines = text.split("\n");
            const resFinal = [];
            let palabra = null;
            let referencia = null;
            for (const i of lines) {
              if (i != "" || i != " " || i != "\n") {
                if (palabra) {
                  referencia = i;
                  resFinal.push({ palabra: palabra, referencia: referencia });
                  referencia = null;
                  palabra = null;
                } else {
                  palabra = i;
                }
              }
            }

            if (resFinal.length != 10 / tipoDeProceso) {
              toSend.push("error");
            } else {
              for (const i of resFinal) {
                if (i.palabra.includes(" ") && i.palabra.length > 10) {
                  toSend.push("error");
                } else {
                  if (i.referencia.includes(i.palabra)) {
                    let asteriscos = "";
                    for (const a of i.palabra) {
                      asteriscos += "*";
                    }
                    i.referencia = i.referencia.replace(i.palabra, asteriscos);
                    toSend.push(i);
                  } else {
                    toSend.push(i);
                  }
                }
              }
              console.log(resFinal);
            }
          } catch (e) {
            console.log(e);
            toSend.push("error");
          }
        };
        for (const f of fragmentos) {
          await getResponse(f);
          if (toSend.includes("error")) {
            break;
          }
        }

        if (toSend.includes("error")) {
          return NextResponse.json({ error: true });
        } else {
          return NextResponse.json({ respuesta: toSend, error: false });
        }
      } else {
        return NextResponse.json({ respuesta: [], error: false });
      }
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
