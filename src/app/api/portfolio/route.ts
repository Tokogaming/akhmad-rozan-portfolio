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

function num(value: string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value: number, digit = 2) {
  return Number(value.toFixed(digit));
}

export async function GET() {
  try {
    const usdIdr = num(process.env.USD_IDR, 16300);

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

    const cryptoConfig = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        market: market.bitcoin,
        amount: num(process.env.BTC_AMOUNT),
        avgBuyUsd: num(process.env.BTC_AVG_BUY_USD),
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        market: market.ethereum,
        amount: num(process.env.ETH_AMOUNT),
        avgBuyUsd: num(process.env.ETH_AVG_BUY_USD),
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        market: market.solana,
        amount: num(process.env.SOL_AMOUNT),
        avgBuyUsd: num(process.env.SOL_AVG_BUY_USD),
      },
      {
        id: "binancecoin",
        name: "BNB",
        symbol: "BNB",
        market: market.binancecoin,
        amount: num(process.env.BNB_AMOUNT),
        avgBuyUsd: num(process.env.BNB_AVG_BUY_USD),
      },
    ];

    const cryptoAssets: PortfolioAsset[] = cryptoConfig.map((asset) => {
      const priceUsd = asset.market?.usd ?? 0;
      const priceIdr = asset.market?.idr ?? priceUsd * usdIdr;

      const currentValueUsd = asset.amount * priceUsd;
      const currentValueIdr = asset.amount * priceIdr;

      const costUsd = asset.amount * asset.avgBuyUsd;
      const costIdr = costUsd * usdIdr;

      const pnlUsd = currentValueUsd - costUsd;
      const pnlIdr = currentValueIdr - costIdr;
      const pnlPercent = costUsd > 0 ? (pnlUsd / costUsd) * 100 : 0;

      return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        type: "crypto",
        source: "CoinGecko",
        amount: asset.amount,
        amountLabel: `${asset.amount} ${asset.symbol}`,
        priceUsd,
        priceIdr,
        currentValueUsd,
        currentValueIdr,
        pnlUsd,
        pnlIdr,
        pnlPercent,
        allocationPercent: 0,
        change24h: asset.market?.usd_24h_change ?? 0,
        lastUpdated: asset.market?.last_updated_at ?? null,
      };
    });

    const stockAssetsRaw = [
      {
        id: "nvda",
        name: "NVIDIA Corporation",
        symbol: "NVDA",
        shares: num(process.env.NVDA_SHARES),
        avgBuyUsd: num(process.env.NVDA_AVG_BUY_USD),
        currentPriceUsd: num(process.env.NVDA_CURRENT_PRICE_USD),
      },
      {
        id: "bbca",
        name: "Bank Central Asia",
        symbol: "BBCA",
        shares: num(process.env.BBCA_SHARES),
        avgBuyIdr: num(process.env.BBCA_AVG_BUY_IDR),
        currentPriceIdr: num(process.env.BBCA_CURRENT_PRICE_IDR),
      },
      {
        id: "bbri",
        name: "Bank Rakyat Indonesia",
        symbol: "BBRI",
        shares: num(process.env.BBRI_SHARES),
        avgBuyIdr: num(process.env.BBRI_AVG_BUY_IDR),
        currentPriceIdr: num(process.env.BBRI_CURRENT_PRICE_IDR),
      },
    ];

    const nvda = stockAssetsRaw[0];
    const nvdaCurrentValueUsd = nvda.shares * nvda.currentPriceUsd;
    const nvdaCurrentValueIdr = nvdaCurrentValueUsd * usdIdr;
    const nvdaCostUsd = nvda.shares * nvda.avgBuyUsd;
    const nvdaCostIdr = nvdaCostUsd * usdIdr;

    const stockAssets: PortfolioAsset[] = [
      {
        id: "nvda",
        name: nvda.name,
        symbol: nvda.symbol,
        type: "stock",
        source: "Manual",
        amount: nvda.shares,
        amountLabel: `${nvda.shares} shares`,
        priceUsd: nvda.currentPriceUsd,
        priceIdr: nvda.currentPriceUsd * usdIdr,
        currentValueUsd: nvdaCurrentValueUsd,
        currentValueIdr: nvdaCurrentValueIdr,
        pnlUsd: nvdaCurrentValueUsd - nvdaCostUsd,
        pnlIdr: nvdaCurrentValueIdr - nvdaCostIdr,
        pnlPercent:
          nvdaCostUsd > 0
            ? ((nvdaCurrentValueUsd - nvdaCostUsd) / nvdaCostUsd) * 100
            : 0,
        allocationPercent: 0,
      },
    ];

    for (const stock of stockAssetsRaw.slice(1)) {
      const currentValueIdr = stock.shares * stock.currentPriceIdr;
      const currentValueUsd = currentValueIdr / usdIdr;
      const costIdr = stock.shares * stock.avgBuyIdr;
      const costUsd = costIdr / usdIdr;

      stockAssets.push({
        id: stock.id,
        name: stock.name,
        symbol: stock.symbol,
        type: "stock",
        source: "Manual",
        amount: stock.shares,
        amountLabel: `${stock.shares.toLocaleString("id-ID")} shares`,
        priceUsd: stock.currentPriceIdr / usdIdr,
        priceIdr: stock.currentPriceIdr,
        currentValueUsd,
        currentValueIdr,
        pnlUsd: currentValueUsd - costUsd,
        pnlIdr: currentValueIdr - costIdr,
        pnlPercent:
          costIdr > 0 ? ((currentValueIdr - costIdr) / costIdr) * 100 : 0,
        allocationPercent: 0,
      });
    }

    const allAssets = [...cryptoAssets, ...stockAssets];

    const totalValueUsd = allAssets.reduce(
      (sum, asset) => sum + asset.currentValueUsd,
      0
    );

    const totalValueIdr = allAssets.reduce(
      (sum, asset) => sum + asset.currentValueIdr,
      0
    );

    const totalPnlUsd = allAssets.reduce((sum, asset) => sum + asset.pnlUsd, 0);
    const totalPnlIdr = allAssets.reduce((sum, asset) => sum + asset.pnlIdr, 0);

    const totalCostUsd = totalValueUsd - totalPnlUsd;
    const totalPnlPercent =
      totalCostUsd > 0 ? (totalPnlUsd / totalCostUsd) * 100 : 0;

    const assetsWithAllocation = allAssets.map((asset) => ({
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
        positions: num(process.env.MEMECOIN_POSITIONS, 37),
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