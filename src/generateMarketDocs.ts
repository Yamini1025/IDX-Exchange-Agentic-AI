import fs from "fs";
import path from "path";
import {
  getCityMarketSummary,
  getCityPriceTrend,
} from "./services/marketAnalytics";

const cities = ["San Jose", "Los Angeles", "San Diego"];

async function generateMarketDocs() {
  for (const city of cities) {
    const summary = await getCityMarketSummary(city);
    const trends = await getCityPriceTrend(city);

    if (!summary) {
      console.log(`No market data found for ${city}`);
      continue;
    }

    const content = `
# ${city} Real Estate Market Summary

## Market Overview

${JSON.stringify(summary, null, 2)}

## Monthly Price Trends

${JSON.stringify(trends, null, 2)}

## Data Source and Limitations

Source: IDX Exchange california_sold table.
Property type: Residential.
Time period: Most recent 12 months.
Statistics reflect records available in the database.
${summary.dataCoverageNote}
`;

    const filePath = path.join(
      process.cwd(),
      "docs",
      "rag",
      `${city.toLowerCase().replace(/\s+/g, "-")}-market-summary.md`,
    );

    fs.writeFileSync(filePath, content.trim() + "\n");

    console.log(`Generated market summary: ${filePath}`);
  }
}

generateMarketDocs().catch(console.error);