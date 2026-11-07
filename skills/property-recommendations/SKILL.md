---
name: property-recommendations
description: "Recommend the top 5 similar active property listings based on a target listing, with a price assessment validated against recent comparable sales from california_sold."
---

# Property Recommendations

Use the property recommendation MCP tool when a user wants similar properties based on a specific listing ID or wants to evaluate a listing against comparable properties.

## Available Tools

### `recommend_similar_properties`

Inputs:
- `listingId`: Unique MLS listing identifier of the target property.
- `limit`: Optional number of recommendations, from 1 to 20. Defaults to 5.

Returns:
- Target listing details.
- Similar active listings, including listing ID, city, property type, price, bedrooms, square footage, similarity score, and semantic similarity.
- Price validation based on comparable sold properties from `california_sold`, including estimated comparable price, average price per square foot, comp count, and percentage difference.

## Recommendation Guidelines

1. Identify the target listing using its listing ID.
2. Call `recommend_similar_properties` with the listing ID.
3. Return the top 5 recommendations by default, unless the user requests a different number.
4. Present each recommendation with its listing ID, city, property type, price, bedrooms, square footage, and similarity score.
5. Explain that recommendations combine structured property attributes and semantic similarity.
6. Present the price assessment using the returned `price_validation` information.
7. Explain whether the asking price is above or below the comparable estimate using the returned percentage difference.
8. Include the number of comparable sold properties used in the assessment.
9. Treat similarity scores as ranking signals, not probabilities or match percentages.
10. Do not describe the comparable estimate as a formal appraisal or guaranteed market value.
11. Do not invent property details, comparable sales, prices, or recommendations.
12. If no recommendations are returned, explain that there are no eligible embedded active listings available.
13. If comparable sales data is insufficient, clearly state that a price assessment could not be produced.
14. If the tool fails or the target listing is unavailable, explain the limitation instead of fabricating results.

## Response Style

- Present recommendations in descending similarity-score order.
- Use readable currency formatting.
- Clearly separate similar-property recommendations from the price assessment.
- State the comparable-sales sample size.
- Be transparent about limitations in the available embedded listings and sold-property data.
- Remind users that recommendations and price estimates are informational and should be independently verified.