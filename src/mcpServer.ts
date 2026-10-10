
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import "dotenv/config";

import { searchProperties } from "./services/propertySearchService";
import { getSoldComps } from "./services/soldComps";
import { closePool } from "./db/connection";

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
      const results = await searchProperties(query);

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