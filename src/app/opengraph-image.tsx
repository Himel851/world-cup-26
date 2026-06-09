import { ImageResponse } from "next/og";

export const alt = "FIFA World Cup 2026 — Groups, Fixtures, Quizzes & Best XI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(145deg, #06080d 0%, #0a1a12 45%, #0c2818 100%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 24px #34d399",
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#6ee7b7",
            }}
          >
            FIFA World Cup 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Groups · Fixtures · Quizzes
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#a1a1aa", maxWidth: 820 }}>
            48 nations · live rankings · build your Best XI · daily challenge
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#71717a",
            fontWeight: 600,
          }}
        >
          <span>USA · Mexico · Canada</span>
          <span>football-world-cup-26.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
