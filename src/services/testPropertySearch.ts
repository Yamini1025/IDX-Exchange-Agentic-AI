import { searchActiveListings } from "./propertySearch";
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

    console.log(`Found ${listings.length} matching listings`);

    for (const listing of listings) {
      console.log({
        address: listing.L_Address,
        city: listing.L_City,
        price: listing.price,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        type: listing.type,
      });
    }
  } catch (error) {
    console.error("Property search failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();
