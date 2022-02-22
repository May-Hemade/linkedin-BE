import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";
import getStream from "get-stream";
export const getPDFReadableStream = async (foundProfile) => {
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
        text: `${foundProfile.name} ${foundProfile.surname}`,
        style: "header",
      },
      "\n",
      { text: striptags(foundProfile.username) },
      "\n",
      { text: striptags(foundProfile.email) },

      "\n",
      { text: striptags(foundProfile.bio) },

      "\n",
      { text: striptags(foundProfile.title) },

      "\n",
      { text: striptags(foundProfile.area) },
      {
        //...experiences
      }
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

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  return pdfReadableStream
  /* pdfReadableStream.end();
  const buffer = await getStream.buffer(pdfReadableStream);
  return asBuffer ? buffer : pdfReadableStream; */
};
