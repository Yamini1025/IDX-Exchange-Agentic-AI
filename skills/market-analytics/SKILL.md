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

1. For broad questions about a city's housing market, call both `get_city_market_summary` and `get_city_price_trend` and base the answer on their returned results.
2. For questions about one specific metric, call the relevant tool rather than fetching unnecessary data.
3. Use returned tool data only; never invent statistics or fill gaps with estimates.
4. State the city and the actual date or month range covered by the returned data.
5. Include median closing price, average days on market, and list-to-close percentage in broad market summaries when those values are available.
6. Report the monthly trend and month-over-month changes when trend data is available. Distinguish average closing prices from median closing prices.
7. Check `earliestCloseDate`, `latestCloseDate`, and `dataCoverageNote` when returned. If the available records cover less than 12 months, explicitly disclose the shorter period and do not call it a complete 12-month trend.
8. Identify incomplete months when the data supports doing so. Do not assume the latest month is incomplete without checking its date coverage.
9. Explain that month-to-month changes in average closing price can reflect differences in the mix of homes sold, not just changes in underlying home values.
10. If no qualifying data is returned, explain that the available dataset does not provide a result.
11. Treat these statistics as descriptive historical data, not a guarantee of future prices.
12. If a required tool fails or is unavailable, state that limitation instead of fabricating an answer.