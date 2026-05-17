"use client";

import {
  SiApple,
  SiBinance,
  SiBitcoin,
  SiEthereum,
  SiNvidia,
  SiSolana,
} from "react-icons/si";

type AssetLogoProps = {
  symbol: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const boxSizes = {
  xs: 26,
  sm: 38,
  md: 48,
  lg: 58,
};

const iconSizes = {
  xs: 14,
  sm: 20,
  md: 26,
  lg: 32,
};

function getLogoTheme(symbolRaw: string) {
  const symbol = symbolRaw.toUpperCase();

  switch (symbol) {
    case "BTC":
      return {
        bg: "#f7931a",
        iconColor: "#ffffff",
        border: "1px solid rgba(247, 147, 26, 0.45)",
        shadow: "0 12px 30px rgba(247, 147, 26, 0.22)",
      };

    case "ETH":
      return {
        bg: "linear-gradient(135deg, #627eea 0%, #8b5cf6 100%)",
        iconColor: "#ffffff",
        border: "1px solid rgba(139, 92, 246, 0.45)",
        shadow: "0 12px 30px rgba(98, 126, 234, 0.22)",
      };

    case "SOL":
      return {
        bg: "linear-gradient(135deg, #00ffa3 0%, #03e1ff 45%, #dc1fff 100%)",
        iconColor: "#ffffff",
        border: "1px solid rgba(3, 225, 255, 0.35)",
        shadow: "0 12px 30px rgba(3, 225, 255, 0.18)",
      };

    case "BNB":
      return {
        bg: "#f3ba2f",
        iconColor: "#111111",
        border: "1px solid rgba(243, 186, 47, 0.45)",
        shadow: "0 12px 30px rgba(243, 186, 47, 0.2)",
      };

    case "NVDA":
      return {
        bg: "#76b900",
        iconColor: "#ffffff",
        border: "1px solid rgba(118, 185, 0, 0.45)",
        shadow: "0 12px 30px rgba(118, 185, 0, 0.2)",
      };

    case "AAPL":
      return {
        bg: "#f5f5f7",
        iconColor: "#111111",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        shadow: "0 12px 30px rgba(255, 255, 255, 0.12)",
      };

    case "MSFT":
      return {
        bg: "#f5f5f7",
        iconColor: "#111111",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        shadow: "0 12px 30px rgba(255, 255, 255, 0.12)",
      };

    case "QQQ":
      return {
        bg: "linear-gradient(135deg, #3547ff 0%, #7c3aed 100%)",
        iconColor: "#ffffff",
        border: "1px solid rgba(124, 58, 237, 0.45)",
        shadow: "0 12px 30px rgba(99, 102, 241, 0.18)",
      };

    default:
      return {
        bg: "#272b35",
        iconColor: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        shadow: "0 12px 26px rgba(0, 0, 0, 0.22)",
      };
  }
}

function MicrosoftLogo({ size }: { size: number }) {
  const square = Math.max(7, Math.floor(size / 3));
  const gap = Math.max(2, Math.floor(size / 9));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${square}px ${square}px`,
        gridTemplateRows: `${square}px ${square}px`,
        gap: `${gap}px`,
      }}
      aria-hidden="true"
    >
      <span style={{ width: square, height: square, background: "#f25022" }} />
      <span style={{ width: square, height: square, background: "#7fba00" }} />
      <span style={{ width: square, height: square, background: "#00a4ef" }} />
      <span style={{ width: square, height: square, background: "#ffb900" }} />
    </div>
  );
}

function renderSymbolIcon(symbolRaw: string, size: number, color: string) {
  const symbol = symbolRaw.toUpperCase();

  switch (symbol) {
    case "BTC":
      return <SiBitcoin size={size} color={color} />;

    case "ETH":
      return <SiEthereum size={size} color={color} />;

    case "SOL":
      return <SiSolana size={size} color={color} />;

    case "BNB":
      return <SiBinance size={size} color={color} />;

    case "NVDA":
      return <SiNvidia size={size} color={color} />;

    case "AAPL":
      return <SiApple size={size} color={color} />;

    case "MSFT":
      return <MicrosoftLogo size={size} />;

    case "QQQ":
      return (
        <span
          style={{
            fontSize: `${Math.max(14, size - 5)}px`,
            fontWeight: 950,
            lineHeight: 1,
            color,
            letterSpacing: "-0.08em",
          }}
        >
          Q
        </span>
      );

    default:
      return (
        <span
          style={{
            fontSize: `${Math.max(13, size - 6)}px`,
            fontWeight: 900,
            lineHeight: 1,
            color,
          }}
        >
          {symbol.slice(0, 2)}
        </span>
      );
  }
}

export default function AssetLogo({
  symbol,
  size = "md",
  className = "",
}: AssetLogoProps) {
  const box = boxSizes[size];
  const icon = iconSizes[size];
  const theme = getLogoTheme(symbol);

  return (
    <div
      className={className}
      title={symbol}
      aria-label={`${symbol} logo`}
      style={{
        width: `${box}px`,
        height: `${box}px`,
        minWidth: `${box}px`,
        minHeight: `${box}px`,
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.bg,
        border: theme.border,
        boxShadow: theme.shadow,
        color: theme.iconColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 32% 22%, rgba(255,255,255,0.24), transparent 42%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderSymbolIcon(symbol, icon, theme.iconColor)}
      </div>
    </div>
  );
}