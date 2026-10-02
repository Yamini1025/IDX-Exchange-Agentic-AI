---
name : property-search
description : "Parse natural language real estate property search queries into structures filters for the IDX Exchange MLS database. Use when a user asks to find or filter properties by city, price, bedrooms, bathrooms, square footage, property type, pool, view, or HOA."
---

# Property Search

Parse a user's free-text real estate query into a structured property filter object.

## Supported Filters

Map user intent to these MLS fields : 

- city -> `L_City`
- max price -> `L_SystemPrice`
- minimum bedrooms -> `L_Keyword2`
- minimum bathrooms -> `LM_Dec_3`
- minimum square feet -> `LM_Int2_3`
- property type - `L_Type_`
- pool -> 'PoolPrivateYN`
- view -> `ViewYN`
- maximum HOA -> `AssociationFee`

## Parsing

Use the `parsePropertyQuery(query : string)` function to extract the supported filters.

The parser should :

1. Extract the city whent the query specifies a location.
2. Extract maximum price and convert `k` and `m` values to dollars.
3. Extract minimum bedrooms.
4. Extract minimum bathrooms.
5. Extract minimum square footage.
6. Map supported property-type terms to MLS property-type values.
7. Detect whether the user requested a pool.
8. Detect whether the user requiested a view.
9. Extract maximum HOA when specified.
10. Return `null` for filters that were not specified.

### Completion Criterion 

The parser returns a consistent structured object containing all supported filter fields, with `null` used for unspecified filters.

## Verification

Test the parser with at least 10 different natural-language property queries.

Each test should verify that the extracted values match the user's requested filters.

### Completion Criterion

At least 10 test queries pass with the expected structured filter values.