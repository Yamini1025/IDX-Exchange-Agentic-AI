import { searchActiveListings } from "./propertySearch";
import { formatListing } from "./formatProperty";
import { closePool } from "../db/connection";

async function main() {
  try {
    const listings = await searchActiveListings({
      city: "Irvine",
      maxPrice: 1_500_000,
      beds: 3,
      type: "Condominium",
      pool: "1",
    });

    for (const listing of listings) {
      console.log("\n--- PROPERTY ---");
      console.log(formatListing(listing));
    }
  } catch (error) {
    console.error("Formatting test failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();