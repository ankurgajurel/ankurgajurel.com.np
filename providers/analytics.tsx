"use client";

import { useEffect } from "react";

let initialization: Promise<void> | undefined;

export default function Analytics() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!apiKey?.startsWith("phc_")) return;

    // No feature flags or server analytics are used. Load the browser SDK
    // after hydration, without making it a dependency of the page's UI.
    initialization ??= import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(apiKey, {
          api_host: "/ingest",
          custom_campaign_params: ["ref"],
          capture_pageview: "history_change",
          persistence: "localStorage+cookie",
          opt_out_capturing_persistence_type: "cookie",
          opt_out_persistence_by_default: true,
        });
      })
      .catch((error: unknown) => {
        initialization = undefined;
        console.error("Unable to initialize analytics", error);
      });
  }, []);

  return null;
}
