import {
  getSession,
  updateSession,
  clearSession,
} from "./session";

const userId = "test-user";

clearSession(userId);

updateSession(userId, {
  filters: { city: "Irvine" },
});

updateSession(userId, {
  filters: { maxPrice: 1200000, beds: 3 },
});

console.log(getSession(userId));

clearSession(userId);