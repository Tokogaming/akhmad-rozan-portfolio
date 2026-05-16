"use client";

import { useEffect, useState } from "react";

type CryptoCoin = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  priceIdr: number;
  marketCapUsd: number;
  volumeUsd: number;
  change24h: number;
  lastUpdated: number | null;
};

type CryptoResponse = {
  success: boolean;
  source: string;
  updatedAt: string;
  data: CryptoCoin[];
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function compactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUpdatedTime(timestamp: number | null) {
  if (!timestamp) return "Unknown";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp * 1000));
}

export default function LiveCryptoMarket() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [source, setSource] = useState("CoinGecko");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getCryptoData() {
    try {
      setError("");

      const response = await fetch("/api/crypto", {
        cache: "no-store",
      });

      const result = (await response.json()) as CryptoResponse;

      if (!result.success) {
        throw new Error("Failed to fetch crypto data");
      }

      setCoins(result.data);
      setSource(result.source);
      setUpdatedAt(result.updatedAt);
    } catch {
      setError("Market data gagal dimuat. Coba refresh beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCryptoData();

    const interval = setInterval(() => {
      getCryptoData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Live Market
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-4xl">
            Real-Time Crypto Prices
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Harga BTC, ETH, dan SOL diambil otomatis dari API market. Data ini
            membantu membuat halaman asset terlihat lebih profesional dan dinamis.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-400">
            Source: <span className="font-bold text-white">{source}</span>
          </div>

          <button
            onClick={getCryptoData}
            className="rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
          >
            Refresh Market
          </button>
        </div>
      </div>

      {loading && (
        <div className="glass rounded-[28px] p-8 text-zinc-400">
          Loading live market data...
        </div>
      )}

      {error && (
        <div className="rounded-[28px] border border-red-500/30 bg-red-500/10 p-8 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {coins.map((coin) => {
              const positive = coin.change24h >= 0;

              return (
                <article
                  key={coin.id}
                  className="glass relative overflow-hidden rounded-[28px] p-7 transition hover:-translate-y-2 hover:border-yellow-300/30"
                >
                  <div className="absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-yellow-300/10 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-zinc-400">
                        {coin.name}
                      </p>

                      <h3 className="mt-1 text-2xl font-black">
                        {coin.symbol}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-yellow-300 px-4 py-2 text-sm font-black text-black">
                      {positive ? "UP" : "DOWN"}
                    </div>
                  </div>

                  <div className="relative mt-7">
                    <p className="text-sm font-semibold text-zinc-400">
                      Price USD
                    </p>

                    <h4 className="mt-2 text-3xl font-black">
                      {formatUsd(coin.priceUsd)}
                    </h4>

                    <p className="mt-2 text-sm font-semibold text-zinc-400">
                      {formatIdr(coin.priceIdr)}
                    </p>
                  </div>

                  <div className="relative mt-6 grid gap-3 border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-zinc-400">24h Change</span>
                      <span
                        className={
                          positive
                            ? "font-black text-emerald-400"
                            : "font-black text-red-400"
                        }
                      >
                        {positive ? "+" : ""}
                        {coin.change24h.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-zinc-400">Market Cap</span>
                      <span className="font-bold">
                        {compactUsd(coin.marketCapUsd)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-zinc-400">24h Volume</span>
                      <span className="font-bold">
                        {compactUsd(coin.volumeUsd)}
                      </span>
                    </div>
                  </div>

                  <p className="relative mt-5 text-xs leading-6 text-zinc-500">
                    Last updated: {formatUpdatedTime(coin.lastUpdated)}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-6 text-zinc-500">
            Market data is for portfolio display and educational reference only.
            Not financial advice.
          </p>
        </>
      )}
    </section>
  );
}