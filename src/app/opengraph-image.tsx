import { ImageResponse } from "next/og";
import { BUSINESS } from "@/config/business";

export const runtime = "nodejs";
export const alt = "TARMAX Asphalt — Calgary asphalt maintenance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Built with the brand's own type and colour rather than a
 * screenshot, so it stays legible at thumbnail size in a message preview.
 */
export default async function OpengraphImage() {
  // Satori treats an interpolation next to literal text as two child nodes and
  // rejects it, so the strip is built as one string.
  const strip = `${BUSINESS.city.toUpperCase()} · SEALCOATING · CRACK SEALING · INFRARED REPAIR`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#C8171E",
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            TARMAX
          </div>
          <div style={{ fontSize: 16, color: "#9C9DA0", letterSpacing: "0.42em", marginTop: 4 }}>
            ASPHALT
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            color: "#F4F2ED",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            maxWidth: 940,
          }}
        >
          Protect your asphalt before damage gets worse.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 64, height: 3, background: "#B51F24", display: "flex" }} />
          <div style={{ fontSize: 22, color: "#9C9DA0", letterSpacing: "0.16em" }}>{strip}</div>
        </div>
      </div>
    ),
    size,
  );
}
