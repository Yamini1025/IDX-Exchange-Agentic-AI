import type { PropertyFilters } from "../types/property";
import type { ListingRow } from "../types/property";

interface UserSession {
  filters: PropertyFilters;
  lastResults?: ListingRow[];
  conversationStep: number;
}

const sessions = new Map<string, UserSession>();

export function getSession(userId: string): UserSession {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
    filters: {},
    conversationStep: 0,
    });
  }

  return sessions.get(userId)!;
}

export function updateSession(
  userId: string,
  updates: Partial<UserSession>
): void {
  const session = getSession(userId);

  sessions.set(userId, {
    ...session,
    ...updates,
    filters: {
      ...session.filters,
      ...updates.filters,
    },
  });
}

export function clearSession(userId: string): void {
  sessions.delete(userId);
}
