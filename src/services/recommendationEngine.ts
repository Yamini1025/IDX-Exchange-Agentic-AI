import { query } from "../db/connection";
import {
  buildListingText,
  generateEmbedding,
  cosineSimilarity,
  type Listing,
} from "./propertyEmbeddings";

interface RecommendationListing extends Listing {
  L_City: string | null;
  L_Type_: string | null;
  L_SystemPrice: number | null;
  L_Keyword2: number | null;
  LM_Int2_3: number | null;
}

interface CandidateRow extends RecommendationListing {
  embedding: string | number[];
}

interface PropertyRecommendation {
  listing_id: string;
  city: string | null;
  property_type: string | null;
  price: number | null;
  bedrooms: number | null;
  sqft: number | null;
  similarity_score: number;
  semantic_similarity: number;
}

function calculateSimilarityScore(
  target: RecommendationListing,
  candidate: RecommendationListing,
  targetEmbedding: number[],
  candidateEmbedding: number[],
): { score: number; semanticSimilarity: number } {
  let score = 0;

  if (target.L_SystemPrice != null && candidate.L_SystemPrice != null) {
    const priceDiff = Math.abs(
      target.L_SystemPrice - candidate.L_SystemPrice,
    );

    if (priceDiff < 50_000) score += 20;
    else if (priceDiff < 150_000) score += 12;
    else if (priceDiff < 300_000) score += 5;
  }

  if (target.L_Keyword2 != null && candidate.L_Keyword2 != null) {
    if (target.L_Keyword2 === candidate.L_Keyword2) {
      score += 15;
    }
  }

  if (target.L_City && candidate.L_City) {
    if (target.L_City.trim().toLowerCase() ===
        candidate.L_City.trim().toLowerCase()) {
      score += 15;
    }
  }

  if (target.LM_Int2_3 != null && candidate.LM_Int2_3 != null) {
    const sqftDiff = Math.abs(
      target.LM_Int2_3 - candidate.LM_Int2_3,
    );

    if (sqftDiff < 300) score += 10;
    else if (sqftDiff < 700) score += 5;
  }

  const semanticSimilarity = Math.max(
    0,
    Math.min(1, cosineSimilarity(targetEmbedding, candidateEmbedding)),
  );

  score += semanticSimilarity * 40;

  return {
    score: Math.round(score * 100) / 100,
    semanticSimilarity: Math.round(semanticSimilarity * 1000) / 1000,
  };
}

async function getTargetListing(
  listingId: string,
): Promise<RecommendationListing | null> {
  const results = await query<RecommendationListing>(
    `
      SELECT
        L_ListingID,
        L_City,
        L_Type_,
        L_SystemPrice,
        L_Keyword2,
        LM_Int2_3,
        L_Remarks,
        YearBuilt
      FROM rets_property
      WHERE L_ListingID = ?
        AND L_Status = 'Active'
      LIMIT 1
    `,
    [listingId],
  );

  return results[0] ?? null;
}

async function getCandidateListings(
  targetId: string,
): Promise<CandidateRow[]> {
  return query<CandidateRow>(
    `
      SELECT
        p.L_ListingID,
        p.L_City,
        p.L_Type_,
        p.L_SystemPrice,
        p.L_Keyword2,
        p.LM_Int2_3,
        p.L_Remarks,
        p.YearBuilt,
        e.embedding
      FROM rets_property p
      INNER JOIN property_embeddings e
        ON p.L_ListingID = e.listing_id
      WHERE p.L_Status = 'Active'
        AND p.L_ListingID != ?
    `,
    [targetId],
  );
}

