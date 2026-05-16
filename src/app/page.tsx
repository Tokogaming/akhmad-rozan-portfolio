import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";
import HeroVisual from "@/components/HeroVisual";
import Reveal from "@/components/Reveal";
import { site, socials } from "@/lib/data";

const snapshotItems = [
  {
    title: "Content Focus",
    value: "Crypto, Digital Asset, Market Insight",
    text: "Fokus membuat konten edukatif yang menggabungkan market awareness, digital economy, dan mindset investasi.",
  },
  {
    title: "Asset Focus",
    value: "BTC, ETH, SOL, Stocks",
    text: "Membangun portofolio dengan pendekatan long-term, diversifikasi, dan risk management.",
  },
  {
    title: "Brand Direction",
    value: "Creator x Investor",
    text: "Positioning personal brand yang menggabungkan dunia konten, crypto, dan digital asset.",
  },
  {
    title: "Available For",
    value: "Collaboration & Networking",
    text: "Terbuka untuk diskusi, kerja sama konten, edukasi, dan peluang kolaborasi digital.",
  },
];

const focusCards = [
  {
    icon: Video,
    title: "Creator Engine",
    text: "Membangun konten yang informatif, mudah dipahami, dan relevan untuk audience digital.",
  },
  {
    icon: TrendingUp,
    title: "Market Awareness",
    text: "Mengikuti pergerakan market, narasi crypto, dan peluang aset digital secara konsisten.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Mindset",
    text: "Mengutamakan strategi, disiplin, dan pengelolaan risiko dalam mengambil keputusan.",
  },
];

export default function HomePage() {
  const youtube = socials.find((social) => social.label === "YouTube");
  const instagram = socials.find((social) => social.label === "Instagram");

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-[min(1180px,92%)] items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399]" />
            Content Creator • Investor • Crypto Enthusiast
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] md:text-7xl">
            Building Digital Influence Through{" "}
            <span className="gold-text">
              Content, Crypto, and Long-Term Vision.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            Saya {site.name}, seorang {site.tagline} yang membangun personal
            brand, edukasi digital, dan portofolio aset dengan pendekatan
            modern, terukur, dan jangka panjang.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 px-6 py-4 font-black text-black shadow-[0_18px_55px_rgba(247,201,72,0.25)] transition hover:-translate-y-1"
            >
              View Portfolio <ArrowRight size={18} />
            </Link>

            <Link
              href="/assets"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              Asset Allocation
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: PlayCircle,
                title: "Creator",
                text: "YouTube & digital content",
              },
              {
                icon: BadgeDollarSign,
                title: "Assets",
                text: "BTC • ETH • SOL • Stocks",
              },
              {
                icon: ShieldCheck,
                title: "Mindset",
                text: "Growth + risk management",
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-3xl p-5">
                <item.icon className="text-yellow-300" />
                <h3 className="mt-4 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <HeroVisual />
        </Reveal>
      </section>

      {/* Creator & Investor Snapshot */}
      <section className="mx-auto w-[min(1180px,92%)] py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Creator & Investor Snapshot
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Personal brand yang dibangun dari konten, market, dan aset digital.
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Website ini bukan hanya portfolio biasa, tapi representasi dari arah
            branding: content creation, crypto education, dan digital asset
            strategy.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {snapshotItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="glass h-full rounded-[28px] p-6 transition hover:-translate-y-2 hover:border-yellow-300/30">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                  {item.title}
                </p>

                <h3 className="mt-4 text-xl font-black leading-7">
                  {item.value}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Strategy Section */}
      <section className="mx-auto w-[min(1180px,92%)] pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass relative h-full overflow-hidden rounded-[32px] p-8">
              <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />

              <p className="relative text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                Brand Direction
              </p>

              <h2 className="relative mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Built for long-term digital growth.
              </h2>

              <p className="relative mt-6 leading-8 text-zinc-400">
                Fokus utama website ini adalah membangun kepercayaan,
                memperlihatkan arah konten, dan menunjukkan cara berpikir
                terhadap aset digital. Kombinasi ini membuat personal brand kamu
                terlihat lebih matang dan profesional.
              </p>

              <div className="relative mt-8 flex flex-wrap gap-4">
                {youtube && (
                  <a
                    href={youtube.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
                  >
                    Visit YouTube <ArrowRight size={16} />
                  </a>
                )}

                {instagram && (
                  <a
                    href={instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    View Instagram <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {focusCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.1}>
                <article className="glass flex gap-5 rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-yellow-300/30">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-yellow-300 text-black">
                    <card.icon size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black">{card.title}</h3>

                    <p className="mt-2 leading-7 text-zinc-400">
                      {card.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <article className="glass flex gap-5 rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-yellow-300/30">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-yellow-300 text-black">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-black">Next Upgrade</h3>

                  <p className="mt-2 leading-7 text-zinc-400">
                    Website ini siap dikembangkan ke tahap berikutnya:
                    portfolio showcase, YouTube embed, profile image, dan
                    deployment ke Vercel.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}