export type AnalyticsEventName =
  | "profile_selected"
  | "profile_created"
  | "watchlist_added"
  | "watchlist_removed"
  | "search_performed"
  | "title_opened"
  | "player_played"
  | "player_paused"
  | "player_seeked"
  | "playback_saved"
  | "preferences_updated";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (event: AnalyticsEventName, payload: AnalyticsPayload = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const eventPayload = {
    event,
    timestamp: Date.now(),
    ...payload,
  };

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push(eventPayload);
  }

  if (process.env.NODE_ENV !== "production") {
    // Intentional logging in development to verify tracking architecture quickly.
    console.info("[analytics]", eventPayload);
  }
};