export async function recommendSimilarProperties(
  listingId: string,
  limit = 5,
): Promise<PropertyRecommendation[]> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    throw new Error("limit must be between 1 and 20");
  }

  const target = await getTargetListing(listingId);

  if (!target) {
    throw new Error("Target listing not found or is no longer active");
  }

  const candidates = await getCandidateListings(listingId);

  if (candidates.length === 0) {
    return [];
  }

  const targetEmbedding = await generateEmbedding(
    buildListingText(target),
  );

  const recommendations = candidates.map((candidate) => {
    const candidateEmbedding =
      typeof candidate.embedding === "string"
        ? JSON.parse(candidate.embedding) as number[]
        : candidate.embedding;

    const result = calculateSimilarityScore(
      target,
      candidate,
      targetEmbedding,
      candidateEmbedding,
    );

    return {
      listing_id: candidate.L_ListingID,
      city: candidate.L_City,
      property_type: candidate.L_Type_,
      price: candidate.L_SystemPrice,
      bedrooms: candidate.L_Keyword2,
      sqft: candidate.LM_Int2_3,
      similarity_score: result.score,
      semantic_similarity: result.semanticSimilarity,
    };
  });

  return recommendations
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);
}

interface PriceValidation {
  status: "validated" | "insufficient_data";
  listPrice: number | null;
  compPrice: number | null;
  avgPricePerSqft: number | null;
  compCount: number;
  deltaPct: number | null;
  message: string;
}

interface CompAggregate {
  avgPricePerSqft: number | string | null;
  compCount: number;
}

export async function validateWithComps(
  city: string | null,
  sqft: number | null,
  price: number | null,
): Promise<PriceValidation> {
  if (!city || !sqft || sqft <= 0 || !price || price <= 0) {
    return {
      status: "insufficient_data",
      listPrice: price,
      compPrice: null,
      avgPricePerSqft: null,
      compCount: 0,
      deltaPct: null,
      message: "Missing valid city, square footage, or listing price.",
    };
  }

  const results = await query<CompAggregate>(
    `
      SELECT
        AVG(ClosePrice / NULLIF(LivingArea, 0)) AS avgPricePerSqft,
        COUNT(*) AS compCount
      FROM california_sold
      WHERE City = ?
        AND PropertyType = 'Residential'
        AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        AND ClosePrice > 0
        AND LivingArea BETWEEN ? AND ?
    `,
    [city, sqft * 0.8, sqft * 1.2],
  );

  const avgPricePerSqft = Number(results[0]?.avgPricePerSqft ?? 0);
  const compCount = Number(results[0]?.compCount ?? 0);

  if (compCount === 0 || avgPricePerSqft <= 0) {
    return {
      status: "insufficient_data",
      listPrice: price,
      compPrice: null,
      avgPricePerSqft: null,
      compCount,
      deltaPct: null,
      message: "No qualifying recent sold comparables were found.",
    };
  }

  const compPrice = Math.round(avgPricePerSqft * sqft);
  const deltaPct = Math.round(
    ((price - compPrice) / compPrice) * 1000,
  ) / 10;

  return {
    status: "validated",
    listPrice: price,
    compPrice,
    avgPricePerSqft: Math.round(avgPricePerSqft),
    compCount,
    deltaPct,
    message:
      deltaPct > 0
        ? `Listing price is ${deltaPct}% above the comparable estimate.`
        : deltaPct < 0
          ? `Listing price is ${Math.abs(deltaPct)}% below the comparable estimate.`
          : "Listing price matches the comparable estimate.",
  };
}

export async function getPropertyRecommendations(
  listingId: string,
  limit = 5,
) {
  const target = await getTargetListing(listingId);

  if (!target) {
    throw new Error("Target listing not found or is no longer active");
  }

  const [recommendations, priceValidation] = await Promise.all([
    recommendSimilarProperties(listingId, limit),
    validateWithComps(
      target.L_City,
      target.LM_Int2_3,
      target.L_SystemPrice,
    ),
  ]);

  return {
    target: {
      listing_id: listingId,
      city: target.L_City,
      property_type: target.L_Type_,
      price: target.L_SystemPrice,
      bedrooms: target.L_Keyword2,
      sqft: target.LM_Int2_3,
    },
    recommendations,
    price_validation: priceValidation,
  };
}