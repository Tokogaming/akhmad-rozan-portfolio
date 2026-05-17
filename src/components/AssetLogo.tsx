type AssetLogoProps = {
  symbol: string;
  size?: "xs" | "sm" | "md";
};

const assetStyles: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  BTC: {
    label: "₿",
    className: "bg-yellow-400 text-black",
  },
  ETH: {
    label: "Ξ",
    className: "bg-violet-500 text-white",
  },
  SOL: {
    label: "◎",
    className: "bg-gradient-to-br from-emerald-400 to-violet-500 text-white",
  },
  BNB: {
    label: "◆",
    className: "bg-yellow-400 text-black",
  },
  NVDA: {
    label: "NV",
    className: "bg-green-500 text-black",
  },
  AAPL: {
    label: "A",
    className: "bg-zinc-100 text-black",
  },
  MSFT: {
    label: "MS",
    className: "bg-sky-500 text-white",
  },
  QQQ: {
    label: "Q",
    className: "bg-indigo-500 text-white",
  },
};

const sizeClass = {
  xs: "h-8 w-8 text-[10px]",
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
};

export default function AssetLogo({ symbol, size = "sm" }: AssetLogoProps) {
  const style = assetStyles[symbol] ?? {
    label: symbol.slice(0, 2),
    className: "bg-zinc-700 text-white",
  };

  return (
    <div
      className={`${sizeClass[size]} ${style.className} flex shrink-0 items-center justify-center rounded-full font-black shadow-lg`}
      title={symbol}
    >
      {style.label}
    </div>
  );
}