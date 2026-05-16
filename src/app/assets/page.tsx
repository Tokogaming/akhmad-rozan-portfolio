import LiveCryptoMarket from "@/components/LiveCryptoMarket";
import RealTimePortfolio from "@/components/RealTimePortfolio";
import Reveal from "@/components/Reveal";

export default function AssetsPage() {
  return (
    <section className="mx-auto w-[min(1180px,92%)] py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
          Asset Allocation
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          Real-Time Portfolio Overview
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Dashboard personal untuk melihat holdings, current value, profit/loss,
          allocation, harga crypto real-time, dan posisi saham manual dalam satu
          tampilan portfolio.
        </p>
      </Reveal>

      <Reveal>
        <RealTimePortfolio />
      </Reveal>

      <Reveal>
        <LiveCryptoMarket />
      </Reveal>

      <Reveal>
        <div className="mt-16 rounded-[28px] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            Portfolio Disclaimer
          </p>

          <p className="mt-4 leading-7 text-zinc-400">
            Data portfolio, holdings, profit/loss, dan asset allocation pada
            halaman ini digunakan untuk kebutuhan visual portfolio dan personal
            branding. Market data crypto diambil dari API pihak ketiga dan dapat
            berubah sewaktu-waktu. Informasi ini bukan merupakan ajakan membeli,
            menjual, atau financial advice.
          </p>
        </div>
      </Reveal>
    </section>
  );
}