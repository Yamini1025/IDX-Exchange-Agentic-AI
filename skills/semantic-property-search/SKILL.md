---
name: semantic-property-search
description: "Find active real estate listings using natural-language descriptions and semantic similarity. Use when users describe a property's style, features, atmosphere, setting, or desired characteristics rather than relying only on exact keywords."
---

# Semantic Property Search

Use the semantic property search MCP tool to find active property listings that match the meaning and intent of a user's description.

## Available Tools

### `semantic_property_search`

Inputs:
- `query`: Natural-language description of the desired property.
- `limit`: Optional number of results, from 1 to 10. Defaults to 5.

Returns:
- `listing_id`: Unique MLS listing identifier.
- `city`: Property location.
- `property_type`: Type of property.
- `price`: Listed price.
- `remarks`: Listing description.
- `similarity`: Cosine similarity between the query embedding and listing embedding.

Use this tool for questions such as:
- "Find a charming craftsman home with mountain views."
- "Show me modern homes with open floor plans and lots of natural light."
- "Find properties with a cozy atmosphere and a large backyard."
- "I'm looking for a home with character, mature trees, and outdoor entertaining space."

## Search Guidelines

1. Convert the user's request into a concise natural-language description that preserves the requested property characteristics.
2. Call `semantic_property_search` with the description.
3. Return the matching listings, including city, property type, price, and relevant listing remarks.
4. Explain why each listing may match the user's description using details from its actual listing remarks.
5. Treat similarity scores as relative ranking signals, not percentages or probabilities of a match.
6. Do not claim a property has a feature unless that feature is supported by its listing remarks.
7. Do not invent listing details, prices, locations, or property characteristics.
8. If no results are returned, explain that no similar listings were found in the currently indexed dataset.
9. If the user requests more or fewer results, adjust the `limit` parameter accordingly.
10. If the user includes additional constraints such as city, budget, or property type, do not imply that semantic similarity alone enforces those constraints. Verify them against returned listing data when available.
11. Be transparent that results depend on the listings currently indexed with embeddings.
12. If the search tool fails or is unavailable, explain the limitation instead of fabricating results.

## Response Style

- Present results in descending similarity order.
- Use readable prices and concise listing summaries.
- Highlight actual matching characteristics from the remarks.
- Avoid describing similarity scores as match percentages.
- Remind users that listing information should be independently verified.