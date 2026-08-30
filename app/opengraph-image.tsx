import { ImageResponse } from "next/og";

export const alt = "WebOps Commander — agent-native incident response, with humans in command";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#e9e4d8",
        color: "#141719",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 86px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#8f2b0f", fontSize: 24 }}>
        <div
          style={{
            width: 72,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg fill="none" height="64" viewBox="0 0 64 64" width="64">
            <path
              d="M10 14v23l11 13 11-13V14"
              stroke="#ff6b35"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            />
            <path d="M54 19a16 16 0 1 0 0 26" stroke="#087e79" strokeLinecap="round" strokeWidth="6" />
            <circle cx="10" cy="14" fill="#087e79" r="4" />
            <circle cx="54" cy="45" fill="#ff6b35" r="4" />
          </svg>
        </div>
        WEBMCP / HUMAN APPROVAL / DETERMINISTIC
      </div>
      <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 700, marginTop: 46, letterSpacing: -3 }}>
        WebOps Commander
      </div>
      <div style={{ color: "#4f5858", fontSize: 38, marginTop: 26 }}>
        Agent-native incident response, with humans in command.
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 62, fontSize: 24 }}>
        <span style={{ border: "1px solid #827b70", padding: "12px 22px" }}>15 native tools</span>
        <span style={{ border: "1px solid #827b70", padding: "12px 22px" }}>Guarded rollback</span>
        <span style={{ border: "1px solid #827b70", padding: "12px 22px" }}>SEV-1 recovered</span>
      </div>
    </div>,
    size,
  );
}
