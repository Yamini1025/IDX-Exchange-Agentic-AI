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

  await client.connect(transport);

  const tools = await client.listTools();
  console.log("Available tools:", tools.tools.map((t) => t.name));

  const result = await client.callTool({
    name: "search_sold_comps",
    arguments: {
        city: "Irvine",
        months: 12,
    },
  });

  console.log(JSON.stringify(result, null, 2));

  console.log(JSON.stringify(result, null, 2));
  await client.close();
}

main().catch(console.error);