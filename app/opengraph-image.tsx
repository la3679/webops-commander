import { ImageResponse } from "next/og";

export const alt = "WebOps Commander — agent-native incident response, with humans in command";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #07111d 0%, #0b1827 55%, #102332 100%)",
        color: "#f4f7fb",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 86px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22, color: "#6ee7b7", fontSize: 26 }}>
        <div
          style={{
            width: 58,
            height: 58,
            border: "2px solid #6ee7b7",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⌁
        </div>
        WEBMCP • HUMAN APPROVAL • DETERMINISTIC
      </div>
      <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 700, marginTop: 46, letterSpacing: -3 }}>
        WebOps Commander
      </div>
      <div style={{ color: "#aebdca", fontSize: 38, marginTop: 26 }}>
        Agent-native incident response, with humans in command.
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 62, fontSize: 24 }}>
        <span style={{ border: "1px solid #294155", borderRadius: 999, padding: "12px 22px" }}>15 native tools</span>
        <span style={{ border: "1px solid #294155", borderRadius: 999, padding: "12px 22px" }}>Guarded rollback</span>
        <span style={{ border: "1px solid #294155", borderRadius: 999, padding: "12px 22px" }}>SEV-1 recovered</span>
      </div>
    </div>,
    size,
  );
}
