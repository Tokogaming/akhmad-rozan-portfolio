import AssetCharts from "@/components/AssetCharts";
import LiveCryptoMarket from "@/components/LiveCryptoMarket";
import Reveal from "@/components/Reveal";
import { assetData, portfolioSummary } from "@/lib/data";

function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function idr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AssetsPage() {
  return (
    <section className="mx-auto w-[min(1180px,92%)] py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
          Asset Allocation
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          Portfolio Overview
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Dashboard personal untuk melihat portfolio value, profit/loss,
          alokasi aset, dan harga crypto real-time sebagai bagian dari strategi
          digital asset jangka panjang.
        </p>
      </Reveal>

      {/* Portfolio Summary */}
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <Reveal>
          <div className="glass rounded-[28px] p-7 transition hover:-translate-y-1 hover:border-yellow-300/30">
            <p className="text-sm font-bold text-zinc-400">Portfolio Value</p>

            <h2 className="mt-3 text-3xl font-black">
              {usd(portfolioSummary.totalUsd)}
            </h2>

            <p className="mt-2 text-sm font-semibold text-zinc-400">
              {idr(portfolioSummary.totalIdr)}
            </p>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
              Total estimasi value portfolio berdasarkan data manual di kode.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass rounded-[28px] p-7 transition hover:-translate-y-1 hover:border-emerald-400/30">
            <p className="text-sm font-bold text-zinc-400">Total Profit</p>

            <h2 className="mt-3 text-3xl font-black text-emerald-400">
              +{usd(portfolioSummary.profitUsd)}
            </h2>

            <p className="mt-2 text-sm font-semibold text-zinc-400">
              +{idr(portfolioSummary.profitIdr)}
            </p>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
              Sample profit untuk visualisasi performa portfolio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass rounded-[28px] p-7 transition hover:-translate-y-1 hover:border-emerald-400/30">
            <p className="text-sm font-bold text-zinc-400">Profit/Loss</p>

            <h2 className="mt-3 text-3xl font-black text-emerald-400">
              +{portfolioSummary.profitPercent}%
            </h2>

            <p className="mt-2 text-sm font-semibold text-zinc-400">
              Manual performance sample
            </p>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-zinc-500">
              Digunakan sebagai indikator performa portfolio secara visual.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Live Market */}
      <Reveal>
        <LiveCryptoMarket />
      </Reveal>

      {/* Allocation Charts */}
      <div className="mt-14">
        <Reveal>
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Allocation Dashboard
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-4xl">
              Portfolio Distribution
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Visualisasi alokasi aset dalam bentuk donut chart dan bar chart
              untuk membaca distribusi portfolio secara cepat.
            </p>
          </div>

          <AssetCharts />
        </Reveal>
      </div>

      {/* Manual Asset Cards */}
      <div className="mt-14">
        <Reveal>
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Manual Holdings
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-4xl">
              Asset Position
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Data berikut adalah posisi aset manual yang bisa kamu ubah
              langsung dari file data portfolio.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-4">
          {assetData.map((asset, index) => {
            const positive = asset.pnlPercent >= 0;

            return (
              <Reveal key={asset.symbol} delay={index * 0.08}>
                <div className="glass h-full rounded-[24px] p-6 transition hover:-translate-y-2 hover:border-yellow-300/30">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{asset.name}</h3>

                      <p className="mt-1 text-xs font-bold text-zinc-500">
                        {asset.symbol}
                      </p>
                    </div>

                    <p className="font-black text-yellow-300">
                      {asset.allocation}%
                    </p>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${asset.allocation}%`,
                        backgroundColor: asset.color,
                      }}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Value</span>
                    <span className="font-black">{usd(asset.valueUsd)}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">IDR</span>
                    <span className="font-semibold text-zinc-300">
                      {idr(asset.valueIdr)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">P/L</span>

                    <span
                      className={
                        positive
                          ? "font-black text-emerald-400"
                          : "font-black text-red-400"
                      }
                    >
                      {positive ? "+" : ""}
                      {asset.pnlPercent}%
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Professional Disclaimer */}
      <Reveal>
        <div className="mt-16 rounded-[28px] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            Portfolio Disclaimer
          </p>

          <p className="mt-4 leading-7 text-zinc-400">
            Data portfolio, profit/loss, dan asset allocation pada halaman ini
            digunakan untuk kebutuhan visual portfolio dan edukasi personal
            branding. Market data crypto diambil dari API pihak ketiga dan dapat
            berubah sewaktu-waktu. Informasi ini bukan merupakan ajakan membeli,
            menjual, atau financial advice.
          </p>
        </div>
      </Reveal>
    </section>
  );
}