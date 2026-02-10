import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "datememaybe.net — Покана за среща, на която не могат да ти откажат";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 15%, #f0abfc 30%, #f9a8d4 50%, #e879f9 70%, #c4b5fd 85%, #ddd6fe 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative hearts */}
        <div style={{ position: "absolute", top: 60, left: 80, fontSize: 80, opacity: 0.15, display: "flex" }}>💕</div>
        <div style={{ position: "absolute", top: 140, right: 120, fontSize: 60, opacity: 0.12, display: "flex" }}>❤️</div>
        <div style={{ position: "absolute", bottom: 80, left: 160, fontSize: 70, opacity: 0.13, display: "flex" }}>💖</div>
        <div style={{ position: "absolute", bottom: 120, right: 80, fontSize: 55, opacity: 0.1, display: "flex" }}>💗</div>
        <div style={{ position: "absolute", top: 80, left: 500, fontSize: 45, opacity: 0.1, display: "flex" }}>💘</div>
        <div style={{ position: "absolute", bottom: 60, right: 400, fontSize: 50, opacity: 0.12, display: "flex" }}>💝</div>

        {/* White glow overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            zIndex: 10,
            padding: "0 60px",
          }}
        >
          <div style={{ fontSize: 72, display: "flex" }}>💌</div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#831843",
              textAlign: "center",
              lineHeight: 1.2,
              margin: 0,
              textShadow: "0 2px 12px rgba(255,255,255,0.4)",
            }}
          >
            Date Me Maybe
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#6b2180",
              textAlign: "center",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 800,
              opacity: 0.9,
            }}
          >
            Покана за среща, на която не могат да ти откажат 💕
          </p>

          {/* Pill badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              background: "rgba(255,255,255,0.35)",
              borderRadius: 999,
              padding: "10px 28px",
              fontSize: 22,
              color: "#9333ea",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            datememaybe.net
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
