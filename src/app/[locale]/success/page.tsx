import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { encodeInvitation, decodeInvitation } from "@/lib/invitation-codec";
import CopyLinkButton from "@/components/CopyLinkButton";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; token?: string }>;
}

/**
 * Shared success UI — used by both the Stripe and easter-egg flows.
 */
function SuccessView({
  dict,
  locale,
  shareableLink,
  token,
}: {
  dict: ReturnType<typeof getDictionary>;
  locale: string;
  shareableLink: string;
  token: string;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="text-center space-y-6 max-w-lg w-full relative z-10">
        <div className="animate-celebrate">
          <div className="text-6xl animate-gentle-float emoji-ring inline-block">🎉</div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 animate-stagger-in stagger-2">
          {dict.success.titleBefore}
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent">
            {dict.success.titleBrand}
          </span>
          {dict.success.titleAfter}
        </h1>

        {/* Shareable link */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 space-y-4 magnetic-hover animate-stagger-in stagger-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {dict.success.linkLabel}
          </label>
          <div className="flex items-center gap-2 bg-pink-50 rounded-xl px-4 py-3 border border-pink-100/50">
            <code className="flex-1 text-pink-700 text-sm break-all font-mono">
              {shareableLink}
            </code>
            <CopyLinkButton link={shareableLink} />
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 magnetic-hover animate-stagger-in stagger-4">
          <p className="text-sm font-medium text-gray-600 mb-3">
            {dict.success.qrLabel}
          </p>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}&color=ec4899`}
              alt={dict.success.qrAlt}
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
              className="rounded-xl shadow-md"
            />
          </div>
        </div>

        <div className="animate-stagger-in stagger-5">
          <a
            href={`/${locale}/v/${token}`}
            className="liquid-glass liquid-glass-pink inline-block px-6 py-3 text-white rounded-full
                       hover:scale-105 active:scale-95"
          >
            {dict.success.preview}
          </a>
        </div>

        <p className="text-xs text-gray-400 animate-stagger-in stagger-5">
          {dict.success.tip}
        </p>
      </div>
    </main>
  );
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  const sp = await searchParams;
  const sessionId = sp.session_id;
  const directToken = sp.token;

  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");

  // ─── Easter-egg flow: token passed directly (no Stripe) ───
  if (directToken) {
    const invitation = decodeInvitation(decodeURIComponent(directToken));
    if (!invitation) {
      redirect(`/${locale}`);
    }

    const shareableLink = `${appUrl}/${locale}/v/${directToken}`;
    return (
      <SuccessView
        dict={dict}
        locale={locale}
        shareableLink={shareableLink}
        token={directToken}
      />
    );
  }

  // ─── Normal Stripe flow ───
  if (!sessionId) {
    redirect(`/${locale}`);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return (
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md animate-stagger-in stagger-1">
            <div className="text-5xl animate-gentle-float">😕</div>
            <h1 className="text-2xl font-bold text-gray-800">
              {dict.success.paymentIncomplete}
            </h1>
            <p className="text-gray-500">
              {dict.success.paymentIncompleteDesc}
            </p>
            <a
              href={`/${locale}`}
              className="liquid-glass liquid-glass-pink inline-block px-6 py-3 text-white rounded-full hover:scale-105 active:scale-95"
            >
              {dict.success.backHome}
            </a>
          </div>
        </main>
      );
    }

    const meta = session.metadata;
    if (!meta?.recipientName) {
      throw new Error("Missing invitation data in session metadata.");
    }

    const token = encodeInvitation({
      recipientName: meta.recipientName,
      time: meta.time || undefined,
      place: meta.place || undefined,
      extraMessage: meta.extraMessage || undefined,
    });

    const shareableLink = `${appUrl}/${locale}/v/${token}`;

    return (
      <SuccessView
        dict={dict}
        locale={locale}
        shareableLink={shareableLink}
        token={token}
      />
    );
  } catch (error) {
    console.error("Success page error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md animate-stagger-in stagger-1">
          <div className="text-5xl animate-gentle-float">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {dict.success.error}
          </h1>
          <p className="text-gray-500">
            {dict.success.errorDesc}
          </p>
          <a
            href={`/${locale}`}
            className="liquid-glass liquid-glass-pink inline-block px-6 py-3 text-white rounded-full hover:scale-105 active:scale-95"
          >
            {dict.success.backHome}
          </a>
        </div>
      </main>
    );
  }
}
