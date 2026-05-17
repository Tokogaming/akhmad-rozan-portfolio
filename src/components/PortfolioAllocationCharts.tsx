"use client";

import { useEffect, useMemo, useState } from "react";
import AssetLogo from "./AssetLogo";

type PortfolioAsset = {
  id?: string;
  name?: string;
  symbol: string;
  type: "crypto" | "stock";
  source?: string;
  currentValueUsd: number;
  currentValueIdr?: number;
  pnlPercent?: number;
  allocationPercent?: number;
};

type PortfolioApiResponse = {
  success: boolean;
  assets?: PortfolioAsset[];
};

type PortfolioAllocationChartsProps = {
  assets?: PortfolioAsset[];
  data?: {
    assets?: PortfolioAsset[];
  };
  portfolio?: {
    assets?: PortfolioAsset[];
  };
  portfolioData?: {
    assets?: PortfolioAsset[];
  };
};

const colors = [
  "#facc15",
  "#8b5cf6",
  "#22c55e",
  "#38bdf8",
  "#fb7185",
  "#f97316",
  "#2dd4bf",
  "#94a3b8",
];

function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

function resolveAssets(props: PortfolioAllocationChartsProps) {
  return (
    props.assets ??
    props.data?.assets ??
    props.portfolio?.assets ??
    props.portfolioData?.assets ??
    []
  );
}

function getDisplayAssets(assets: PortfolioAsset[]) {
  const cleaned = assets
    .map((asset, index) => {
      const currentValueUsd = safeNumber(asset.currentValueUsd);

      return {
        ...asset,
        id: asset.id ?? asset.symbol.toLowerCase(),
        name: asset.name ?? asset.symbol,
        currentValueUsd,
        allocationPercent: safeNumber(asset.allocationPercent),
        color: colors[index % colors.length],
      };
    })
    .filter((asset) => asset.currentValueUsd > 0)
    .sort((a, b) => b.currentValueUsd - a.currentValueUsd);

  const totalValue = cleaned.reduce(
    (sum, asset) => sum + asset.currentValueUsd,
    0
  );

  return cleaned.map((asset) => ({
    ...asset,
    allocationPercent:
      totalValue > 0
        ? asset.allocationPercent > 0
          ? asset.allocationPercent
          : (asset.currentValueUsd / totalValue) * 100
        : 0,
  }));
}

function DonutChart({
  assets,
}: {
  assets: ReturnType<typeof getDisplayAssets>;
}) {
  const radius = 78;
  const strokeWidth = 22;
  const center = 110;
  const circumference = 2 * Math.PI * radius;

  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.currentValueUsd,
    0
  );

  let offset = 0;

  if (assets.length === 0 || totalValue <= 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-sm text-zinc-500">
        Loading allocation data...
      </div>
    );
  }

  return (
    <div className="flex h-[300px] items-center justify-center">
      <svg
        width="260"
        height="260"
        viewBox="0 0 220 220"
        role="img"
        aria-label="Asset allocation donut chart"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />

        {assets.map((asset) => {
          const percent =
            totalValue > 0 ? asset.currentValueUsd / totalValue : 0;

          const dash = Math.max(0, percent * circumference);
          const gap = Math.max(0, circumference - dash);
          const dashOffset = -offset;

          offset += dash;

          return (
            <circle
              key={asset.id}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={asset.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${center} ${center})`}
            />
          );
        })}

        <circle cx={center} cy={center} r="52" fill="#11141d" />

        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="18"
          fontWeight="900"
        >
          {assets[0]?.symbol ?? "ASSET"}
        </text>

        <text
          x={center}
          y={center + 18}
          textAnchor="middle"
          fill="#a1a1aa"
          fontSize="10"
          fontWeight="700"
        >
          Top Allocation
        </text>
      </svg>
    </div>
  );
}

function BarChart({
  assets,
}: {
  assets: ReturnType<typeof getDisplayAssets>;
}) {
  const maxValue = Math.max(
    ...assets.map((asset) => asset.currentValueUsd),
    1
  );

  const topAsset = assets[0];

  if (assets.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-sm text-zinc-500">
        Loading value breakdown...
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-black/10 px-5 pb-12 pt-8">
        <div className="pointer-events-none absolute inset-x-5 top-8 h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-5 top-[35%] h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-5 top-[62%] h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-5 bottom-12 h-px bg-white/10" />

        <div className="relative z-10 flex h-full items-end gap-3">
          {assets.map((asset) => {
            const barPercent =
              maxValue > 0 ? (asset.currentValueUsd / maxValue) * 100 : 0;

            const heightPercent = Math.min(
              100,
              Math.max(5, safeNumber(barPercent))
            );

            return (
              <div
                key={asset.id}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  className="w-full max-w-[58px] rounded-t-2xl shadow-lg"
                  style={{
                    height: `${heightPercent}%`,
                    background: asset.color,
                  }}
                  title={`${asset.symbol}: ${formatUsd(
                    asset.currentValueUsd
                  )}`}
                />

                <div className="text-center text-xs font-black text-zinc-300">
                  {asset.symbol}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {topAsset ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm leading-7 text-zinc-400">
          Asset terbesar saat ini adalah{" "}
          <span className="font-black text-yellow-300">{topAsset.symbol}</span>{" "}
          dengan value{" "}
          <span className="font-black text-white">
            {formatUsd(topAsset.currentValueUsd)}
          </span>
          .
        </div>
      ) : null}
    </>
  );
}

export default function PortfolioAllocationCharts(
  props: PortfolioAllocationChartsProps
) {
  const propAssets = resolveAssets(props);
  const [apiAssets, setApiAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(propAssets.length === 0);

  useEffect(() => {
    if (propAssets.length > 0) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPortfolioAssets() {
      try {
        const response = await fetch("/api/portfolio", {
          cache: "no-store",
        });

        const data = (await response.json()) as PortfolioApiResponse;

        if (!isMounted) return;

        if (data.success && Array.isArray(data.assets)) {
          setApiAssets(data.assets);
        }
      } catch {
        if (!isMounted) return;
        setApiAssets([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolioAssets();

    const interval = window.setInterval(loadPortfolioAssets, 180000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [propAssets.length]);

  const rawAssets = propAssets.length > 0 ? propAssets : apiAssets;

  const displayAssets = useMemo(() => {
    return getDisplayAssets(rawAssets);
  }, [rawAssets]);

  const totalValue = displayAssets.reduce(
    (sum, asset) => sum + asset.currentValueUsd,
    0
  );

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-300">
            Portfolio Allocation
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
            Live Allocation Breakdown
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Donut chart dan bar chart membaca data langsung dari portfolio
            engine. Allocation berubah otomatis saat harga crypto dan saham US
            bergerak.
          </p>
        </div>

        <div className="w-fit rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white">
          {isLoading ? "Loading..." : `Total: ${formatUsd(totalValue)}`}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                Donut Chart
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Asset Allocation
              </h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-zinc-300">
              Live %
            </span>
          </div>

          <DonutChart assets={displayAssets} />

          {displayAssets.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {displayAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative">
                      <AssetLogo symbol={asset.symbol} size="sm" />
                      <span
                        className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-[#151823]"
                        style={{ background: asset.color }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-white">
                        {asset.symbol}
                      </p>
                      <p className="text-xs capitalize text-zinc-500">
                        {asset.type}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-black text-yellow-300">
                    {safeNumber(asset.allocationPercent).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                Bar Chart
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Value Breakdown
              </h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-zinc-300">
              USD Value
            </span>
          </div>

          <BarChart assets={displayAssets} />
        </div>
      </div>
    </section>
  );
}