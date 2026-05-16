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

type PortfolioAsset = {
  id: string;
  name: string;
  symbol: string;
  type: "crypto" | "stock";
  source: "CoinGecko" | "Manual";
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

function makeCryptoAsset(params: {
  id: string;
  name: string;
  symbol: string;
  market?: CoinMarket;
  amount: number;
  avgBuyUsd: number;
  usdIdr: number;
}): PortfolioAsset {
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
    amountLabel: `${params.amount} ${params.symbol}`,
    priceUsd,
    priceIdr,
    currentValueUsd,
    currentValueIdr,
    pnlUsd,
    pnlIdr,
    pnlPercent,
    allocationPercent: 0,
    change24h: params.market?.usd_24h_change ?? 0,
    lastUpdated: params.market?.last_updated_at ?? null,
  };
}

function makeUsdStockAsset(params: {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  avgBuyUsd: number;
  currentPriceUsd: number;
  usdIdr: number;
}): PortfolioAsset {
  const currentValueUsd = params.shares * params.currentPriceUsd;
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
    source: "Manual",
    amount: params.shares,
    amountLabel: `${params.shares} shares`,
    priceUsd: params.currentPriceUsd,
    priceIdr: params.currentPriceUsd * params.usdIdr,
    currentValueUsd,
    currentValueIdr,
    pnlUsd,
    pnlIdr,
    pnlPercent,
    allocationPercent: 0,
  };
}

function makeIdrStockAsset(params: {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  avgBuyIdr: number;
  currentPriceIdr: number;
  usdIdr: number;
}): PortfolioAsset {
  const currentValueIdr = params.shares * params.currentPriceIdr;
  const currentValueUsd = currentValueIdr / params.usdIdr;

  const costIdr = params.shares * params.avgBuyIdr;
  const costUsd = costIdr / params.usdIdr;

  const pnlIdr = currentValueIdr - costIdr;
  const pnlUsd = currentValueUsd - costUsd;
  const pnlPercent = costIdr > 0 ? (pnlIdr / costIdr) * 100 : 0;

  return {
    id: params.id,
    name: params.name,
    symbol: params.symbol,
    type: "stock",
    source: "Manual",
    amount: params.shares,
    amountLabel: `${params.shares.toLocaleString("id-ID")} shares`,
    priceUsd: params.currentPriceIdr / params.usdIdr,
    priceIdr: params.currentPriceIdr,
    currentValueUsd,
    currentValueIdr,
    pnlUsd,
    pnlIdr,
    pnlPercent,
    allocationPercent: 0,
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

    const response = await fetch(cryptoUrl, {
      next: {
        revalidate: 60,
      },
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch crypto price data.",
        },
        { status: response.status }
      );
    }

    const market = (await response.json()) as CoinGeckoResponse;

    const assets: PortfolioAsset[] = [
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
      makeUsdStockAsset({
        id: "nvda",
        name: "NVIDIA Corporation",
        symbol: "NVDA",
        shares: envNumber("NVDA_SHARES"),
        avgBuyUsd: envNumber("NVDA_AVG_BUY_USD"),
        currentPriceUsd: envNumber("NVDA_CURRENT_PRICE_USD"),
        usdIdr,
      }),
      makeIdrStockAsset({
        id: "bbca",
        name: "Bank Central Asia",
        symbol: "BBCA",
        shares: envNumber("BBCA_SHARES"),
        avgBuyIdr: envNumber("BBCA_AVG_BUY_IDR"),
        currentPriceIdr: envNumber("BBCA_CURRENT_PRICE_IDR"),
        usdIdr,
      }),
      makeIdrStockAsset({
        id: "bbri",
        name: "Bank Rakyat Indonesia",
        symbol: "BBRI",
        shares: envNumber("BBRI_SHARES"),
        avgBuyIdr: envNumber("BBRI_AVG_BUY_IDR"),
        currentPriceIdr: envNumber("BBRI_CURRENT_PRICE_IDR"),
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
      priceUsd: round(asset.priceUsd),
      priceIdr: round(asset.priceIdr, 0),
      currentValueUsd: round(asset.currentValueUsd),
      currentValueIdr: round(asset.currentValueIdr, 0),
      pnlUsd: round(asset.pnlUsd),
      pnlIdr: round(asset.pnlIdr, 0),
      pnlPercent: round(asset.pnlPercent),
      allocationPercent:
        totalValueUsd > 0
          ? round((asset.currentValueUsd / totalValueUsd) * 100)
          : 0,
      change24h:
        typeof asset.change24h === "number" ? round(asset.change24h) : undefined,
    }));

    return NextResponse.json({
      success: true,
      source: {
        crypto: "CoinGecko",
        stocks: "Manual",
      },
      privacy: {
        holdingsVisible: true,
        averageBuyHidden: true,
        note:
          "Average buy price is not returned by this API, but profit/loss can still imply cost basis.",
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