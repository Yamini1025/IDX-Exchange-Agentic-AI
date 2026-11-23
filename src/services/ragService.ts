import { GoogleGenAI } from "@google/genai";

import { query } from "../db/connection";
import {
  generateEmbedding,
  cosineSimilarity,
} from "./propertyEmbeddings";

const MODEL = "gemini-embedding-001";
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;
const TOP_K = 4;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface RagChunk {
  id: number;
  source: string;
  chunk_index: number;
  content: string;
  embedding: number[] | string;
}

export function splitIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  const step = CHUNK_SIZE - CHUNK_OVERLAP;

  for (let start = 0; start < text.length; start += step) {
    const chunk = text.slice(start, start + CHUNK_SIZE).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

export async function indexDocument(
  source: string,
  text: string,
): Promise<void> {
  const chunks = splitIntoChunks(text);

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];

    if (!content) continue;

    const embedding = await generateEmbedding(content);

    await query(
      `INSERT INTO rag_chunks
        (source, chunk_index, content, embedding, model)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         content = VALUES(content),
         embedding = VALUES(embedding),
         model = VALUES(model)`,
      [
        source,
        i,
        content,
        JSON.stringify(embedding),
        MODEL,
      ],
    );

    console.log(`Indexed ${source}: chunk ${i + 1}/${chunks.length}`);
  }
}

export async function retrieveRelevantChunks(
  question: string,
): Promise<RagChunk[]> {
  const questionEmbedding = await generateEmbedding(question);

  const chunks = await query<RagChunk>(
    `SELECT id, source, chunk_index, content, embedding
     FROM rag_chunks`,
  );

  return chunks
    .map((chunk) => {
      const storedEmbedding =
        typeof chunk.embedding === "string"
          ? JSON.parse(chunk.embedding)
          : chunk.embedding;

      return {
        ...chunk,
        embedding: storedEmbedding,
        similarity: cosineSimilarity(
          questionEmbedding,
          storedEmbedding,
        ),
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, TOP_K);
}

export async function askRagQuestion(
  question: string,
): Promise<string> {
  const relevantChunks = await retrieveRelevantChunks(question);

  if (relevantChunks.length === 0) {
    return "I couldn't find relevant information in the indexed documents.";
  }

  const context = relevantChunks
    .map(
      (chunk, index) =>
        `[Source: ${chunk.source}, Chunk: ${chunk.chunk_index}]\n${chunk.content}`,
    )
    .join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `
You are a real estate knowledge assistant.

Answer the user's question using ONLY the information in the provided context.

Rules:
- Do not introduce outside knowledge.
- If the context does not contain the answer, say you couldn't find the information in the indexed documents.
- Do not invent MLS field definitions or statistics.
- Identify the source when possible.

Context:
${context}

Question:
${question}
`,
  });

  return response.text ??
    "I couldn't generate an answer from the indexed documents.";
}