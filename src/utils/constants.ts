export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas
export const ITEMS_PER_PAGE = 25;

export const MESSAGES = {
  CACHE_INIT: "🗃️ Initializing from IndexedDB cache...",
  CACHE_FOUND: "🗃️ Loading from IndexedDB cache!",
  CACHE_MISS: "📥 No cache found, loading from API...",
  API_FETCH: "🌐 Fetching from API...",
  CACHE_SAVED: "💾 Saved to cache successfully",
  CACHE_ERROR: "❌ Error with cache operation:",
  API_ERROR: "❌ API response invalid:",
} as const;
