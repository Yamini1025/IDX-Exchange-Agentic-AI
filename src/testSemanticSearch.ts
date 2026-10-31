import {
  semanticPropertySearch,
  closeEmbeddingPool,
} from "./services/propertyEmbeddings";

async function main() {
  try {
    const results = await semanticPropertySearch(
      "charming craftsman home with mountain views and character",
      5,
    );

    console.log("\nSemantic Search Results:");
    console.table(
      results.map((result) => ({
        listing_id: result.listing_id,
        city: result.city,
        property_type: result.property_type,
        price: result.price,
        similarity: result.similarity.toFixed(4),
        description: result.remarks.slice(0, 100),
      })),
    );
  } finally {
    await closeEmbeddingPool();
  }
}

main().catch(console.error);