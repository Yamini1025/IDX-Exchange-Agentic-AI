import { query, closePool } from "./db/connection";
import { getPropertyRecommendations } from "./services/recommendationEngine";
import { closeEmbeddingPool } from "./services/propertyEmbeddings";

async function main() {
  try {
    const listings = await query<{ listing_id: string }>(
      `
        SELECT e.listing_id
        FROM property_embeddings e
        JOIN rets_property p
          ON p.L_ListingID = e.listing_id
        WHERE p.L_Status = 'Active'
        LIMIT 1
      `,
    );

    if (listings.length === 0) {
      throw new Error("No active listings with embeddings found.");
    }

    const listingId = listings[0]!.listing_id;

    console.log("Testing recommendations for:", listingId);

    const result = await getPropertyRecommendations(listingId, 5);

    console.log(JSON.stringify(result, null, 2));
  } finally {
    await closePool();
    await closeEmbeddingPool();
  }
}

main().catch(console.error);