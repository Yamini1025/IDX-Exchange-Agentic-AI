import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import mysql from "mysql2/promise";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 5,
});

const MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

export interface Listing {
  L_ListingID: string;
  L_City: string | null;
  L_Type_: string | null;
  L_SystemPrice: number | null;
  L_Remarks: string;
  YearBuilt: number | null;
}

export function buildListingText(listing: Listing): string {
  return [
    `Property type: ${listing.L_Type_ ?? "Unknown"}`,
    `City: ${listing.L_City ?? "Unknown"}`,
    `Price: ${listing.L_SystemPrice ?? "Unknown"}`,
    `Year built: ${listing.YearBuilt ?? "Unknown"}`,
    `Description: ${listing.L_Remarks}`,
  ].join("\n");
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: MODEL,
    contents: text.slice(0, 8000),
    config: {
      outputDimensionality: DIMENSIONS,
    },
  });

  const values = result.embeddings?.[0]?.values;

  if (!values || values.length !== DIMENSIONS) {
    throw new Error("Invalid embedding returned by Gemini");
  }

  return values;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embedding dimensions do not match");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    const valueA = a[i] ?? 0;
    const valueB = b[i] ?? 0;

    dotProduct += valueA * valueB;
    magnitudeA += valueA ** 2;
    magnitudeB += valueB ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generatePropertyEmbeddings(
  batchSize = 20,
  maxBatches = 1,
): Promise<void> {
  let processed = 0;

  for (let batch = 0; batch < maxBatches; batch++) {
    const [rows] = await pool.query(
      `SELECT DISTINCT p.L_ListingID, p.L_City, p.L_Type_,
              p.L_SystemPrice, p.L_Remarks, p.YearBuilt
       FROM rets_property p
       LEFT JOIN property_embeddings e
         ON p.L_ListingID = e.listing_id
       WHERE p.L_Status = 'Active'
         AND p.L_Remarks IS NOT NULL
         AND TRIM(p.L_Remarks) != ''
         AND e.listing_id IS NULL
       ORDER BY p.L_ListingID
       LIMIT ?`,
      [batchSize],
    );

    const listings = rows as Listing[];

    if (listings.length === 0) {
      console.log("No more listings need embeddings.");
      break;
    }

    for (const listing of listings) {
      try {
        const embedding = await generateEmbedding(
          buildListingText(listing),
        );

        await pool.execute(
          `INSERT INTO property_embeddings (listing_id, embedding, model)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
             embedding = VALUES(embedding),
             model = VALUES(model)`,
          [listing.L_ListingID, JSON.stringify(embedding), MODEL],
        );

        processed++;
      } catch (error) {
        console.error(
          `Failed listing ${listing.L_ListingID}:`,
          error,
        );
      }
      await sleep(1000);
    }

    console.log(`Processed ${processed} listings so far.`);
  }
}

interface SearchResult {
  listing_id: string;
  city: string | null;
  property_type: string | null;
  price: number | null;
  remarks: string;
  similarity: number;
}

export async function semanticPropertySearch(
  query: string,
  limit = 5,
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  const [rows] = await pool.query(
    `SELECT e.listing_id, e.embedding,
            p.L_City, p.L_Type_, p.L_SystemPrice, p.L_Remarks
     FROM property_embeddings e
     JOIN rets_property p
       ON p.L_ListingID = e.listing_id
     WHERE p.L_Status = 'Active'`,
  );

  const results = (rows as any[])
    .map((row) => ({
      listing_id: row.listing_id,
      city: row.L_City,
      property_type: row.L_Type_,
      price: row.L_SystemPrice,
      remarks: row.L_Remarks,
      similarity: cosineSimilarity(
        queryEmbedding,
        typeof row.embedding === "string"
          ? JSON.parse(row.embedding)
          : row.embedding,
      ),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}

export async function closeEmbeddingPool(): Promise<void> {
  await pool.end();
}