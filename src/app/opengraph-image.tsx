import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#05070d",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(124, 92, 255, 0.28)",
            filter: "blur(90px)",
            left: -160,
            top: -120,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(247, 201, 72, 0.22)",
            filter: "blur(90px)",
            right: -140,
            bottom: -160,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "70px",
            width: "68%",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 22,
                background: "#f7c948",
                color: "#111111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 900,
              }}
            >
              AR
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 900 }}>
                Akhmad Rozan
              </div>
              <div style={{ fontSize: 18, color: "#a1a1aa", marginTop: 6 }}>
                Content Creator & Digital Asset Enthusiast
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 76,
              lineHeight: 0.96,
              letterSpacing: "-4px",
              fontWeight: 900,
              maxWidth: 780,
            }}
          >
            Building Digital Influence Through Content, Crypto & Vision.
          </div>

          <div
            style={{
              marginTop: 34,
              fontSize: 24,
              lineHeight: 1.45,
              color: "#d4d4d8",
              maxWidth: 760,
            }}
          >
            Personal portfolio for content creation, crypto education, digital
            asset strategy, and long-term digital growth.
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 40,
            }}
          >
            {["YouTube", "Crypto", "BTC • ETH • SOL", "Portfolio"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#f7c948",
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            width: "32%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #f7c948, #8b5cf6, #22c55e)",
              padding: 8,
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#080a12",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 28,
                  background: "#f7c948",
                  color: "#111111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                  fontWeight: 900,
                  marginBottom: 20,
                }}
              >
                ₿
              </div>

              <div
                style={{
                  fontSize: 16,
                  color: "#a1a1aa",
                  letterSpacing: "7px",
                  fontWeight: 800,
                }}
              >
                CREATOR
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 48,
                  color: "#f7c948",
                  fontWeight: 900,
                }}
              >
                AR
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}