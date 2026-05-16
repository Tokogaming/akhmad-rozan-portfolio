import { NextResponse } from "next/server";

export const revalidate = 60;

type CoinGeckoCoin = {
  usd: number;
  idr: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
  usd_24h_change?: number;
  last_updated_at?: number;
};

type CoinGeckoResponse = {
  bitcoin?: CoinGeckoCoin;
  ethereum?: CoinGeckoCoin;
  solana?: CoinGeckoCoin;
};

export async function GET() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price" +
      "?ids=bitcoin,ethereum,solana" +
      "&vs_currencies=usd,idr" +
      "&include_market_cap=true" +
      "&include_24hr_vol=true" +
      "&include_24hr_change=true" +
      "&include_last_updated_at=true" +
      "&precision=2";

    const response = await fetch(url, {
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
          message: "Failed to fetch crypto market data.",
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as CoinGeckoResponse;

    const formattedData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        priceUsd: data.bitcoin?.usd ?? 0,
        priceIdr: data.bitcoin?.idr ?? 0,
        marketCapUsd: data.bitcoin?.usd_market_cap ?? 0,
        volumeUsd: data.bitcoin?.usd_24h_vol ?? 0,
        change24h: data.bitcoin?.usd_24h_change ?? 0,
        lastUpdated: data.bitcoin?.last_updated_at ?? null,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        priceUsd: data.ethereum?.usd ?? 0,
        priceIdr: data.ethereum?.idr ?? 0,
        marketCapUsd: data.ethereum?.usd_market_cap ?? 0,
        volumeUsd: data.ethereum?.usd_24h_vol ?? 0,
        change24h: data.ethereum?.usd_24h_change ?? 0,
        lastUpdated: data.ethereum?.last_updated_at ?? null,
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        priceUsd: data.solana?.usd ?? 0,
        priceIdr: data.solana?.idr ?? 0,
        marketCapUsd: data.solana?.usd_market_cap ?? 0,
        volumeUsd: data.solana?.usd_24h_vol ?? 0,
        change24h: data.solana?.usd_24h_change ?? 0,
        lastUpdated: data.solana?.last_updated_at ?? null,
      },
    ];

    return NextResponse.json({
      success: true,
      source: "CoinGecko",
      updatedAt: new Date().toISOString(),
      data: formattedData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error while fetching crypto data.",
      },
      { status: 500 }
    );
  }
}