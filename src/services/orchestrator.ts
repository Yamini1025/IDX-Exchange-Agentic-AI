import {
  propertySearchAgent,
  marketStatsAgent,
  recommendationAgent,
  ragAgent,
  emailDraftAgent,
} from "./agents";

type Intent = "search" | "market" | "recommend" | "knowledge" | "email" | "mixed";

export function classifyIntent(query: string): Intent {
  const text = query.toLowerCase();

  const search = /\b(find|search|show|list|looking for|homes|houses|properties|listings)\b/.test(text);
  const market = /\b(market|prices|trends|rising|falling|statistics|average|median|sales|days on market|dom)\b/.test(text);
  const recommend = /\b(recommend|similar|alternatives|like this|comparable)\b/.test(text);
  const knowledge = /\b(what is|what does|explain|define|meaning|how does|columns|fields)\b/.test(text);
  const email = /\b(email|draft|write|message)\b/.test(text);

  if (search && market) return "mixed";
  if (email) return "email";
  if (recommend) return "recommend";
  if (knowledge) return "knowledge";
  if (market) return "market";
  if (search) return "search";

  return "knowledge";
}

function extractCity(query: string): string | null {
  const match = query.match(/\b(?:in|for|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  return match?.[1] ?? null;
}

type AgentFunctions = {
  propertySearchAgent: typeof propertySearchAgent;
  marketStatsAgent: typeof marketStatsAgent;
  recommendationAgent: typeof recommendationAgent;
  ragAgent: typeof ragAgent;
  emailDraftAgent: typeof emailDraftAgent;
};

const defaultAgents: AgentFunctions = {
  propertySearchAgent,
  marketStatsAgent,
  recommendationAgent,
  ragAgent,
  emailDraftAgent,
};

export async function orchestrate(
  query: string,
  userId: string,
  agents: AgentFunctions = defaultAgents,
) {
  const intent = classifyIntent(query);

  switch (intent) {
    case "search":
      return agents.propertySearchAgent(query, userId);

    case "market": {
      const city = extractCity(query);
      if (!city) return { response: "Which city would you like market statistics for?" };
      return agents.marketStatsAgent(city);
    }

    case "recommend":
      return agents.recommendationAgent(userId);

    case "knowledge":
      return agents.ragAgent(query);

    case "email":
      return agents.emailDraftAgent(query);

    case "mixed": {
      const city = extractCity(query);
      if (!city) return { response: "Which city should I use for the market analysis?" };

      const [listings, stats] = await Promise.all([
        agents.propertySearchAgent(query, userId),
        agents.marketStatsAgent(city),
      ]);

      return { listings, marketStats: stats };
    }
  }
}