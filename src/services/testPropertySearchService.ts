import { searchProperties } from "./propertySearchService";
import { closePool } from "../db/connection";import { parsePropertyQuery } from "../../skills/property-search/propertyQueryParser";
import { getSession } from "./session";


async function main() {
  console.log(
  "Budget parsing:",
  await parsePropertyQuery("Under $1.2 million")
  );

  console.log(
    "Bedroom parsing:",
    await parsePropertyQuery("At least 3 bedrooms")
  );
  try {
    console.log("Message 1: Find homes in Irvine");
    const first = await searchProperties(
      "test-user",
      "Find homes in Irvine"
    );
    console.log(first);

    console.log("\nMessage 2: Under $1.2 million");
    const second = await searchProperties(
      "test-user",
      "Under $1.2 million"
    );
    console.log(second);

    console.log("\nMessage 3: At least 3 bedrooms");
    const third = await searchProperties(
      "test-user",
      "At least 3 bedrooms"
    );
    console.log(third);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await closePool();
  }
}

main();