import Link from "next/link";

const trustItems = [
  {
    label: "Crypto Data",
    title: "CoinGecko Market API",
    description:
      "BTC, ETH, SOL, dan BNB memakai harga market real-time. Nilai portfolio, P/L, allocation, dan chart ikut berubah mengikuti data pasar crypto.",
  },
  {
    label: "US Stock Data",
    title: "Finnhub Market Quote",
    description:
      "NVDA, AAPL, MSFT, dan QQQ memakai live US stock quote dengan fallback price jika API sedang lambat, limit, atau tidak tersedia.",
  },
  {
    label: "Privacy Mode",
    title: "Public Holdings, Private Cost Basis",
    description:
      "Jumlah holdings ditampilkan untuk transparansi, namun average buy price dan detail meme coin basket tetap tidak ditampilkan secara publik.",
  },
  {
    label: "Market Hours",
    title: "Crypto 24/7, Stocks Follow US Market",
    description:
      "Crypto bergerak 24 jam. Saham US mengikuti jam market, pre-market, after-hours, atau last available quote dari data provider.",
  },
];

export default function PortfolioTrustPanel() {
  return (
    <section className="mt-20">
      <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-300">
              Portfolio Transparency
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.05em] text-white md:text-5xl">
              Built as a public asset dashboard, not financial advice.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              Dashboard ini dibuat untuk menampilkan gambaran portfolio digital
              secara profesional: holdings, current value, profit/loss,
              allocation, dan historical movement. Data market dapat berubah
              sewaktu-waktu mengikuti kondisi pasar dan ketersediaan API.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-300 px-6 py-4 text-sm font-black text-black transition hover:bg-yellow-200"
              >
                View Main Portfolio
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] border border-yellow-300/20 bg-yellow-300/[0.07] p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
              Public Note
            </p>

            <p className="mt-4 leading-8 text-zinc-300">
              Angka portfolio bersifat informatif dan dapat berubah mengikuti
              market. Website ini bukan rekomendasi beli/jual asset, bukan
              laporan keuangan resmi, dan bukan nasihat investasi.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[26px] border border-white/10 bg-black/20 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                {item.label}
              </p>

              <h3 className="mt-3 text-xl font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}