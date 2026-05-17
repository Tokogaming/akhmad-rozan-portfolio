import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Period = 7 | 30 | 365;

type CryptoAsset = {
  id: string;
  symbol: string;
  name: string;
  fallbackPriceUsd: number;
};

type ChartPoint = {
  timestamp: number;
  price: number;
};

const cryptoAssets: Record<string, CryptoAsset> = {
  bitcoin: {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    fallbackPriceUsd: 78000,
  },
  ethereum: {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    fallbackPriceUsd: 2200,
  },
  solana: {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    fallbackPriceUsd: 86,
  },
  binancecoin: {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    fallbackPriceUsd: 655,
  },
};

function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPeriod(value: string | null): Period {
  const parsed = Number(value);

  if (parsed === 365) return 365;
  if (parsed === 30) return 30;

  return 7;
}

function getAsset(value: string | null): CryptoAsset {
  const requested = String(value ?? "bitcoin").toLowerCase();

  return cryptoAssets[requested] ?? cryptoAssets.bitcoin;
}

function getHeaders() {
  const headers: Record<string, string> = {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  };

  const apiKey = process.env.COINGECKO_API_KEY;

  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  return headers;
}

function normalizeCoinGeckoPrices(payload: unknown): ChartPoint[] {
  if (typeof payload !== "object" || payload === null) return [];

  const data = payload as {
    prices?: unknown;
  };

  if (!Array.isArray(data.prices)) return [];

  return data.prices
    .map((item) => {
      if (!Array.isArray(item)) {
        return {
          timestamp: 0,
          price: 0,
        };
      }

      return {
        timestamp: safeNumber(item[0]),
        price: safeNumber(item[1]),
      };
    })
    .filter((point) => point.timestamp > 0 && point.price > 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}

function samplePoints(points: ChartPoint[], maxPoints: number) {
  if (points.length <= maxPoints) return points;

  const result: ChartPoint[] = [];
  const step = (points.length - 1) / (maxPoints - 1);

  for (let index = 0; index < maxPoints; index += 1) {
    const pickedIndex = Math.round(index * step);
    const point = points[pickedIndex];

    if (point) {
      result.push(point);
    }
  }

  return result;
}

function getMaxPoints(days: Period) {
  if (days === 365) return 260;
  if (days === 30) return 180;

  return 140;
}

async function fetchCoinGeckoMarketChart(
  asset: CryptoAsset,
  days: Period
): Promise<ChartPoint[]> {
  const url = new URL(
    `https://api.coingecko.com/api/v3/coins/${asset.id}/market_chart`
  );

  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("days", String(days));
  url.searchParams.set("precision", "2");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: getHeaders(),
  });

  if (!response.ok) return [];

  const payload = await response.json();
  const points = normalizeCoinGeckoPrices(payload);

  if (points.length < 2) return [];

  return samplePoints(points, getMaxPoints(days));
}

async function fetchCoinGeckoRangeChart(
  asset: CryptoAsset,
  days: Period
): Promise<ChartPoint[]> {
  const now = Math.floor(Date.now() / 1000);
  const from = now - days * 24 * 60 * 60;

  const url = new URL(
    `https://api.coingecko.com/api/v3/coins/${asset.id}/market_chart/range`
  );

  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(now));
  url.searchParams.set("precision", "2");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: getHeaders(),
  });

  if (!response.ok) return [];

  const payload = await response.json();
  const points = normalizeCoinGeckoPrices(payload);

  if (points.length < 2) return [];

  return samplePoints(points, getMaxPoints(days));
}

async function fetchCurrentPrice(asset: CryptoAsset) {
  try {
    const url = new URL("https://api.coingecko.com/api/v3/simple/price");

    url.searchParams.set("ids", asset.id);
    url.searchParams.set("vs_currencies", "usd");

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: getHeaders(),
    });

    if (!response.ok) return asset.fallbackPriceUsd;

    const payload = await response.json();
    const data = payload as Record<string, { usd?: unknown } | undefined>;
    const price = safeNumber(data[asset.id]?.usd, asset.fallbackPriceUsd);

    return price > 0 ? price : asset.fallbackPriceUsd;
  } catch {
    return asset.fallbackPriceUsd;
  }
}

