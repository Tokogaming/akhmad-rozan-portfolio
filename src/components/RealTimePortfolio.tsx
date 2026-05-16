"use client";

import { useEffect, useMemo, useState } from "react";
import AssetLogo from "@/components/AssetLogo";

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

function isIndonesianStock(symbol: string) {
  return ["BBCA", "BBRI"].includes(symbol);
}

function isPositive(value: number) {
  return value >= 0;
}

function sourceLabel(asset: PortfolioAsset) {
  if (asset.type === "crypto") return "Live Market";
  if (asset.symbol === "NVDA") return "Manual USD";
  return "Manual IDR";
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

  const groupedAssets = useMemo(() => {
    const crypto = data?.assets.filter((asset) => asset.type === "crypto") ?? [];
    const stocks = data?.assets.filter((asset) => asset.type === "stock") ?? [];

    return { crypto, stocks };
  }, [data]);

  if (loading) {
    return (
      <div className="glass mt-14 rounded-[32px] p-8 text-zinc-400">
        Loading real-time portfolio...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-14 rounded-[32px] border border-red-500/30 bg-red-500/10 p-8 text-red-300">
        {error}
      </div>
    );
  }

  const totalPositive = isPositive(data.summary.totalPnlUsd);

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Real-Time Portfolio Engine
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-5xl">
            Live Portfolio Value
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Portfolio value dihitung otomatis dari harga crypto real-time dan
            posisi saham manual. Holdings tampil publik, sementara average buy
            disimpan di server dan tidak ditampilkan di website.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-zinc-300">
            Updated: {dateTime(data.updatedAt)}
          </div>

          <button
            onClick={getPortfolio}
            className="rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
          >
            Refresh Portfolio
          </button>
        </div>
      </div>

      {/* Source Status */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Crypto Source
          </p>
          <h3 className="mt-2 font-black text-white">CoinGecko API</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            BTC, ETH, SOL, dan BNB memakai harga market real-time.
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
            Stock Source
          </p>
          <h3 className="mt-2 font-black text-white">Manual Position</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            NVDA, BBCA, dan BBRI sementara memakai harga manual.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Display Mode
          </p>
          <h3 className="mt-2 font-black text-white">Public Holdings</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Holdings tampil publik. Average buy tidak ditampilkan.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-[30px] p-7">
          <p className="text-sm font-bold text-zinc-400">Total Portfolio</p>

          <h3 className="mt-3 text-3xl font-black md:text-4xl">
            {usd(data.summary.totalValueUsd)}
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            {idr(data.summary.totalValueIdr)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
            USD sebagai mata uang utama, IDR sebagai kalkulasi pendamping.
          </p>
        </div>

        <div className="glass rounded-[30px] p-7">
          <p className="text-sm font-bold text-zinc-400">Total Profit/Loss</p>

          <h3
            className={
              totalPositive
                ? "mt-3 text-3xl font-black text-emerald-400 md:text-4xl"
                : "mt-3 text-3xl font-black text-red-400 md:text-4xl"
            }
          >
            {totalPositive ? "+" : ""}
            {usd(data.summary.totalPnlUsd)}
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            {totalPositive ? "+" : ""}
            {idr(data.summary.totalPnlIdr)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
            Dihitung dari market price dan cost basis server.
          </p>
        </div>

        <div className="glass rounded-[30px] p-7">
          <p className="text-sm font-bold text-zinc-400">Portfolio Growth</p>

          <h3
            className={
              totalPositive
                ? "mt-3 text-3xl font-black text-emerald-400 md:text-4xl"
                : "mt-3 text-3xl font-black text-red-400 md:text-4xl"
            }
          >
            {totalPositive ? "+" : ""}
            {data.summary.totalPnlPercent}%
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-400">
            USD/IDR rate: {idr(data.exchangeRate.usdIdr)}
          </p>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
            Performance otomatis mengikuti perubahan harga crypto.
          </p>
        </div>
      </div>

      {/* Crypto Section */}
      <div className="mt-12">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Crypto Holdings
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] md:text-3xl">
              Live Crypto Positions
            </h3>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Harga crypto diperbarui otomatis. Allocation berubah mengikuti
            current value masing-masing aset.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groupedAssets.crypto.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Stock Section */}
      <div className="mt-12">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Stock Holdings
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] md:text-3xl">
              Manual Stock Positions
            </h3>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            NVDA memakai USD. BBCA dan BBRI ditampilkan IDR-first agar lebih
            natural untuk saham Indonesia.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groupedAssets.stocks.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Meme Basket */}
      <div className="mt-8 rounded-[30px] border border-yellow-300/20 bg-yellow-300/10 p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
          Hidden Meme Coin Basket
        </p>

        <p className="mt-3 leading-7 text-zinc-400">
          Kamu memiliki {data.memeCoinBasket.positions} jenis meme coin berbeda.
          Detail nama coin dan value tidak ditampilkan di dashboard publik.
        </p>
      </div>

      <p className="mt-5 text-xs leading-6 text-zinc-500">
        Note: Average buy tidak ditampilkan oleh API, tetapi kombinasi holdings,
        current value, dan profit/loss masih dapat memperkirakan cost basis.
        Gunakan data publik dengan sadar risiko.
      </p>
    </section>
  );
}

