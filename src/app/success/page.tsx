import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { encodeInvitation } from "@/lib/invitation-codec";
import CopyLinkButton from "@/components/CopyLinkButton";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  try {
    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return (
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-5xl">😕</div>
            <h1 className="text-2xl font-bold text-gray-800">
              Плащането не е завършено
            </h1>
            <p className="text-gray-500">
              Изглежда плащането ти все още не е потвърдено. Моля, опитай отново.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Към началото
            </a>
          </div>
        </main>
      );
    }

    // Read invitation data from Stripe session metadata
    const meta = session.metadata;
    if (!meta?.recipientName) {
      throw new Error("Липсват данни за поканата в метаданните на сесията.");
    }

    // Encode invitation data into a URL-safe token (no DB needed!)
    const token = encodeInvitation({
      recipientName: meta.recipientName,
      time: meta.time || undefined,
      place: meta.place || undefined,
      extraMessage: meta.extraMessage || undefined,
    });

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const shareableLink = `${appUrl}/v/${token}`;

    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-lg w-full">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Твоята datememaybe покана е готова!
          </h1>

          {/* Споделяем линк */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Твоят уникален линк за покана:
            </label>
            <div className="flex items-center gap-2 bg-pink-50 rounded-xl px-4 py-3">
              <code className="flex-1 text-pink-700 text-sm break-all font-mono">
                {shareableLink}
              </code>
              <CopyLinkButton link={shareableLink} />
            </div>
          </div>

          {/* QR код */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6">
            <p className="text-sm font-medium text-gray-600 mb-3">
              Или сканирай този QR код:
            </p>
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}&color=ec4899`}
                alt="QR код за линка на поканата"
                width={200}
                height={200}
                className="rounded-xl"
              />
            </div>
          </div>

          <a
            href={`/v/${token}`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full
                       hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          >
            Прегледай поканата си 💝
          </a>

          <p className="text-xs text-gray-400">
            Съвет: Изпрати линка чрез SMS, имейл или социални мрежи!
          </p>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Грешка на страницата за успех:", error);
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Нещо се обърка
          </h1>
          <p className="text-gray-500">
            Не успяхме да потвърдим платежната ти сесия. Моля, свържи се с
            поддръжката, ако ти е било таксувано.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Към началото
          </a>
        </div>
      </main>
    );
  }
}
