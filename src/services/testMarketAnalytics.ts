import {
  getCityMarketSummary,
  getCityPriceTrend,
} from "./marketAnalytics";
import { query, closePool } from "../db/connection";

async function main() {
  try {
    const check = await query(`
      SELECT
        CURDATE() AS today,
        MIN(CloseDate) AS earliest,
        MAX(CloseDate) AS latest,
        SUM(CloseDate > CURDATE()) AS future_count
      FROM california_sold
      WHERE City = 'Pasadena'
        AND PropertyType = 'Residential'
    `);
    console.log("Date sanity check:", check);

    const version = await query("SELECT VERSION() AS version");
    console.log("MySQL version:", version);

    const dates = await query(`
      SELECT
        COUNT(*) AS total,
        SUM(
          CloseDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
          AND CloseDate <= CURDATE()
        ) AS recent
      FROM california_sold
      WHERE City = 'Pasadena'
        AND PropertyType = 'Residential'
    `);
    console.log("Date filter check:", dates);

    const result = await getCityMarketSummary("Pasadena");
    console.log("Pasadena market summary:");
    console.log(result);

    const trend = await getCityPriceTrend("Pasadena", 12);
    console.log("Pasadena monthly price trend:");
    console.table(trend);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await closePool();
  }
}

main();