function createSeededRandom(seedText: string) {
  let seed = 0;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }

  return function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function getFallbackProfile(asset: CryptoAsset, days: Period) {
  if (asset.id === "bitcoin") {
    return {
      trend: days === 365 ? 0.32 : days === 30 ? -0.08 : -0.035,
      waveA: days === 365 ? 0.22 : days === 30 ? 0.09 : 0.035,
      waveB: days === 365 ? 0.08 : days === 30 ? 0.04 : 0.018,
      volatility: days === 365 ? 0.018 : days === 30 ? 0.012 : 0.008,
    };
  }

  if (asset.id === "ethereum") {
    return {
      trend: days === 365 ? 0.16 : days === 30 ? -0.11 : -0.05,
      waveA: days === 365 ? 0.26 : days === 30 ? 0.11 : 0.045,
      waveB: days === 365 ? 0.1 : days === 30 ? 0.05 : 0.02,
      volatility: days === 365 ? 0.022 : days === 30 ? 0.014 : 0.009,
    };
  }

  if (asset.id === "solana") {
    return {
      trend: days === 365 ? 0.42 : days === 30 ? 0.04 : -0.025,
      waveA: days === 365 ? 0.34 : days === 30 ? 0.14 : 0.055,
      waveB: days === 365 ? 0.14 : days === 30 ? 0.06 : 0.025,
      volatility: days === 365 ? 0.028 : days === 30 ? 0.018 : 0.011,
    };
  }

  return {
    trend: days === 365 ? 0.09 : days === 30 ? -0.03 : -0.015,
    waveA: days === 365 ? 0.16 : days === 30 ? 0.07 : 0.03,
    waveB: days === 365 ? 0.07 : days === 30 ? 0.035 : 0.016,
    volatility: days === 365 ? 0.016 : days === 30 ? 0.01 : 0.007,
  };
}

function smoothPoints(points: ChartPoint[], rounds = 2) {
  let result = points;

  for (let round = 0; round < rounds; round += 1) {
    result = result.map((point, index) => {
      const prev = result[index - 1]?.price ?? point.price;
      const next = result[index + 1]?.price ?? point.price;

      return {
        timestamp: point.timestamp,
        price: (prev + point.price * 2 + next) / 4,
      };
    });
  }

  return result;
}

function generateDistinctFallbackPoints(
  asset: CryptoAsset,
  days: Period,
  currentPrice: number
): ChartPoint[] {
  const now = Date.now();

  const count = days === 365 ? 220 : days === 30 ? 150 : 90;
  const intervalMs = (days * 24 * 60 * 60 * 1000) / Math.max(count - 1, 1);

  const random = createSeededRandom(`${asset.id}-${asset.symbol}-${days}`);
  const profile = getFallbackProfile(asset, days);

  const startMultiplier = Math.max(0.4, 1 - profile.trend);
  let runningPrice = currentPrice * startMultiplier;

  const rawPoints = Array.from({ length: count }, (_, index) => {
    const progress = count <= 1 ? 1 : index / (count - 1);
    const distanceFromCurrent = count - 1 - index;

    const longWave =
      Math.sin(progress * Math.PI * (2.1 + random() * 1.4)) * profile.waveA;

    const mediumWave =
      Math.cos(progress * Math.PI * (5.8 + random() * 2.2)) * profile.waveB;

    const noise = (random() - 0.5) * profile.volatility;
    const drift = profile.trend / count;

    runningPrice = runningPrice * (1 + drift + noise * 0.35);

    const shapedPrice =
      runningPrice * (1 + longWave + mediumWave + (random() - 0.5) * 0.008);

    return {
      timestamp: now - distanceFromCurrent * intervalMs,
      price: Math.max(shapedPrice, currentPrice * 0.28),
    };
  });

  const lastPrice = rawPoints[rawPoints.length - 1]?.price ?? currentPrice;
  const scale = lastPrice > 0 ? currentPrice / lastPrice : 1;

  const scaledPoints = rawPoints.map((point) => ({
    timestamp: point.timestamp,
    price: point.price * scale,
  }));

  return smoothPoints(scaledPoints, days === 365 ? 3 : 2);
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

  const asset = getAsset(searchParams.get("coin"));
  const days = getPeriod(searchParams.get("days"));

  let points: ChartPoint[] = [];
  let source = "";

  try {
    points = await fetchCoinGeckoMarketChart(asset, days);

    if (points.length >= 2) {
      source = "CoinGecko Market Chart";
    }
  } catch {
    points = [];
  }

  if (points.length < 2) {
    try {
      points = await fetchCoinGeckoRangeChart(asset, days);

      if (points.length >= 2) {
        source = "CoinGecko Range Chart Backup";
      }
    } catch {
      points = [];
    }
  }

  if (points.length < 2) {
    const currentPrice = await fetchCurrentPrice(asset);
    points = generateDistinctFallbackPoints(asset, days, currentPrice);
    source = "Distinct Market Trend Fallback";
  }

  return NextResponse.json(
    {
      success: true,
      coin: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      days,
      source,
      updatedAt: new Date().toISOString(),
      summary: getSummary(points),
      points,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}