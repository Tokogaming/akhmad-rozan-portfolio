"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AssetLogo from "@/components/AssetLogo";

const coins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
] as const;

const ranges = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
] as const;

type CoinId = (typeof coins)[number]["id"];
type RangeValue = (typeof ranges)[number]["value"];

type HistoryPoint = {
  timestamp: number;
  date: string;
  priceUsd: number;
  priceIdr: number;
};

type HistoryResponse = {
  success: boolean;
  source: string;
  coin: {
    id: CoinId;
    name: string;
    symbol: string;
  };
  days: number;
  updatedAt: string;
  summary: {
    startPriceUsd: number;
    currentPriceUsd: number;
    highPriceUsd: number;
    lowPriceUsd: number;
    changeUsd: number;
    changePercent: number;
  };
  points: HistoryPoint[];
};

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

function shortDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function HistoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: HistoryPoint }>;
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0d14] p-4 shadow-2xl">
      <p className="font-black text-white">{shortDate(point.date)}</p>
      <p className="mt-2 text-sm text-zinc-300">
        USD: <span className="font-black">{usd(point.priceUsd)}</span>
      </p>
      <p className="mt-1 text-sm text-zinc-500">{idr(point.priceIdr)}</p>
    </div>
  );
}

export default function CryptoHistoricalChart() {
  const [coin, setCoin] = useState<CoinId>("bitcoin");
  const [range, setRange] = useState<RangeValue>("7");
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getHistory(selectedCoin = coin, selectedRange = range) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/crypto-history?coin=${selectedCoin}&days=${selectedRange}`,
        {
          cache: "no-store",
        }
      );

      const result = (await response.json()) as HistoryResponse;

      if (!result.success) {
        throw new Error("Failed to load crypto historical chart");
      }

      setData(result);
    } catch {
      setError("Historical chart gagal dimuat. Coba refresh beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getHistory(coin, range);
  }, [coin, range]);

  const selectedCoin = useMemo(
    () => coins.find((item) => item.id === coin) ?? coins[0],
    [coin]
  );

  const positive = (data?.summary.changePercent ?? 0) >= 0;

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Historical Crypto Chart
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-5xl">
            7D / 30D Market Movement
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Pantau pergerakan harga BTC, ETH, SOL, dan BNB dalam periode 7 hari
            atau 30 hari. Chart ini memakai data historical market dari API.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {ranges.map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className={
                range === item.value
                  ? "rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black"
                  : "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-zinc-300 transition hover:border-yellow-300/30"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-[34px] p-6">
        <div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="flex flex-wrap gap-3">
            {coins.map((item) => (
              <button
                key={item.id}
                onClick={() => setCoin(item.id)}
                className={
                  coin === item.id
                    ? "flex items-center gap-3 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3"
                    : "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-yellow-300/30"
                }
              >
                <AssetLogo symbol={item.symbol} size="xs" />

                <div className="text-left">
                  <p className="text-sm font-black text-white">{item.symbol}</p>
                  <p className="text-xs text-zinc-500">{item.name}</p>
                </div>
              </button>
            ))}
          </div>

          {data && (
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-zinc-500">Current</p>
                <p className="mt-1 font-black text-white">
                  {usd(data.summary.currentPriceUsd)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-zinc-500">Change</p>
                <p
                  className={
                    positive
                      ? "mt-1 font-black text-emerald-400"
                      : "mt-1 font-black text-red-400"
                  }
                >
                  {positive ? "+" : ""}
                  {data.summary.changePercent}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-zinc-500">High</p>
                <p className="mt-1 font-black text-white">
                  {usd(data.summary.highPriceUsd)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-zinc-500">Low</p>
                <p className="mt-1 font-black text-white">
                  {usd(data.summary.lowPriceUsd)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex items-center gap-3">
          <AssetLogo symbol={selectedCoin.symbol} size="sm" />

          <div>
            <h3 className="text-2xl font-black">
              {selectedCoin.name} Price Chart
            </h3>
            <p className="text-sm text-zinc-500">
              Period: {range === "7" ? "7 Days" : "30 Days"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-zinc-400">
            Loading historical chart...
          </div>
        ) : error || !data ? (
          <div className="flex h-[420px] items-center justify-center rounded-[28px] border border-red-500/30 bg-red-500/10 text-red-300">
            {error}
          </div>
        ) : (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.points}
                margin={{ top: 15, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={shortUsd}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />

                <Tooltip content={<HistoryTooltip />} />

                <Line
                  type="monotone"
                  dataKey="priceUsd"
                  stroke="#facc15"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{
                    r: 7,
                    fill: "#facc15",
                    stroke: "#05070d",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}