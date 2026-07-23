import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY is not set. AI features will fail until you add it to .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiModel = () =>
  genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

/**
 * Sends a prompt to Gemini and safely parses a JSON response.
 * We instruct the model to return ONLY JSON, then strip any
 * accidental markdown code fences before parsing.
 */
export const generateJSON = async (prompt) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini JSON response:", cleaned);
    throw new Error("AI response could not be parsed. Please try again.");
  }
};

export default genAI;
