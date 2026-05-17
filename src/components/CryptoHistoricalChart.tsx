"use client";

import { useEffect, useMemo, useState } from "react";
import AssetLogo from "./AssetLogo";

type Period = 7 | 30;

type CoinOption = {
  id: string;
  symbol: string;
  name: string;
};

type ChartPoint = {
  timestamp: number;
  price: number;
};

type Status = "idle" | "loading" | "success" | "error";

const coins: CoinOption[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeTimestamp(value: unknown, fallback: number) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return fallback;
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (!isRecord(payload)) return [];

  const directKeys = [
    "prices",
    "history",
    "data",
    "points",
    "chart",
    "marketData",
    "marketChart",
  ];

  for (const key of directKeys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }

    if (isRecord(value)) {
      const nested = extractArray(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizePoints(payload: unknown): ChartPoint[] {
  const rows = extractArray(payload);
  const fallbackStart = Date.now() - rows.length * 24 * 60 * 60 * 1000;

  return rows
    .map((item, index) => {
      const fallbackTimestamp = fallbackStart + index * 24 * 60 * 60 * 1000;

      if (Array.isArray(item)) {
        const timestamp = safeTimestamp(item[0], fallbackTimestamp);
        const price = safeNumber(item[1]);

        return {
          timestamp,
          price,
        };
      }

      if (isRecord(item)) {
        const rawTimestamp =
          item.timestamp ??
          item.time ??
          item.date ??
          item.x ??
          item.createdAt ??
          item.updatedAt;

        const rawPrice =
          item.priceUsd ??
          item.price ??
          item.value ??
          item.close ??
          item.y ??
          item.usd;

        return {
          timestamp: safeTimestamp(rawTimestamp, fallbackTimestamp),
          price: safeNumber(rawPrice),
        };
      }

      return {
        timestamp: fallbackTimestamp,
        price: 0,
      };
    })
    .filter((point) => Number.isFinite(point.timestamp) && point.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeNumber(value));
}

function formatDate(timestamp: number, period: Period) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: period === 7 ? "short" : "short",
  }).format(new Date(timestamp));
}

