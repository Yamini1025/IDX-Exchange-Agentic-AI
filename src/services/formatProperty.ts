import type { ListingRow, SoldRow } from "../types/property";

export function formatListing(listing: ListingRow): string {
  return [
    `${listing.L_Address ?? "Address unavailable"}, ${listing.L_City ?? ""}`,
    `Price: ${listing.price == null ? "N/A" : `$${listing.price.toLocaleString()}`}`,
    `Beds: ${listing.beds ?? "N/A"} | Baths: ${listing.baths ?? "N/A"}`,
    `Sqft: ${listing.sqft?.toLocaleString() ?? "N/A"}`,
    `Type: ${listing.type ?? "N/A"}`,
    `Year built: ${listing.YearBuilt ?? "N/A"}`,
    `Days on market: ${listing.DaysOnMarket ?? "N/A"}`,
  ].join("\n");
}

export function formatSoldComp(property: SoldRow): string {
  return [
    `${property.UnparsedAddress ?? "Address unavailable"}, ${property.City ?? ""}`,
    `Sold price: ${property.ClosePrice == null ? "N/A" : `$${property.ClosePrice.toLocaleString()}`}`,
    `Close date: ${property.CloseDate ?? "N/A"}`,
    `Beds: ${property.BedroomsTotal ?? "N/A"} | Baths: ${property.BathroomsTotalInteger ?? "N/A"}`,
    `Sqft: ${property.LivingArea?.toLocaleString() ?? "N/A"}`,
    `Property type: ${property.PropertySubType ?? "N/A"}`,
    `Days on market: ${property.DaysOnMarket ?? "N/A"}`,
  ].join("\n");
}