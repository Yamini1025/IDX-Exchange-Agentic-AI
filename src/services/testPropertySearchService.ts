import { searchProperties } from "./propertySearchService";
import { closePool } from "../db/connection";

async function main() {
  try {
    const results = await searchProperties(
      "3 bedroom condo in Irvine under $1.5m with pool"
    );

    console.log(`Found ${results.length} properties`);
    results.forEach((property) => console.log("\n" + property));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();