"use client";

import { useCallback } from "react";

import { trackEvent } from "@/lib/analytics/events";

export const useAnalytics = () => {
  const emit = useCallback<typeof trackEvent>((event, payload) => {
    trackEvent(event, payload);
  }, []);

  return { trackEvent: emit };
};
