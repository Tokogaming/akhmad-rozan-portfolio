"use client";

import { useEffect, useState } from "react";

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

type PortfolioResponse = {
  success: boolean;
  updatedAt: string;
  exchangeRate: {
    usdIdr: number;
  };
  summary: {
    totalValueUsd: number;
    totalValueIdr: number;
    totalPnlUsd: number;
    totalPnlIdr: number;
    totalPnlPercent: number;
  };
  memeCoinBasket: {
    positions: number;
    detailsHidden: boolean;
    valueIncluded: boolean;
  };
  assets: PortfolioAsset[];
};

function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function idr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function RealTimePortfolio() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getPortfolio() {
    try {
      setError("");

      const response = await fetch("/api/portfolio", {
        cache: "no-store",
      });

      const result = (await response.json()) as PortfolioResponse;

      if (!result.success) {
        throw new Error("Failed to load portfolio");
      }

      setData(result);
    } catch {
      setError("Portfolio gagal dimuat. Coba refresh beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPortfolio();

    const interval = setInterval(() => {
      getPortfolio();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass mt-14 rounded-[28px] p-8 text-zinc-400">
        Loading real-time portfolio...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-14 rounded-[28px] border border-red-500/30 bg-red-500/10 p-8 text-red-300">
        {error}
      </div>
    );
  }

  const positive = data.summary.totalPnlUsd >= 0;

  return (
    <section className="mt-14">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Real-Time Portfolio Engine
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-4xl">
            Live Portfolio Value
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Portfolio value dihitung otomatis dari harga crypto real-time dan
            posisi saham manual. Holdings tampil publik, average buy disimpan di
            server dan tidak ditampilkan di website.
          </p>
        </div>

        <button
          onClick={getPortfolio}
          className="rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
        >
          Refresh Portfolio
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-[28px] p-7">
          <p className="text-sm font-bold text-zinc-400">Total Portfolio</p>

          <h3 className="mt-3 text-3xl font-black">
            {usd(data.summary.totalValueUsd)}
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            {idr(data.summary.totalValueIdr)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-500">
            USD utama, IDR kalkulasi pendamping.
          </p>
        </div>

        <div className="glass rounded-[28px] p-7">
          <p className="text-sm font-bold text-zinc-400">Total Profit/Loss</p>

          <h3
            className={
              positive
                ? "mt-3 text-3xl font-black text-emerald-400"
                : "mt-3 text-3xl font-black text-red-400"
            }
          >
            {positive ? "+" : ""}
            {usd(data.summary.totalPnlUsd)}
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            {positive ? "+" : ""}
            {idr(data.summary.totalPnlIdr)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-500">
            Dihitung dari market price dan cost basis server.
          </p>
        </div>

        <div className="glass rounded-[28px] p-7">
          <p className="text-sm font-bold text-zinc-400">Portfolio Growth</p>

          <h3
            className={
              positive
                ? "mt-3 text-3xl font-black text-emerald-400"
                : "mt-3 text-3xl font-black text-red-400"
            }
          >
            {positive ? "+" : ""}
            {data.summary.totalPnlPercent}%
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            Updated: {dateTime(data.updatedAt)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-500">
            USD/IDR rate: {idr(data.exchangeRate.usdIdr)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {data.assets.map((asset) => {
          const assetPositive = asset.pnlUsd >= 0;

          return (
            <article
              key={asset.id}
              className="glass h-full rounded-[26px] p-6 transition hover:-translate-y-2 hover:border-yellow-300/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                    {asset.type}
                  </p>

                  <h3 className="mt-2 text-xl font-black">{asset.symbol}</h3>

                  <p className="mt-1 text-sm text-zinc-400">{asset.name}</p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-300">
                  {asset.source}
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-zinc-500">Holdings</p>

                <p className="mt-1 font-black text-white">
                  {asset.amountLabel}
                </p>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">Live Price</span>
                  <span className="font-bold">{usd(asset.priceUsd)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">Current Value</span>
                  <span className="font-bold">{usd(asset.currentValueUsd)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">IDR Value</span>
                  <span className="font-bold">{idr(asset.currentValueIdr)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">P/L</span>
                  <span
                    className={
                      assetPositive
                        ? "font-black text-emerald-400"
                        : "font-black text-red-400"
                    }
                  >
                    {assetPositive ? "+" : ""}
                    {asset.pnlPercent}%
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-bold text-zinc-500">
                  <span>Allocation</span>
                  <span>{asset.allocationPercent}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-yellow-300"
                    style={{ width: `${asset.allocationPercent}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-[26px] border border-yellow-300/20 bg-yellow-300/10 p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
          Hidden Meme Coin Basket
        </p>

        <p className="mt-3 leading-7 text-zinc-400">
          Kamu memiliki {data.memeCoinBasket.positions} jenis meme coin berbeda.
          Detail nama coin dan value tidak ditampilkan di dashboard publik.
        </p>
      </div>

      <p className="mt-4 text-xs leading-6 text-zinc-500">
        Note: Average buy tidak ditampilkan oleh API, tetapi kombinasi holdings,
        current value, dan profit/loss masih dapat memperkirakan cost basis.
        Gunakan data publik dengan sadar risiko.
      </p>
    </section>
  );
}