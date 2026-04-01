import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Ryan McGatha - Web Developer and AI Developer in Greenville, SC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #0f1117 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.08) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 16,
            background: "#e9eaed",
            marginBottom: 32,
            fontSize: 56,
            fontWeight: 900,
            color: "#0f1117",
          }}
        >
          R
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#e9eaed",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Ryan McGatha
        </div>

        <div
          style={{
            fontSize: 26,
            color: "#8b8fa3",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Web Developer & AI Developer
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            color: "#6b7084",
          }}
        >
          <span>Greenville, SC</span>
          <span style={{ margin: "0 8px" }}>•</span>
          <span>ryanm.info</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 700,
          }}
        >
          {["React", "Next.js", "Node.js", "Python", "TypeScript", "AI"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(233,234,237,0.15)",
                  color: "#a0a3b1",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
