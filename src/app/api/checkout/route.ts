import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

function sanitize(str: string, maxLen: number): string {
  return str.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
}

/**
 * Public checkout endpoint — no auth required.
 * Creates a Stripe Checkout session with invitation data in metadata.
 * Stripe collects the customer's email automatically.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const recipientName = sanitize(body.recipientName || "", 50);
    if (!recipientName) {
      return NextResponse.json(
        { error: "Името на получателя е задължително." },
        { status: 400 }
      );
    }

    const time = body.time ? sanitize(body.time, 50) : "";
    const place = body.place ? sanitize(body.place, 50) : "";
    const extraMessage = body.extraMessage ? sanitize(body.extraMessage, 100) : "";

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const priceId = process.env.STRIPE_PRICE_ID;

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] =
      priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Покана за среща 💕",
                  description: `Персонализирана покана за ${recipientName}`,
                },
                unit_amount: 199, // €1.99
              },
              quantity: 1,
            },
          ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#create-section`,
      // Stripe collects the email — no account needed
      customer_creation: "always",
      // Store invitation data in session metadata (max 500 chars per value)
      metadata: {
        recipientName,
        time,
        place,
        extraMessage,
      },
      line_items: lineItems,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Неуспешно създаване на платежна сесия." },
      { status: 500 }
    );
  }
}
