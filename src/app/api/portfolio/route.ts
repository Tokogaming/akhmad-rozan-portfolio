import { NextResponse } from "next/server";

export const revalidate = 60;

type CoinMarket = {
  usd: number;
  idr: number;
  usd_24h_change?: number;
  last_updated_at?: number;
};

type CoinGeckoResponse = {
  bitcoin?: CoinMarket;
  ethereum?: CoinMarket;
  solana?: CoinMarket;
  binancecoin?: CoinMarket;
};

type FinnhubQuote = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
};

type AssetSource = "CoinGecko" | "Finnhub" | "Manual Fallback";

type InternalAsset = {
  id: string;
  name: string;
  symbol: string;
  type: "crypto" | "stock";
  source: AssetSource;
  amount: number;
  amountLabel: string;
  priceUsd: number;
  priceIdr: number;
  currentValueUsd: number;
  currentValueIdr: number;
  pnlUsd: number;
  pnlIdr: number;
  pnlPercent: number;
  allocationPercent: number;
  change24h?: number;
  lastUpdated?: number | null;
};

function envNumber(key: string, fallback = 0) {
  const value = process.env[key];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(value);
}

function formatShares(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value);
}

async function getFinnhubQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    const token = process.env.FINNHUB_API_KEY;

    if (!token) {
      return null;
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`,
      {
        next: {
          revalidate: 60,
        },
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as FinnhubQuote;

    if (!Number.isFinite(data.c) || Number(data.c) <= 0) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function makeCryptoAsset(params: {
  id: string;
  name: string;
  symbol: string;
  market?: CoinMarket;
  amount: number;
  avgBuyUsd: number;
  usdIdr: number;
}): InternalAsset {
  const priceUsd = params.market?.usd ?? 0;
  const priceIdr = params.market?.idr ?? priceUsd * params.usdIdr;

  const currentValueUsd = params.amount * priceUsd;
  const currentValueIdr = params.amount * priceIdr;

  const costUsd = params.amount * params.avgBuyUsd;
  const costIdr = costUsd * params.usdIdr;

  const pnlUsd = currentValueUsd - costUsd;
  const pnlIdr = currentValueIdr - costIdr;
  const pnlPercent = costUsd > 0 ? (pnlUsd / costUsd) * 100 : 0;

  return {
    id: params.id,
    name: params.name,
    symbol: params.symbol,
    type: "crypto",
    source: "CoinGecko",
    amount: params.amount,
    amountLabel: `${formatAmount(params.amount)} ${params.symbol}`,
    priceUsd: round(priceUsd),
    priceIdr: round(priceIdr, 0),
    currentValueUsd: round(currentValueUsd),
    currentValueIdr: round(currentValueIdr, 0),
    pnlUsd: round(pnlUsd),
    pnlIdr: round(pnlIdr, 0),
    pnlPercent: round(pnlPercent),
    allocationPercent: 0,
    change24h: round(params.market?.usd_24h_change ?? 0),
    lastUpdated: params.market?.last_updated_at ?? null,
  };
}

function makeUsStockAsset(params: {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  avgBuyUsd: number;
  fallbackPriceUsd: number;
  quote: FinnhubQuote | null;
  usdIdr: number;
}): InternalAsset {
  const hasLivePrice =
    params.quote !== null &&
    Number.isFinite(params.quote.c) &&
    Number(params.quote.c) > 0;

  const priceUsd = hasLivePrice
    ? Number(params.quote?.c)
    : params.fallbackPriceUsd;

  const currentValueUsd = params.shares * priceUsd;
  const currentValueIdr = currentValueUsd * params.usdIdr;

  const costUsd = params.shares * params.avgBuyUsd;
  const costIdr = costUsd * params.usdIdr;

  const pnlUsd = currentValueUsd - costUsd;
  const pnlIdr = currentValueIdr - costIdr;
  const pnlPercent = costUsd > 0 ? (pnlUsd / costUsd) * 100 : 0;

  return {
    id: params.id,
    name: params.name,
    symbol: params.symbol,
    type: "stock",
    source: hasLivePrice ? "Finnhub" : "Manual Fallback",
    amount: params.shares,
    amountLabel: `${formatShares(params.shares)} shares`,
    priceUsd: round(priceUsd),
    priceIdr: round(priceUsd * params.usdIdr, 0),
    currentValueUsd: round(currentValueUsd),
    currentValueIdr: round(currentValueIdr, 0),
    pnlUsd: round(pnlUsd),
    pnlIdr: round(pnlIdr, 0),
    pnlPercent: round(pnlPercent),
    allocationPercent: 0,
    change24h: hasLivePrice ? round(Number(params.quote?.dp ?? 0)) : undefined,
    lastUpdated: hasLivePrice ? Number(params.quote?.t ?? 0) : null,
  };
}

export async function GET() {
  try {
    const usdIdr = envNumber("USD_IDR", 16300);

    const cryptoUrl =
      "https://api.coingecko.com/api/v3/simple/price" +
      "?ids=bitcoin,ethereum,solana,binancecoin" +
      "&vs_currencies=usd,idr" +
      "&include_24hr_change=true" +
      "&include_last_updated_at=true" +
      "&precision=2";

    const [cryptoResponse, nvdaQuote, aaplQuote, msftQuote, qqqQuote] =
      await Promise.all([
        fetch(cryptoUrl, {
          next: {
            revalidate: 60,
          },
          headers: {
            accept: "application/json",
          },
        }),
        getFinnhubQuote("NVDA"),
        getFinnhubQuote("AAPL"),
        getFinnhubQuote("MSFT"),
        getFinnhubQuote("QQQ"),
      ]);

    if (!cryptoResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch crypto price data.",
        },
        { status: cryptoResponse.status }
      );
    }

    const market = (await cryptoResponse.json()) as CoinGeckoResponse;

    const assets: InternalAsset[] = [
      makeCryptoAsset({
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        market: market.bitcoin,
        amount: envNumber("BTC_AMOUNT"),
        avgBuyUsd: envNumber("BTC_AVG_BUY_USD"),
        usdIdr,
      }),
      makeCryptoAsset({
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        market: market.ethereum,
        amount: envNumber("ETH_AMOUNT"),
        avgBuyUsd: envNumber("ETH_AVG_BUY_USD"),
        usdIdr,
      }),
      makeCryptoAsset({
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        market: market.solana,
        amount: envNumber("SOL_AMOUNT"),
        avgBuyUsd: envNumber("SOL_AVG_BUY_USD"),
        usdIdr,
      }),
      makeCryptoAsset({
        id: "binancecoin",
        name: "BNB",
        symbol: "BNB",
        market: market.binancecoin,
        amount: envNumber("BNB_AMOUNT"),
        avgBuyUsd: envNumber("BNB_AVG_BUY_USD"),
        usdIdr,
      }),
      makeUsStockAsset({
        id: "nvda",
        name: "NVIDIA Corporation",
        symbol: "NVDA",
        shares: envNumber("NVDA_SHARES", 28),
        avgBuyUsd: envNumber("NVDA_AVG_BUY_USD", 225.32),
        fallbackPriceUsd: envNumber("NVDA_FALLBACK_PRICE_USD", 225.32),
        quote: nvdaQuote,
        usdIdr,
      }),
      makeUsStockAsset({
        id: "aapl",
        name: "Apple Inc.",
        symbol: "AAPL",
        shares: envNumber("AAPL_SHARES", 15),
        avgBuyUsd: envNumber("AAPL_AVG_BUY_USD", 300.23),
        fallbackPriceUsd: envNumber("AAPL_FALLBACK_PRICE_USD", 300.23),
        quote: aaplQuote,
        usdIdr,
      }),
      makeUsStockAsset({
        id: "msft",
        name: "Microsoft Corporation",
        symbol: "MSFT",
        shares: envNumber("MSFT_SHARES", 10),
        avgBuyUsd: envNumber("MSFT_AVG_BUY_USD", 421.92),
        fallbackPriceUsd: envNumber("MSFT_FALLBACK_PRICE_USD", 421.92),
        quote: msftQuote,
        usdIdr,
      }),
      makeUsStockAsset({
        id: "qqq",
        name: "Invesco QQQ Trust",
        symbol: "QQQ",
        shares: envNumber("QQQ_SHARES", 7),
        avgBuyUsd: envNumber("QQQ_AVG_BUY_USD", 708.93),
        fallbackPriceUsd: envNumber("QQQ_FALLBACK_PRICE_USD", 708.93),
        quote: qqqQuote,
        usdIdr,
      }),
    ];

    const totalValueUsd = assets.reduce(
      (sum, asset) => sum + asset.currentValueUsd,
      0
    );

    const totalValueIdr = assets.reduce(
      (sum, asset) => sum + asset.currentValueIdr,
      0
    );

    const totalPnlUsd = assets.reduce((sum, asset) => sum + asset.pnlUsd, 0);
    const totalPnlIdr = assets.reduce((sum, asset) => sum + asset.pnlIdr, 0);
    const totalCostUsd = totalValueUsd - totalPnlUsd;

    const totalPnlPercent =
      totalCostUsd > 0 ? (totalPnlUsd / totalCostUsd) * 100 : 0;

    const assetsWithAllocation = assets.map((asset) => ({
      ...asset,
      allocationPercent:
        totalValueUsd > 0
          ? round((asset.currentValueUsd / totalValueUsd) * 100)
          : 0,
    }));

    return NextResponse.json({
      success: true,
      source: {
        crypto: "CoinGecko",
        stocks: "Finnhub with manual fallback",
      },
      updatedAt: new Date().toISOString(),
      exchangeRate: {
        usdIdr,
      },
      summary: {
        totalValueUsd: round(totalValueUsd),
        totalValueIdr: round(totalValueIdr, 0),
        totalPnlUsd: round(totalPnlUsd),
        totalPnlIdr: round(totalPnlIdr, 0),
        totalPnlPercent: round(totalPnlPercent),
      },
      memeCoinBasket: {
        positions: envNumber("MEMECOIN_POSITIONS", 37),
        detailsHidden: true,
        valueIncluded: false,
      },
      assets: assetsWithAllocation,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while calculating portfolio.",
      },
      { status: 500 }
    );
  }
}