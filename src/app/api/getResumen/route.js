import { NextResponse } from "next/server";
import model from "@/libs/ai";
import PdfParse from "pdf-parse";

const getResumen = async (x) => {
  const toSend = `Reescribe el siguiente texto, no debes suprimir informacion, es decir, puedes resumir algunos textos pero la idea es que conserves la mayor cantidad de contenido posible y la estructura del texto anterior. Tambien tienes que tener en cuenta que estas leyendo un fragmento de algunas paginas de un texto mas extenso y tu respuesta se anexara a otros textos similares al que me vas a dar, teniendo en cuenta esto, tu respuesta debe ser coherente con ese contexto. 
  (IMPORTANTE: tu respuesta debe ser extensa y detallada)
  (aclaracion: Es importante que respondas solamente tu reinterpretacion del texto, nada mas, ni un titulo que aclare lo que vas a responder, ni una descripcion de lo que vas a responder, ni nada por el estilo, )

  (IMPORTANTE: Si el texto que se te provee tiene una sintaxis poco clara, por ejemplo de simbolos o expresiones matematicas, vas a tener que reinterpretarla y traducir esa informacion a una sintaxis mas clara par a el usuario, si ves que la sintaxis no se puede reinterpretar de una forma clara es preferible que evites esa parte del texto a que quede una respuesta poco clara o inentendible)

  (IMPORTANTE: no tienes permitido usar el siguiente caracter *)

  TEXTO: ${x}
  `;
  const result = await model.generateContent(toSend);
  const response = await result.response;
  const text = response.text();
  const lines = text.split("\n");
  return lines;
};

export async function POST(req) {
  try {
    const res = await req.formData();
    const pdfBuffer = await res.get("file").arrayBuffer();
    const pageData = await PdfParse(pdfBuffer);
    const pageText = pageData.text;
    const caracteresPorFrame =
      Math.round(pageText.length / pageData.numpages) * 2;

    const resultado = [];
    let frame = "";
    let pag = 1;
    for (const c of pageText) {
      if (frame.length < caracteresPorFrame) {
        frame += c;
      } else {
        let ls=await getResumen(frame)
        ls.push(`Sección ${pag}`)
        resultado.push(ls);
        pag+=1
        frame = "";
      }
    }
    if (frame != "") {
      let ls=await getResumen(frame)
      ls.push(`Sección ${pag}`)
      resultado.push(ls);
    }
    return NextResponse.json({ resumen: resultado, error: false });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
