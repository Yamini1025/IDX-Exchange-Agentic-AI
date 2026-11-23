import fs from "fs";
import path from "path";
import { indexDocument } from "./services/ragService";
import { closePool } from "./db/connection";
import { closeEmbeddingPool } from "./services/propertyEmbeddings";

async function main() {
  const docsDir = path.join(process.cwd(), "docs", "rag");
  const files = fs.readdirSync(docsDir).filter((file) => file.endsWith(".md"));

  try {
    for (const file of files) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      await indexDocument(file, content);
    }

    console.log("All RAG documents indexed successfully.");
  } finally {
    await closePool();
    await closeEmbeddingPool();
  }
}

main().catch(console.error);