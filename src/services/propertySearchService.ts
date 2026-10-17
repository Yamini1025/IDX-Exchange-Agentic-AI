import { parsePropertyQuery } from "../../skills/property-search/propertyQueryParser";
import { searchActiveListings } from "./propertySearch";
import { formatListing } from "./formatProperty";
import { getSession, updateSession } from "./session";
import type { PropertyFilters } from "../types/property";

export async function searchProperties(
  userId: string,
  userQuery: string
) {
  const session = getSession(userId);
  const newFilters: PropertyFilters = await parsePropertyQuery(userQuery);

  const filters: PropertyFilters = {
    ...session.filters,
    ...Object.fromEntries(
      Object.entries(newFilters).filter(
        ([, value]) => value != null && value !== ""
      )
    ),
  };

  updateSession(userId, { filters });

  const listings = await searchActiveListings(filters);

  updateSession(userId, {
    lastResults: listings,
  });

  return listings.map(formatListing);
}
