import {
  generatePropertyEmbeddings,
  closeEmbeddingPool,
} from "./services/propertyEmbeddings";

async function main() {
  try {
    await generatePropertyEmbeddings(5, 1);
  } finally {
    await closeEmbeddingPool();
  }
}

main().catch(console.error);