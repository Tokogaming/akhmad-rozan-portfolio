type AssetLogoProps = {
  symbol: string;
  size?: "xs" | "sm" | "md" | "lg";
};

const logoMap: Record<
  string,
  {
    label: string;
    background: string;
    color: string;
  }
> = {
  BTC: {
    label: "₿",
    background: "linear-gradient(135deg, #f7931a, #facc15)",
    color: "#111111",
  },
  ETH: {
    label: "Ξ",
    background: "linear-gradient(135deg, #627eea, #8b5cf6)",
    color: "#ffffff",
  },
  SOL: {
    label: "◎",
    background: "linear-gradient(135deg, #14f195, #9945ff)",
    color: "#ffffff",
  },
  BNB: {
    label: "◆",
    background: "linear-gradient(135deg, #f3ba2f, #facc15)",
    color: "#111111",
  },
  NVDA: {
    label: "NV",
    background: "linear-gradient(135deg, #76b900, #22c55e)",
    color: "#071107",
  },
  BBCA: {
    label: "BCA",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "#ffffff",
  },
  BBRI: {
    label: "BRI",
    background: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    color: "#ffffff",
  },
};

const sizeMap = {
  xs: "h-8 w-8 text-[10px]",
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

export default function AssetLogo({ symbol, size = "md" }: AssetLogoProps) {
  const logo = logoMap[symbol] ?? {
    label: symbol.slice(0, 3),
    background: "linear-gradient(135deg, #27272a, #52525b)",
    color: "#ffffff",
  };

  return (
    <div
      className={`${sizeMap[size]} flex shrink-0 items-center justify-center rounded-2xl font-black shadow-lg`}
      style={{
        background: logo.background,
        color: logo.color,
        boxShadow: "0 14px 35px rgba(0,0,0,0.28)",
      }}
      aria-label={`${symbol} logo`}
      title={symbol}
    >
      {logo.label}
    </div>
  );
}