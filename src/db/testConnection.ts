import { query, closePool } from "./connection";

async function main() {
  try {
    const databases = await query<{ db: string }>(
      "SELECT DATABASE() AS db"
    );
    console.log("Connected to database:", databases[0]?.db);

    const active = await query<{ total: number }>(
      "SELECT COUNT(*) AS total FROM rets_property"
    );
    console.log("Active listing table rows:", active[0]?.total);

    const sold = await query<{ total: number }>(
      "SELECT COUNT(*) AS total FROM california_sold"
    );
    console.log("Sold table rows:", sold[0]?.total);
  } catch (error) {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

main();
