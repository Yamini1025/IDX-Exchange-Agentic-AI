import { askRagQuestion } from "./services/ragService";
import { closePool } from "./db/connection";
import { closeEmbeddingPool } from "./services/propertyEmbeddings";

async function main() {
  try {
    const questions = [
      "What does DOM mean?",
      "What columns are in california_sold?",
      "What is a list-to-close ratio?",
    ];

    for (const question of questions) {
      console.log(`\nQuestion: ${question}`);
      console.log(`Answer: ${await askRagQuestion(question)}`);
    }
  } finally {
    await closePool();
    await closeEmbeddingPool();
  }
}

main().catch(console.error);