import { parsePropertyQuery } from "../../skills/property-search/propertyQueryParser";
import { searchActiveListings } from "./propertySearch";
import { formatListing } from "./formatProperty";

export async function searchProperties(userQuery: string) {
  const filters = await parsePropertyQuery(userQuery);
  const listings = await searchActiveListings(filters);
  return listings.map(formatListing);
}