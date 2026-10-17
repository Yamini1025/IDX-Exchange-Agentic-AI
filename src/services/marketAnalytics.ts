import { query } from "../db/connection";

export async function getCityMarketSummary(city: string) {
  const sql = `
    SELECT
      City AS city,
      COUNT(*) AS soldCount,
      MIN(CloseDate) AS earliestCloseDate,
      MAX(CloseDate) AS latestCloseDate,
      ROUND(AVG(ClosePrice), 0) AS avgClosePrice,

      (
        SELECT AVG(m.ClosePrice)
        FROM (
          SELECT ClosePrice,
                 ROW_NUMBER() OVER (ORDER BY ClosePrice) AS rn,
                 COUNT(*) OVER () AS cnt
          FROM california_sold
          WHERE LOWER(City) = LOWER(?)
            AND PropertyType = 'Residential'
            AND ClosePrice > 0
            AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND CloseDate <= CURDATE()
            AND LivingArea > 0
            AND ListPrice > 0
        ) m
        WHERE m.rn IN (
          FLOOR((m.cnt + 1) / 2),
          FLOOR((m.cnt + 2) / 2)
        )
      ) AS medianClosePrice,

      ROUND(AVG(ClosePrice / NULLIF(LivingArea, 0)), 0)
        AS avgPricePerSqft,
      ROUND(AVG(DaysOnMarket), 1) AS avgDaysOnMarket,
      ROUND(AVG(ClosePrice / NULLIF(ListPrice, 0)) * 100, 1)
        AS listToClosePct
    FROM california_sold
    WHERE LOWER(City) = LOWER(?)
      AND PropertyType = 'Residential'
      AND ClosePrice > 0
      AND LivingArea > 0
      AND ListPrice > 0
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      AND CloseDate <= CURDATE()
    GROUP BY City
    LIMIT 1
  `;

    const rows = await query(sql, [city, city]);
    const result = rows[0];

    if (!result) return null;

    return {
        ...result,
        dataCoverageNote:
        "Results include only records available in the database within the requested 12-month window. Check earliestCloseDate and latestCloseDate before describing this as a full-year summary.",
    };
}


export async function getCityPriceTrend(
  city: string,
  months: number = 12
) {
  const sql = `
    SELECT
      DATE_FORMAT(CloseDate, '%Y-%m') AS month,
      COUNT(*) AS sales,
      ROUND(AVG(ClosePrice), 0) AS avgPrice,
      ROUND(AVG(DaysOnMarket), 1) AS avgDom
    FROM california_sold
    WHERE LOWER(City) = LOWER(?)
      AND PropertyType = 'Residential'
      AND ClosePrice > 0
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      AND CloseDate <= CURDATE()
    GROUP BY DATE_FORMAT(CloseDate, '%Y-%m')
    ORDER BY month
  `;

  const rows = await query(sql, [city, months]);

  return rows.map((row: any, index: number) => {
    const previous: any = rows[index - 1];

    const previousPrice = previous
      ? Number(previous.avgPrice)
      : null;

    const currentPrice = Number(row.avgPrice);

    const priceChangePct =
      previousPrice && previousPrice > 0
        ? Number(
            (((currentPrice - previousPrice) / previousPrice) * 100)
              .toFixed(1)
          )
        : null;

    return {
      ...row,
      sales: Number(row.sales),
      avgPrice: currentPrice,
      avgDom: row.avgDom == null ? null : Number(row.avgDom),
      priceChangePct,
    };
  });
}