function AssetCard({ asset }: { asset: PortfolioAsset }) {
  const assetPositive = isPositive(asset.pnlUsd);
  const idrFirst = isIndonesianStock(asset.symbol);

  const mainPrice = idrFirst ? idr(asset.priceIdr) : usd(asset.priceUsd);
  const secondaryPrice = idrFirst
    ? `${usd(asset.priceUsd)} USD equivalent`
    : `${idr(asset.priceIdr)} IDR equivalent`;

  const mainValue = idrFirst
    ? idr(asset.currentValueIdr)
    : usd(asset.currentValueUsd);

  const secondaryValue = idrFirst
    ? `${usd(asset.currentValueUsd)} USD equivalent`
    : `${idr(asset.currentValueIdr)} IDR equivalent`;

  return (
    <article className="glass group h-full rounded-[28px] p-6 transition hover:-translate-y-2 hover:border-yellow-300/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
            {asset.type}
          </p>

         <div className="mt-2 flex items-center gap-3">
  <AssetLogo symbol={asset.symbol} size="sm" />
  <h3 className="text-2xl font-black">{asset.symbol}</h3>
</div>
          <p className="mt-1 min-h-[40px] text-sm leading-5 text-zinc-400">
            {asset.name}
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-300">
          {sourceLabel(asset)}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold text-zinc-500">Holdings</p>

        <p className="mt-1 font-black text-white">{asset.amountLabel}</p>
      </div>

      <div className="mt-5 space-y-4 text-sm">
        <div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Price</span>
            <span className="font-black">{mainPrice}</span>
          </div>

          <p className="mt-1 text-right text-xs text-zinc-500">
            {secondaryPrice}
          </p>
        </div>

        <div>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Current Value</span>
            <span className="font-black">{mainValue}</span>
          </div>

          <p className="mt-1 text-right text-xs text-zinc-500">
            {secondaryValue}
          </p>
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

        {typeof asset.change24h === "number" && asset.type === "crypto" && (
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">24h Change</span>
            <span
              className={
                asset.change24h >= 0
                  ? "font-black text-emerald-400"
                  : "font-black text-red-400"
              }
            >
              {asset.change24h >= 0 ? "+" : ""}
              {asset.change24h}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs font-bold text-zinc-500">
          <span>Allocation</span>
          <span>{asset.allocationPercent}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-yellow-300 transition-all duration-700"
            style={{ width: `${asset.allocationPercent}%` }}
          />
        </div>
      </div>
    </article>
  );
}