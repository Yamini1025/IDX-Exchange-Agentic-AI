import { getSoldComps } from "./soldComps";
import { closePool } from "../db/connection";

async function main() {
  try {
    const results = await getSoldComps("Irvine");
    console.log(`Found ${results.length} sold comps`);
    console.log(results.slice(0, 3));
  } catch (error) {
    console.error("Sold comps test failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();