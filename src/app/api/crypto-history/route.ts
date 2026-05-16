import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300;

type CoinId = "bitcoin" | "ethereum" | "solana" | "binancecoin";
type ChartDays = "7" | "30";

type CoinGeckoMarketChart = {
  prices: [number, number][];
};

const coins: Record<
  CoinId,
  {
    name: string;
    symbol: string;
  }
> = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
  },
  binancecoin: {
    name: "BNB",
    symbol: "BNB",
  },
};

function isCoinId(value: string | null): value is CoinId {
  return (
    value === "bitcoin" ||
    value === "ethereum" ||
    value === "solana" ||
    value === "binancecoin"
  );
}

function isChartDays(value: string | null): value is ChartDays {
  return value === "7" || value === "30";
}

function envNumber(key: string, fallback = 0) {
  const value = process.env[key];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const coinParam = searchParams.get("coin");
    const daysParam = searchParams.get("days");

    const coin: CoinId = isCoinId(coinParam) ? coinParam : "bitcoin";
    const days: ChartDays = isChartDays(daysParam) ? daysParam : "7";

    const usdIdr = envNumber("USD_IDR", 16300);

    const url =
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart` +
      `?vs_currency=usd&days=${days}&interval=daily&precision=2`;

    const response = await fetch(url, {
      next: {
        revalidate: 300,
      },
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch historical crypto chart data.",
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as CoinGeckoMarketChart;

    const points = data.prices.map(([timestamp, priceUsd]) => ({
      timestamp,
      date: new Date(timestamp).toISOString(),
      priceUsd: round(priceUsd),
      priceIdr: round(priceUsd * usdIdr, 0),
    }));

    const first = points[0];
    const last = points[points.length - 1];

    const high = Math.max(...points.map((point) => point.priceUsd));
    const low = Math.min(...points.map((point) => point.priceUsd));

    const changeUsd = last && first ? last.priceUsd - first.priceUsd : 0;
    const changePercent =
      first && first.priceUsd > 0 ? (changeUsd / first.priceUsd) * 100 : 0;

    return NextResponse.json({
      success: true,
      source: "CoinGecko",
      coin: {
        id: coin,
        name: coins[coin].name,
        symbol: coins[coin].symbol,
      },
      days: Number(days),
      updatedAt: new Date().toISOString(),
      summary: {
        startPriceUsd: first?.priceUsd ?? 0,
        currentPriceUsd: last?.priceUsd ?? 0,
        highPriceUsd: round(high),
        lowPriceUsd: round(low),
        changeUsd: round(changeUsd),
        changePercent: round(changePercent),
      },
      points,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while fetching historical chart data.",
      },
      { status: 500 }
    );
  }
}