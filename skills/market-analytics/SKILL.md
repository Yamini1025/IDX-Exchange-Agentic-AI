---
name: market-analytics
description: "Analyze recent residential real estate market activity by city using sold MLS data. Use for market summaries, average and median sale prices, price per square foot, days on market, list-to-close ratios, and monthly price trends."
---

# Market Analytics

Use the MCP market analytics tools to answer questions about recent residential real estate market conditions.

## Available Tools

### `get_city_market_summary`

Input:
- `city`: City name, such as Pasadena or Irvine.

Returns statistics for qualifying residential sales within the last 12 months:
- `soldCount`: Number of qualifying sales.
- `avgClosePrice`: Average closing price.
- `medianClosePrice`: Median closing price.
- `avgPricePerSqft`: Average closing price per square foot.
- `avgDaysOnMarket`: Average days on market.
- `listToClosePct`: Average closing price as a percentage of list price.

Use this tool for questions such as:
- "What's the housing market like in Pasadena?"
- "What's the median home sale price in Irvine?"
- "How much are buyers paying per square foot?"

### `get_city_price_trend`

Inputs:
- `city`: City name.
- `months`: Optional number of months to query, from 1 to 120. Defaults to 12.

Returns monthly sales counts, average closing prices, average days on market, and percentage changes in average closing price.

Use this tool for questions such as:
- "How have home prices in Pasadena changed recently?"
- "Compare monthly average sale prices in Irvine over the last year."

## Interpretation Guidelines

1. Use the tools' returned data rather than inventing market statistics.
2. State the city and period covered.
3. Distinguish average prices from median prices.
4. Explain that month-to-month changes in average closing price can reflect differences in the mix of homes sold, not just changes in underlying home values.
5. Identify incomplete months when the available data indicates a month is incomplete.
6. If no qualifying data is returned, explain that the available dataset does not provide a result.
7. Do not describe a month-over-month average-price change as a definitive measure of home appreciation.
8. Treat these statistics as descriptive historical data, not a guarantee of future prices.
