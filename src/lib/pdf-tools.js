import PdfPrinter from "pdfmake";

import axios from "axios";
import getStream from "get-stream";
export const getPDFReadableStream = async (foundProfile, asBuffer = false) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Italics",
    },
  };

  const printer = new PdfPrinter(fonts);
  let imagePart = {};
  if (foundProfile.image) {
    const response = await axios.get(foundProfile.image, {
      responseType: "arraybuffer",
    });
    const profileURLParts = foundProfile.image.split("/");
    const fileName = profileURLParts[profileURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = {
      image: base64Image,
      width: 100,
      height: 100,
      margin: [0, 0, 0, 40],
    };
  }
  const docDefinition = {
    content: [
      imagePart,
      {
        text: foundProfile.name + ' ' + foundProfile.surname, 
        style: "header",
      },
      "\n",
      foundProfile.username,
      "\n",
      foundProfile.email,
      "\n",
      foundProfile.bio,
      "\n",
      foundProfile.title,
      "\n",
      foundProfile.area,

    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();
  const buffer = await getStream.buffer(pdfReadableStream);
  return asBuffer ? buffer : pdfReadableStream;
};
