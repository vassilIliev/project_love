"use client";

import { useEffect } from "react";

/**
 * Stores the influencer referral code in sessionStorage
 * so it persists through the checkout flow.
 * The CreateForm reads it and passes it to the checkout API,
 * which saves it in Stripe session metadata.
 */
export default function RefTracker({ code }: { code: string }) {
  useEffect(() => {
    sessionStorage.setItem("ref", code);
  }, [code]);

  return null;
}
