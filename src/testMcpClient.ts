
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const client = new Client({
    name: "idx-test-client",
    version: "1.0.0",
  });

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/mcpServer.ts"],
    cwd: process.cwd(),
  });

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name);

    console.log("Available tools:", toolNames);

    const expectedTools = [
      "search_properties",
      "search_sold_comps",
      "get_city_market_summary",
      "get_city_price_trend",
    ];

    for (const name of expectedTools) {
      if (!toolNames.includes(name)) {
        throw new Error(`Expected MCP tool not registered: ${name}`);
      }
    }

    console.log("\nAll four expected tools are registered.");

    console.log("\nTesting city market summary...");
    const summary = await client.callTool({
      name: "get_city_market_summary",
      arguments: { city: "Pasadena" },
    });
    console.log(JSON.stringify(summary, null, 2));

    console.log("\nTesting city price trend...");
    const trend = await client.callTool({
      name: "get_city_price_trend",
      arguments: { city: "Pasadena", months: 12 },
    });
    console.log(JSON.stringify(trend, null, 2));

  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("MCP client test failed:", error);
  process.exitCode = 1;
});
