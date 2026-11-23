import { searchProperties } from "./propertySearchService";
import {
  getCityMarketSummary,
  getCityPriceTrend,
} from "./marketAnalytics";
import { getPropertyRecommendations } from "./recommendationEngine";
import { askRagQuestion } from "./ragService";
import { getSession } from "./session";

export async function propertySearchAgent(
  query: string,
  userId: string,
) {
  return searchProperties(userId, query);
}

export async function marketStatsAgent(city: string) {
  const [summary, trends] = await Promise.all([
    getCityMarketSummary(city),
    getCityPriceTrend(city),
  ]);

  return { summary, trends };
}

export async function recommendationAgent(
  userId: string,
): Promise<unknown> {
  const session = getSession(userId);
  const listing = session.lastResults?.[0];

  if (!listing?.L_ListingID) {
    return {
      message: "Search for properties first so I can recommend similar listings.",
    };
  }

  return getPropertyRecommendations(listing.L_ListingID);
}

export async function emailDraftAgent(content: string) {
  return {
    subject: "Real Estate Market Update",
    body: `Hello,

${content}

Best regards`,
  };
}

export async function ragAgent(query: string) {
  return askRagQuestion(query);
}