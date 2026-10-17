
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import "dotenv/config";

import { searchProperties } from "./services/propertySearchService";
import { getSoldComps } from "./services/soldComps";
import { closePool } from "./db/connection";

import {
  getCityMarketSummary,
  getCityPriceTrend,
} from "./services/marketAnalytics";

const server = new McpServer({
  name: "idx-exchange-property-search",
  version: "1.0.0",
});

// Search active listings
server.registerTool(
  "search_properties",
  {
    description:
      "Search active real estate listings using a natural-language query.",
    inputSchema: {
      query: z.string().min(1).describe(
        "Example: 3 bedroom condo in Irvine under $1.5m with pool"
      ),
    },
  },
  async ({ query }) => {
    try {
      const results = await searchProperties("whatsapp-user", query);

      return {
        content: [
          {
            type: "text" as const,
            text: results.length
              ? results.join("\n\n---\n\n")
              : "No matching active properties found.",
          },
        ],
      };
    } catch (error) {
      console.error("Property search failed:", error);

      return {
        content: [
          {
            type: "text" as const,
            text: "Property search failed. Check server logs.",
          },
        ],
        isError: true,
      };
    }
  }
);

// Search recently sold properties
server.registerTool(
  "search_sold_comps",
  {
    description:
      "Search recently sold residential properties in a city.",
    inputSchema: {
      city: z.string().min(1).describe("City, e.g. Irvine"),
      months: z.number().int().min(1).max(120).optional().describe(
        "Number of months back to search. Defaults to 12."
      ),
    },
  },
  async ({ city, months }) => {
    try {
      const results = await getSoldComps(city.trim(), months ?? 12);

      return {
        content: [
          {
            type: "text" as const,
            text: results.length
              ? JSON.stringify(results, null, 2)
              : `No sold residential properties found in ${city}.`,
          },
        ],
      };
    } catch (error) {
      console.error("Sold comps search failed:", error);

      return {
        content: [
          {
            type: "text" as const,
            text: "Sold-property search failed. Check server logs.",
          },
        ],
        isError: true,
      };
    }
  }
);
// Get a city's market summary
server.registerTool(
  "get_city_market_summary",
  {
    description:
      "Get the last 12 months of residential market statistics for a California city, including average and median closing price, price per square foot, average days on market, and list-to-close percentage.",
    inputSchema: {
      city: z.string().trim().min(1).describe("City, e.g. Pasadena"),
    },
  },
  async ({ city }) => {
    try {
      const result = await getCityMarketSummary(city);

      return {
        content: [
          {
            type: "text" as const,
            text: result
              ? JSON.stringify(result, null, 2)
              : `No qualifying market data found for ${city}.`,
          },
        ],
      };
    } catch (error) {
      console.error("Market summary failed:", error);

      return {
        content: [
          {
            type: "text" as const,
            text: "Market summary failed. Check server logs.",
          },
        ],
        isError: true,
      };
    }
  }
);

// Get a city's monthly price trend
server.registerTool(
  "get_city_price_trend",
  {
    description:
      "Get monthly residential sales volume, average closing price, average days on market, and month-over-month average-price change for a city.",
    inputSchema: {
      city: z.string().trim().min(1).describe("City, e.g. Pasadena"),
      months: z.number().int().min(1).max(120).optional().describe(
        "Number of months back to query. Defaults to 12."
      ),
    },
  },
  async ({ city, months }) => {
    try {
      const result = await getCityPriceTrend(city, months ?? 12);

      return {
        content: [
          {
            type: "text" as const,
            text: result.length
              ? JSON.stringify(result, null, 2)
              : `No price-trend data found for ${city}.`,
          },
        ],
      };
    } catch (error) {
      console.error("Price trend failed:", error);

      return {
        content: [
          {
            type: "text" as const,
            text: "Price trend failed. Check server logs.",
          },
        ],
        isError: true,
      };
    }
  }
);
const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

async function shutdown() {
  await closePool();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((error) => {
  console.error("MCP server failed to start:", error);
  process.exit(1);
});