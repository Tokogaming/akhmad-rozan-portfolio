"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AssetLogo from "@/components/AssetLogo";

type PortfolioAsset = {
  id: string;
  name: string;
  symbol: string;
  type: "crypto" | "stock";
  source: "CoinGecko" | "Manual";
  currentValueUsd: number;
  currentValueIdr: number;
  pnlPercent: number;
  allocationPercent: number;
};

type PortfolioResponse = {
  success: boolean;
  updatedAt: string;
  summary: {
    totalValueUsd: number;
    totalValueIdr: number;
    totalPnlUsd: number;
    totalPnlIdr: number;
    totalPnlPercent: number;
  };
  assets: PortfolioAsset[];
};

type ChartAsset = PortfolioAsset & {
  chartValue: number;
};

const chartColors = [
  "#facc15",
  "#8b5cf6",
  "#22c55e",
  "#38bdf8",
  "#fb7185",
  "#f97316",
  "#14b8a6",
];

function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function idr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function shortUsd(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function AllocationTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartAsset }>;
}) {
  if (!active || !payload?.length) return null;

  const asset = payload[0].payload;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0d14] p-4 shadow-2xl">
      <p className="font-black text-white">{asset.symbol}</p>
      <p className="mt-1 text-sm text-zinc-400">{asset.name}</p>

      <div className="mt-3 grid gap-1 text-sm">
        <p className="text-zinc-300">
          Allocation:{" "}
          <span className="font-black text-yellow-300">
            {asset.allocationPercent}%
          </span>
        </p>

        <p className="text-zinc-300">
          Value:{" "}
          <span className="font-black text-white">
            {usd(asset.currentValueUsd)}
          </span>
        </p>

        <p className="text-zinc-500">{idr(asset.currentValueIdr)}</p>
      </div>
    </div>
  );
}

function ValueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartAsset }>;
}) {
  if (!active || !payload?.length) return null;

  const asset = payload[0].payload;
  const positive = asset.pnlPercent >= 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0d14] p-4 shadow-2xl">
      <p className="font-black text-white">{asset.symbol}</p>
      <p className="mt-1 text-sm text-zinc-400">{asset.name}</p>

      <div className="mt-3 grid gap-1 text-sm">
        <p className="text-zinc-300">
          Value:{" "}
          <span className="font-black text-white">
            {usd(asset.currentValueUsd)}
          </span>
        </p>

        <p className="text-zinc-500">{idr(asset.currentValueIdr)}</p>

        <p className={positive ? "text-emerald-400" : "text-red-400"}>
          P/L: {positive ? "+" : ""}
          {asset.pnlPercent}%
        </p>
      </div>
    </div>
  );
}

export default function PortfolioAllocationCharts() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getPortfolio() {
    try {
      setError("");

      const response = await fetch("/api/portfolio", {
        cache: "no-store",
      });

      const result = (await response.json()) as PortfolioResponse;

      if (!result.success) {
        throw new Error("Failed to load portfolio allocation");
      }

      setData(result);
    } catch {
      setError("Chart portfolio gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPortfolio();

    const interval = setInterval(() => {
      getPortfolio();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo<ChartAsset[]>(() => {
    if (!data?.assets) return [];

    return [...data.assets]
      .sort((a, b) => b.currentValueUsd - a.currentValueUsd)
      .map((asset) => ({
        ...asset,
        chartValue: asset.currentValueUsd,
      }));
  }, [data]);

  if (loading) {
    return (
      <div className="glass mt-16 rounded-[32px] p-8 text-zinc-400">
        Loading allocation charts...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-16 rounded-[32px] border border-red-500/30 bg-red-500/10 p-8 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Real-Time Allocation Charts
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-5xl">
            Portfolio Distribution
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Donut chart dan bar chart ini membaca data langsung dari portfolio
            engine. Allocation akan berubah otomatis saat harga crypto bergerak.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-zinc-300">
          Total: {usd(data.summary.totalValueUsd)}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[32px] p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
                Donut Chart
              </p>

              <h3 className="mt-2 text-2xl font-black">Asset Allocation</h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-300">
              Live %
            </span>
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<AllocationTooltip />} />

                <Pie
                  data={chartData}
                  dataKey="allocationPercent"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  innerRadius={82}
                  outerRadius={130}
                  paddingAngle={3}
                  stroke="#05070d"
                  strokeWidth={3}
                >
                  {chartData.map((asset, index) => (
                    <Cell
                      key={asset.id}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {chartData.map((asset, index) => (
              <div
                key={asset.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <AssetLogo symbol={asset.symbol} size="xs" />
                    <span
                      className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-[#0b0d14]"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-black">{asset.symbol}</p>
                    <p className="text-xs text-zinc-500">{asset.type}</p>
                  </div>
                </div>

                <p className="text-sm font-black text-yellow-300">
                  {asset.allocationPercent}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
                Bar Chart
              </p>

              <h3 className="mt-2 text-2xl font-black">Value Breakdown</h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-300">
              USD Value
            </span>
          </div>

          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="symbol"
                  tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={shortUsd}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<ValueTooltip />} />

                <Bar dataKey="chartValue" radius={[14, 14, 0, 0]}>
                  {chartData.map((asset, index) => (
                    <Cell
                      key={asset.id}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm leading-6 text-zinc-400">
              Asset terbesar saat ini adalah{" "}
              <span className="font-black text-yellow-300">
                {chartData[0]?.symbol}
              </span>{" "}
              dengan value{" "}
              <span className="font-black text-white">
                {usd(chartData[0]?.currentValueUsd ?? 0)}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}