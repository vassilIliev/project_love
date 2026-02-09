import crypto from "crypto";

const SECRET = process.env.INVITATION_SECRET || "change-me-to-a-random-secret";

export interface InvitationData {
  recipientName: string;
  time?: string;
  place?: string;
  extraMessage?: string;
}

/**
 * Encode invitation data into a URL-safe token with HMAC signature.
 * Format: <base64url-payload>.<base64url-hmac>
 * No database needed — the data lives in the URL itself.
 */
export function encodeInvitation(data: InvitationData): string {
  const json = JSON.stringify({
    n: data.recipientName,
    t: data.time || undefined,
    p: data.place || undefined,
    m: data.extraMessage || undefined,
  });

  const payload = Buffer.from(json, "utf-8").toString("base64url");
  const hmac = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${hmac}`;
}

/**
 * Decode and verify a token back into invitation data.
 * Returns null if the token is invalid or tampered with.
 */
export function decodeInvitation(token: string): InvitationData | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payload = token.slice(0, dotIndex);
  const hmac = token.slice(dotIndex + 1);

  if (!payload || !hmac) return null;

  // Verify HMAC signature
  const expectedHmac = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  if (hmac !== expectedHmac) return null;

  try {
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    const parsed = JSON.parse(json);

    return {
      recipientName: parsed.n,
      time: parsed.t || undefined,
      place: parsed.p || undefined,
      extraMessage: parsed.m || undefined,
    };
  } catch {
    return null;
  }
}