function getPriceDomain(points: ChartPoint[]) {
  const prices = points.map((point) => point.price);

  if (prices.length === 0) {
    return {
      minDomain: 0,
      maxDomain: 1,
      range: 1,
    };
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const rawRange = Math.max(maxPrice - minPrice, maxPrice * 0.015, 1);
  const padding = rawRange * 0.32;

  const minDomain = Math.max(0, minPrice - padding);
  const maxDomain = maxPrice + padding;
  const range = Math.max(maxDomain - minDomain, 1);

  return {
    minDomain,
    maxDomain,
    range,
  };
}

function getChartCoords(points: ChartPoint[]) {
  const viewWidth = 800;
  const plotLeft = 42;
  const plotRight = 34;
  const plotTop = 34;
  const plotBottom = 260;
  const plotWidth = viewWidth - plotLeft - plotRight;
  const plotHeight = plotBottom - plotTop;

  const domain = getPriceDomain(points);

  return points.map((point, index) => {
    const x =
      points.length === 1
        ? plotLeft + plotWidth / 2
        : plotLeft + (index / (points.length - 1)) * plotWidth;

    const y =
      plotBottom -
      ((point.price - domain.minDomain) / domain.range) * plotHeight;

    return {
      x,
      y,
    };
  });
}

function buildLinePath(points: ChartPoint[]) {
  const coords = getChartCoords(points);

  if (coords.length === 0) return "";

  if (coords.length === 1) {
    return `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
  }

  if (coords.length === 2) {
    return `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(
      2
    )} L ${coords[1].x.toFixed(2)} ${coords[1].y.toFixed(2)}`;
  }

  let path = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;

  for (let index = 1; index < coords.length - 1; index += 1) {
    const current = coords[index];
    const next = coords[index + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    path += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(
      2
    )} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  const last = coords[coords.length - 1];
  path += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;

  return path;
}

function buildAreaPath(points: ChartPoint[]) {
  const linePath = buildLinePath(points);
  const coords = getChartCoords(points);

  if (!linePath || coords.length === 0) return "";

  const first = coords[0];
  const last = coords[coords.length - 1];
  const plotBottom = 260;

  return `${linePath} L ${last.x.toFixed(2)} ${plotBottom} L ${first.x.toFixed(
    2
  )} ${plotBottom} Z`;
}

function getStats(points: ChartPoint[]) {
  if (points.length === 0) {
    return {
      current: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      isPositive: true,
    };
  }

  const prices = points.map((point) => point.price);
  const current = prices[prices.length - 1] ?? 0;
  const first = prices[0] ?? current;
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const changePercent = first > 0 ? ((current - first) / first) * 100 : 0;

  return {
    current,
    changePercent,
    high,
    low,
    isPositive: changePercent >= 0,
  };
}

function ChartSvg({
  points,
  period,
  selectedCoin,
}: {
  points: ChartPoint[];
  period: Period;
  selectedCoin: CoinOption;
}) {
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);
  const stats = getStats(points);
  const domain = getPriceDomain(points);

  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => {
    const value = domain.maxDomain - domain.range * ratio;
    const y = 34 + ratio * (260 - 34);

    return {
      y,
      value,
    };
  });

  const xTicks =
    points.length > 0
      ? [
          points[0],
          points[Math.floor(points.length * 0.33)],
          points[Math.floor(points.length * 0.66)],
          points[points.length - 1],
        ].filter(Boolean)
      : [];

  if (points.length === 0) {
    return (
      <div className="flex h-[330px] items-center justify-center rounded-3xl border border-white/10 bg-black/10 text-sm text-zinc-500 sm:h-[380px]">
        Historical data belum tersedia.
      </div>
    );
  }

  return (
    <div className="relative h-[330px] overflow-hidden rounded-3xl border border-white/10 bg-black/10 p-4 sm:h-[380px]">
      <svg
        className="h-full w-full"
        viewBox="0 0 800 310"
        role="img"
        aria-label={`${selectedCoin.name} historical price chart`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="historicalArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1="42"
              x2="766"
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            <text
              x="8"
              y={tick.y + 4}
              fill="rgba(212,212,216,0.68)"
              fontSize="12"
              fontWeight="700"
            >
              {formatCompactUsd(tick.value)}
            </text>
          </g>
        ))}

        {areaPath ? <path d={areaPath} fill="url(#historicalArea)" /> : null}

        {linePath ? (
          <path
            d={linePath}
            fill="none"
            stroke="#facc15"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {xTicks.map((point, index) => {
          const x =
            xTicks.length === 1
              ? 400
              : 42 + (index / (xTicks.length - 1)) * (800 - 42 - 34);

          return (
            <text
              key={`${point.timestamp}-${index}`}
              x={x}
              y="298"
              textAnchor={
                index === 0
                  ? "start"
                  : index === xTicks.length - 1
                  ? "end"
                  : "middle"
              }
              fill="rgba(212,212,216,0.62)"
              fontSize="12"
              fontWeight="700"
            >
              {formatDate(point.timestamp, period)}
            </text>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md sm:right-5 sm:top-5">
        <p className="text-xs text-zinc-500">Current</p>
        <p className="mt-1 text-sm font-black text-white">
          {formatUsd(stats.current)}
        </p>
      </div>
    </div>
  );
}

export default function CryptoHistoricalChart() {
  const [selectedCoinId, setSelectedCoinId] = useState(coins[0].id);
  const [period, setPeriod] = useState<Period>(7);
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const selectedCoin = useMemo(() => {
    return coins.find((coin) => coin.id === selectedCoinId) ?? coins[0];
  }, [selectedCoinId]);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        setStatus("loading");

        const response = await fetch(
          `/api/crypto-history?coin=${selectedCoin.id}&days=${period}`,
          {
            cache: "no-store",
          }
        );

        const payload = await response.json();
        const normalized = normalizePoints(payload);

        if (!isMounted) return;

        setPoints(normalized);
        setStatus("success");
      } catch {
        if (!isMounted) return;

        setPoints([]);
        setStatus("error");
      }
    }

    loadHistory();

    const interval = window.setInterval(loadHistory, 180000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [selectedCoin.id, period]);

  const stats = getStats(points);

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-300">
            Historical Crypto Chart
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            7D / 30D Market Movement
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Pantau pergerakan harga BTC, ETH, SOL, dan BNB dalam periode 7 hari
            atau 30 hari. Chart ini memakai data historical market dari API.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          {[7, 30].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item as Period)}
              className={`rounded-xl px-5 py-3 text-sm font-black transition ${
                period === item
                  ? "bg-yellow-300 text-black"
                  : "bg-white/[0.05] text-zinc-300 hover:bg-white/[0.08]"
              }`}
            >
              {item}D
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.32)] md:p-7">
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {coins.map((coin) => (
              <button
                key={coin.id}
                type="button"
                onClick={() => setSelectedCoinId(coin.id)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  selectedCoin.id === coin.id
                    ? "border-yellow-300/45 bg-yellow-300/10"
                    : "border-white/10 bg-white/[0.045] hover:bg-white/[0.075]"
                }`}
              >
                <AssetLogo symbol={coin.symbol} size="xs" />

                <span>
                  <span className="block text-sm font-black text-white">
                    {coin.symbol}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {coin.name}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
              <p className="text-xs text-zinc-500">Current</p>
              <p className="mt-1 text-sm font-black text-white">
                {formatUsd(stats.current)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
              <p className="text-xs text-zinc-500">Change</p>
              <p
                className={`mt-1 text-sm font-black ${
                  stats.isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stats.isPositive ? "+" : ""}
                {stats.changePercent.toFixed(2)}%
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
              <p className="text-xs text-zinc-500">High</p>
              <p className="mt-1 text-sm font-black text-white">
                {formatUsd(stats.high)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
              <p className="text-xs text-zinc-500">Low</p>
              <p className="mt-1 text-sm font-black text-white">
                {formatUsd(stats.low)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <AssetLogo symbol={selectedCoin.symbol} size="sm" />

          <div>
            <h3 className="text-2xl font-black text-white">
              {selectedCoin.name} Price Chart
            </h3>
            <p className="text-sm text-zinc-500">
              Period: {period} Days{" "}
              {status === "loading" ? "• Updating..." : null}
              {status === "error" ? "• Failed to load data" : null}
            </p>
          </div>
        </div>

        <ChartSvg
          points={points}
          period={period}
          selectedCoin={selectedCoin}
        />
      </div>
    </section>
  );
}