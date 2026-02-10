import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { encodeInvitation } from "@/lib/invitation-codec";
import { locales, defaultLocale } from "@/i18n/config";

const EASTER_EGG = (process.env.EASTER_EGG_PASS || "obicham te").toLowerCase();

function sanitize(str: string, maxLen: number): string {
  return str.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
}

/**
 * Public checkout endpoint — no auth required.
 * Creates a Stripe Checkout session with invitation data in metadata.
 * Stripe collects the customer's email automatically.
 *
 * Easter egg: if the extra message field matches EASTER_EGG_PASS,
 * payment is bypassed and a token is returned directly.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const recipientName = sanitize(body.recipientName || "", 50);
    if (!recipientName) {
      return NextResponse.json(
        { error: "Recipient name is required." },
        { status: 400 }
      );
    }

    const time = body.time ? sanitize(body.time, 50) : "";
    const place = body.place ? sanitize(body.place, 50) : "";
    const extraMessage = body.extraMessage ? sanitize(body.extraMessage, 100) : "";

    // Get locale from request body (sent by the client)
    const rawLocale = body.locale || defaultLocale;
    const locale = locales.includes(rawLocale) ? rawLocale : defaultLocale;

    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");

    // ─── Easter egg: bypass payment ───
    if (extraMessage.toLowerCase() === EASTER_EGG) {
      const token = encodeInvitation({
        recipientName,
        time: time || undefined,
        place: place || undefined,
        // Don't include the passphrase as the actual message
        extraMessage: undefined,
      });

      return NextResponse.json({
        url: `${appUrl}/${locale}/success?token=${encodeURIComponent(token)}`,
      });
    }

    // ─── Normal Stripe checkout flow ───
    const priceId = process.env.STRIPE_PRICE_ID;

    const productName = locale === "bg" ? "Покана за среща 💕" : "Date invitation 💕";
    const productDesc = locale === "bg"
      ? `Персонализирана покана за ${recipientName}`
      : `Personalized invitation for ${recipientName}`;

    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] =
      priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: productName,
                  description: productDesc,
                },
                unit_amount: 199, // €1.99
              },
              quantity: 1,
            },
          ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/#create-section`,
      // Stripe collects the email — no account needed
      customer_creation: "always",
      locale: locale === "bg" ? "bg" : "en",
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
      { error: "Failed to create payment session." },
      { status: 500 }
    );
  }
}
