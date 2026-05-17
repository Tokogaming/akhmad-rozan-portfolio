import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type AllowedSymbol = "NVDA" | "AAPL" | "MSFT" | "QQQ";

type StockConfig = {
  symbol: AllowedSymbol;
  name: string;
  fallbackPrice: number;
};

type StockPoint = {
  timestamp: number;
  price: number;
};

const stocks: Record<AllowedSymbol, StockConfig> = {
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    fallbackPrice: Number(process.env.NVDA_FALLBACK_PRICE_USD ?? 225.32),
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    fallbackPrice: Number(process.env.AAPL_FALLBACK_PRICE_USD ?? 300.23),
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    fallbackPrice: Number(process.env.MSFT_FALLBACK_PRICE_USD ?? 421.92),
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    fallbackPrice: Number(process.env.QQQ_FALLBACK_PRICE_USD ?? 708.93),
  },
};

function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSymbol(value: string | null): AllowedSymbol {
  const symbol = String(value ?? "NVDA").toUpperCase();

  if (symbol === "AAPL") return "AAPL";
  if (symbol === "MSFT") return "MSFT";
  if (symbol === "QQQ") return "QQQ";

  return "NVDA";
}

function normalizeDays(value: string | null): 7 | 30 {
  const days = Number(value);
  return days === 30 ? 30 : 7;
}

function createFallbackHistory(
  fallbackPrice: number,
  days: 7 | 30,
  symbol: AllowedSymbol
): StockPoint[] {
  const now = Date.now();
  const totalPoints = days;
  const base = safeNumber(fallbackPrice, 100);

  const symbolSeed =
    symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) / 100;

  return Array.from({ length: totalPoints }, (_, index) => {
    const reverseIndex = totalPoints - 1 - index;
    const timestamp = now - reverseIndex * 24 * 60 * 60 * 1000;

    const waveA = Math.sin(index * 0.58 + symbolSeed) * 0.018;
    const waveB = Math.cos(index * 0.31 + symbolSeed) * 0.012;
    const trend = ((index - totalPoints / 2) / totalPoints) * 0.035;

    const price = base * (1 + waveA + waveB + trend);

    return {
      timestamp,
      price: Number(price.toFixed(2)),
    };
  });
}

async function fetchFinnhubCandles(
  symbol: AllowedSymbol,
  days: 7 | 30
): Promise<StockPoint[]> {
  const token = process.env.FINNHUB_API_KEY;

  if (!token) {
    return [];
  }

  const now = Math.floor(Date.now() / 1000);
  const bufferDays = days === 7 ? 12 : 45;
  const from = now - bufferDays * 24 * 60 * 60;

  const url = new URL("https://finnhub.io/api/v1/stock/candle");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("resolution", "D");
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(now));
  url.searchParams.set("token", token);

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  if (!data || data.s !== "ok" || !Array.isArray(data.c) || !Array.isArray(data.t)) {
    return [];
  }

  const points = data.c
    .map((closePrice: unknown, index: number) => {
      const rawTimestamp = data.t[index];
      const timestamp = safeNumber(rawTimestamp) * 1000;
      const price = safeNumber(closePrice);

      return {
        timestamp,
        price,
      };
    })
    .filter((point: StockPoint) => point.timestamp > 0 && point.price > 0)
    .sort((a: StockPoint, b: StockPoint) => a.timestamp - b.timestamp);

  return points.slice(-days);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = normalizeSymbol(searchParams.get("symbol"));
  const days = normalizeDays(searchParams.get("days"));
  const stock = stocks[symbol];

  try {
    const finnhubPoints = await fetchFinnhubCandles(symbol, days);
    const hasFinnhubData = finnhubPoints.length > 1;

    const points = hasFinnhubData
      ? finnhubPoints
      : createFallbackHistory(stock.fallbackPrice, days, symbol);

    return NextResponse.json(
      {
        success: true,
        symbol: stock.symbol,
        name: stock.name,
        days,
        source: hasFinnhubData
          ? "Finnhub Stock Candle"
          : "Fallback Generated From Current Price",
        points,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: true,
        symbol: stock.symbol,
        name: stock.name,
        days,
        source: "Fallback Generated From Current Price",
        points: createFallbackHistory(stock.fallbackPrice, days, symbol),
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }
}