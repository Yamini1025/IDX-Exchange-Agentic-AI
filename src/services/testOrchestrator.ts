import { classifyIntent, orchestrate } from "./orchestrator";

async function main() {
  const tests = [
    { query: "Find 3 bedroom homes in Pasadena", expected: "search" },
    { query: "Are prices rising in Pasadena?", expected: "market" },
    { query: "Recommend similar properties", expected: "recommend" },
    { query: "What does DOM mean?", expected: "knowledge" },
    {
      query: "Find affordable homes in Pasadena and tell me if prices are rising",
      expected: "mixed",
    },
    { query: "Draft an email about the market summary", expected: "email" },
  ] as const;

  for (const test of tests) {
    const actual = classifyIntent(test.query);
    console.log(`${actual === test.expected ? "PASS" : "FAIL"}: ${test.query}`);
  }

  const calls: string[] = [];

  const mockAgents = {
    propertySearchAgent: async (query: string, userId: string) => {
      calls.push(`search:${userId}`);
      return ["Mock property listing"];
    },
    marketStatsAgent: async (city: string) => {
    calls.push(`market:${city}`);
    return {
        summary: { dataCoverageNote: "Mock data" },
        trends: [],
    };
    },
    recommendationAgent: async (userId: string) => {
      calls.push(`recommend:${userId}`);
      return [];
    },
    ragAgent: async (query: string) => {
      calls.push("rag");
      return "Mock knowledge answer";
    },
    emailDraftAgent: async (content: string) => {
      calls.push("email");
      return { subject: "Mock email", body: content };
    },
  };

  const result = await orchestrate(
    "Find affordable homes in Pasadena and tell me if prices are rising",
    "test-user",
    mockAgents,
  );

  const passed =
    calls.includes("search:test-user") &&
    calls.includes("market:Pasadena") &&
    typeof result === "object" &&
    result !== null &&
    "listings" in result &&
    "marketStats" in result;

  console.log(
    `${passed ? "PASS" : "FAIL"}: Mixed query calls both agents and combines results`,
  );

  console.log("Agent calls:", calls);
}

main().catch(console.error);