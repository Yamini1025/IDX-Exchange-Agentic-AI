import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "A charming craftsman home in Pasadena with mountain views.",
    config: {
      outputDimensionality: 768,
    },
  });

  console.log("Embedding generated!");
  console.log("Dimensions:", result.embeddings?.[0]?.values?.length);
}

main().catch(console.error);