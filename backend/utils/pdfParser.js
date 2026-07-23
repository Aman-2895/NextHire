import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extracts plain text from a resume PDF buffer.
 * @param {Buffer} buffer - raw PDF file buffer from multer memoryStorage
 * @returns {Promise<string>} extracted, cleaned text
 */
export const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
};
