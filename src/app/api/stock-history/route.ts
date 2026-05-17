import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = 7 | 30;

type StockAsset = {
  symbol: string;
  name: string;
  fallbackPriceUsd: number;
};

type ChartPoint = {
  timestamp: number;
  price: number;
};

const stockAssets: Record<string, StockAsset> = {
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    fallbackPriceUsd: 225.32,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    fallbackPriceUsd: 300.23,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    fallbackPriceUsd: 421.92,
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    fallbackPriceUsd: 708.93,
  },
};

function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPeriod(value: string | null): Period {
  const parsed = Number(value);

  if (parsed === 30) return 30;

  return 7;
}

function getStock(value: string | null): StockAsset {
  const requested = String(value ?? "NVDA").toUpperCase();

  return stockAssets[requested] ?? stockAssets.NVDA;
}

function getUnixSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

function normalizeYahooChart(payload: unknown): ChartPoint[] {
  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const root = payload as {
    chart?: {
      result?: Array<{
        timestamp?: unknown;
        indicators?: {
          quote?: Array<{
            close?: unknown;
          }>;
        };
      }>;
    };
  };

  const result = root.chart?.result?.[0];

  if (!result) {
    return [];
  }

  const timestamps = result.timestamp;
  const closes = result.indicators?.quote?.[0]?.close;

  if (!Array.isArray(timestamps) || !Array.isArray(closes)) {
    return [];
  }

  return timestamps
    .map((timestamp, index) => {
      const timestampSeconds = safeNumber(timestamp);
      const price = safeNumber(closes[index]);

      return {
        timestamp: timestampSeconds * 1000,
        price,
      };
    })
    .filter((point) => point.timestamp > 0 && point.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

async function fetchYahooChart(
  stock: StockAsset,
  days: Period
): Promise<ChartPoint[]> {
  /*
    7D pakai hourly agar bentuk chart hidup.
    30D pakai daily agar ringan dan stabil.
  */
  const range = days === 7 ? "7d" : "1mo";
  const interval = days === 7 ? "1h" : "1d";

  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}`
  );

  url.searchParams.set("range", range);
  url.searchParams.set("interval", interval);
  url.searchParams.set("includePrePost", "true");
  url.searchParams.set("events", "div,splits");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      accept: "application/json",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  const points = normalizeYahooChart(payload);

  if (points.length < 2) {
    return [];
  }

  return days === 7 ? points.slice(-90) : points.slice(-30);
}

function normalizeFinnhubCandles(payload: unknown): ChartPoint[] {
  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const data = payload as {
    s?: unknown;
    c?: unknown;
    t?: unknown;
  };

  if (data.s !== "ok") {
    return [];
  }

  if (!Array.isArray(data.c) || !Array.isArray(data.t)) {
    return [];
  }

  const closes = data.c;
  const timestamps = data.t;

  return closes
    .map((close, index) => {
      const price = safeNumber(close);
      const timestampSeconds = safeNumber(timestamps[index]);

      return {
        timestamp: timestampSeconds * 1000,
        price,
      };
    })
    .filter((point) => point.timestamp > 0 && point.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

async function fetchFinnhubCandles(
  stock: StockAsset,
  days: Period
): Promise<ChartPoint[]> {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return [];
  }

  const now = new Date();
  const fromDate = new Date(now);

  if (days === 7) {
    fromDate.setDate(fromDate.getDate() - 10);
  } else {
    fromDate.setDate(fromDate.getDate() - 45);
  }

  const resolution = days === 7 ? "60" : "D";

  const url = new URL("https://finnhub.io/api/v1/stock/candle");
  url.searchParams.set("symbol", stock.symbol);
  url.searchParams.set("resolution", resolution);
  url.searchParams.set("from", String(getUnixSeconds(fromDate)));
  url.searchParams.set("to", String(getUnixSeconds(now)));
  url.searchParams.set("token", apiKey);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  const points = normalizeFinnhubCandles(payload);

  if (points.length < 2) {
    return [];
  }

  return days === 7 ? points.slice(-90) : points.slice(-30);
}

async function fetchQuotePrice(stock: StockAsset) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return stock.fallbackPriceUsd;
  }

  try {
    const url = new URL("https://finnhub.io/api/v1/quote");
    url.searchParams.set("symbol", stock.symbol);
    url.searchParams.set("token", apiKey);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return stock.fallbackPriceUsd;
    }

    const payload = await response.json();
    const currentPrice = safeNumber(payload?.c, stock.fallbackPriceUsd);

    return currentPrice > 0 ? currentPrice : stock.fallbackPriceUsd;
  } catch {
    return stock.fallbackPriceUsd;
  }
}

function generateFallbackPoints(
  stock: StockAsset,
  days: Period,
  currentPrice: number
): ChartPoint[] {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  /*
    Ini fallback terakhir saja.
    Polanya dibuat beda per ticker supaya tidak semua stock terlihat sama.
  */
  const count = days === 7 ? 56 : 30;

  const seed =
    stock.symbol
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0) % 23;

  const stockProfile =
    stock.symbol === "NVDA"
      ? { trend: 0.038, wave: 0.028, pulse: 0.022 }
      : stock.symbol === "AAPL"
      ? { trend: 0.012, wave: 0.018, pulse: 0.012 }
      : stock.symbol === "MSFT"
      ? { trend: 0.02, wave: 0.015, pulse: 0.018 }
      : { trend: 0.016, wave: 0.014, pulse: 0.011 };

  return Array.from({ length: count }, (_, index) => {
    const progress = count <= 1 ? 1 : index / (count - 1);
    const distanceFromCurrent = count - 1 - index;

    const trend = stockProfile.trend * (progress - 1);
    const waveOne = Math.sin((index + seed) * 0.58) * stockProfile.wave;
    const waveTwo = Math.cos((index + seed) * 1.13) * stockProfile.pulse;
    const marketNoise = Math.sin((index + seed) * 2.05) * 0.006;

    const multiplier = 1 + trend + waveOne + waveTwo + marketNoise;
    const price = currentPrice * multiplier;

    return {
      timestamp:
        days === 7
          ? now - distanceFromCurrent * 3 * oneHour
          : now - distanceFromCurrent * oneDay,
      price: Math.max(price, currentPrice * 0.6),
    };
  });
}

function getSummary(points: ChartPoint[]) {
  if (points.length === 0) {
    return {
      current: 0,
      first: 0,
      high: 0,
      low: 0,
      changePercent: 0,
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
    high,
    low,
    changePercent,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const stock = getStock(searchParams.get("symbol"));
  const days = getPeriod(searchParams.get("days"));

  let points: ChartPoint[] = [];
  let source = "Yahoo Finance Chart";

  try {
    points = await fetchYahooChart(stock, days);
  } catch {
    points = [];
  }

  if (points.length < 2) {
    try {
      points = await fetchFinnhubCandles(stock, days);
      source = "Finnhub Stock Candles";
    } catch {
      points = [];
    }
  }

  if (points.length < 2) {
    const currentPrice = await fetchQuotePrice(stock);

    points = generateFallbackPoints(stock, days, currentPrice);
    source = "Market Trend Fallback";
  }

  const summary = getSummary(points);

  return NextResponse.json(
    {
      success: true,
      symbol: stock.symbol,
      name: stock.name,
      days,
      source,
      updatedAt: new Date().toISOString(),
      summary,
      points,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}