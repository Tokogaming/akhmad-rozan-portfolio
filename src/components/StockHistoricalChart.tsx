"use client";

import { useEffect, useMemo, useState } from "react";
import AssetLogo from "./AssetLogo";

type Period = 7 | 30 | 365;

type StockOption = {
  symbol: string;
  name: string;
};

type ChartPoint = {
  timestamp: number;
  price: number;
};

type ApiResponse = {
  success: boolean;
  symbol: string;
  name: string;
  days: Period;
  source: string;
  points: ChartPoint[];
};

type Status = "idle" | "loading" | "success" | "error";

const stocks: StockOption[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "QQQ", name: "Invesco QQQ Trust" },
];

const periodOptions: Array<{ value: Period; label: string }> = [
  { value: 7, label: "7D" },
  { value: 30, label: "30D" },
  { value: 365, label: "1Y" },
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

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeNumber(value));
}

function formatDate(timestamp: number, period: Period) {
  if (period === 365) {
    return new Intl.DateTimeFormat("id-ID", {
      month: "short",
      year: "2-digit",
    }).format(new Date(timestamp));
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}

function normalizePoints(points: ChartPoint[]) {
  return points
    .map((point) => ({
      timestamp: safeNumber(point.timestamp),
      price: safeNumber(point.price),
    }))
    .filter((point) => point.timestamp > 0 && point.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
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
  const rawRange = Math.max(maxPrice - minPrice, maxPrice * 0.012, 1);
  const padding = rawRange * 0.24;

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
  const viewWidth = 900;
  const plotLeft = 58;
  const plotRight = 34;
  const plotTop = 34;
  const plotBottom = 280;
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

  return coords
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";

      return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points: ChartPoint[]) {
  const linePath = buildLinePath(points);
  const coords = getChartCoords(points);

  if (!linePath || coords.length === 0) return "";

  const first = coords[0];
  const last = coords[coords.length - 1];
  const plotBottom = 280;

  return `${linePath} L ${last.x.toFixed(2)} ${plotBottom} L ${first.x.toFixed(
    2
  )} ${plotBottom} Z`;
}

function getStats(points: ChartPoint[]) {
  if (points.length === 0) {
    return {
      current: 0,
      first: 0,
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
    first,
    changePercent,
    high,
    low,
    isPositive: changePercent >= 0,
  };
}

function ChartSvg({
  points,
  period,
  selectedStock,
}: {
  points: ChartPoint[];
  period: Period;
  selectedStock: StockOption;
}) {
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);
  const domain = getPriceDomain(points);
  const stats = getStats(points);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = domain.maxDomain - domain.range * ratio;
    const y = 34 + ratio * (280 - 34);

    return {
      y,
      value,
    };
  });

  const xTickCount = period === 365 ? 6 : 4;
const xTicks =
  points.length > 0
    ? Array.from({ length: xTickCount }, (_, index) => {
        const pickedIndex = Math.round(
          (index / Math.max(xTickCount - 1, 1)) * (points.length - 1)
        );

        return points[pickedIndex];
      }).filter(Boolean)
    : [];

  if (points.length === 0) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-3xl border border-white/10 bg-black/10 text-sm text-zinc-500 sm:h-[410px]">
        Stock historical data belum tersedia.
      </div>
    );
  }

  return (
    <div className="relative h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-black/10 p-4 sm:h-[410px]">
      <svg
        className="h-full w-full"
        viewBox="0 0 900 330"
        role="img"
        aria-label={`${selectedStock.name} stock historical chart`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="stockArea41F" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1="58"
              x2="866"
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(255,255,255,0.075)"
              strokeWidth="1"
            />
            <text
              x="8"
              y={tick.y + 4}
              fill="rgba(212,212,216,0.72)"
              fontSize="12"
              fontWeight="800"
            >
              {formatCompactUsd(tick.value)}
            </text>
          </g>
        ))}

        {areaPath ? <path d={areaPath} fill="url(#stockArea41F)" /> : null}

        {linePath ? (
          <path
            d={linePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {xTicks.map((point, index) => {
          const x =
            xTicks.length === 1
              ? 450
              : 58 + (index / (xTicks.length - 1)) * (900 - 58 - 34);

          return (
            <text
              key={`${point.timestamp}-${index}`}
              x={x}
              y="318"
              textAnchor={
                index === 0
                  ? "start"
                  : index === xTicks.length - 1
                  ? "end"
                  : "middle"
              }
              fill="rgba(212,212,216,0.62)"
              fontSize="12"
              fontWeight="800"
            >
              {formatDate(point.timestamp, period)}
            </text>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
        <p className="text-xs text-zinc-500">Current</p>
        <p className="mt-1 text-sm font-black text-white">
          {formatUsd(stats.current)}
        </p>
      </div>
    </div>
  );
}

export default function StockHistoricalChart() {
  const [selectedSymbol, setSelectedSymbol] = useState("NVDA");
  const [period, setPeriod] = useState<Period>(7);
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const selectedStock = useMemo(() => {
    return stocks.find((stock) => stock.symbol === selectedSymbol) ?? stocks[0];
  }, [selectedSymbol]);

  useEffect(() => {
    let isMounted = true;

    async function loadStockHistory() {
      try {
        setStatus("loading");

        const response = await fetch(
          `/api/stock-history?symbol=${selectedStock.symbol}&days=${period}`,
          {
            cache: "no-store",
          }
        );

        const data = (await response.json()) as ApiResponse;

        if (!isMounted) return;

        if (data.success && Array.isArray(data.points)) {
          setPoints(normalizePoints(data.points));
          setSource(data.source ?? "");
          setStatus("success");
        } else {
          setPoints([]);
          setSource("");
          setStatus("error");
        }
      } catch {
        if (!isMounted) return;

        setPoints([]);
        setSource("");
        setStatus("error");
      }
    }

    loadStockHistory();

    const interval = window.setInterval(loadStockHistory, 180000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [selectedStock.symbol, period]);

  const stats = getStats(points);

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-400">
            Historical US Stock Chart
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            7D / 30D / 1Y US Stock Movement
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Pantau pergerakan NVDA, AAPL, MSFT, dan QQQ. Mode 1Y membuat
            struktur trend saham terlihat lebih jelas dan tidak terlalu datar.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          {periodOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`rounded-xl px-5 py-3 text-sm font-black transition ${
                period === item.value
                  ? "bg-emerald-400 text-black"
                  : "bg-white/[0.05] text-zinc-300 hover:bg-white/[0.08]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.32)] md:p-7">
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => setSelectedSymbol(stock.symbol)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  selectedStock.symbol === stock.symbol
                    ? "border-emerald-400/45 bg-emerald-400/10"
                    : "border-white/10 bg-white/[0.045] hover:bg-white/[0.075]"
                }`}
              >
                <AssetLogo symbol={stock.symbol} size="xs" />

                <span>
                  <span className="block text-sm font-black text-white">
                    {stock.symbol}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {stock.name}
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

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AssetLogo symbol={selectedStock.symbol} size="sm" />

            <div>
              <h3 className="text-2xl font-black text-white">
                {selectedStock.symbol} Stock Price Chart
              </h3>
              <p className="text-sm text-zinc-500">
                Period: {period === 365 ? "1 Year" : `${period} Days`}{" "}
                {status === "loading" ? "• Updating..." : null}
                {status === "error" ? "• Failed to load data" : null}
              </p>
            </div>
          </div>

          {source ? (
            <div className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-zinc-300">
              Source: {source}
            </div>
          ) : null}
        </div>

        <ChartSvg
          points={points}
          period={period}
          selectedStock={selectedStock}
        />
      </div>
    </section>
  );
}