import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Compass,
  Lightbulb,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { socials } from "@/lib/data";

const missionCards = [
  {
    icon: Video,
    title: "Content Creation",
    text: "Membangun konten yang edukatif, relevan, dan mudah dipahami untuk audience yang tertarik pada crypto, digital asset, dan ekonomi digital.",
  },
  {
    icon: TrendingUp,
    title: "Market Awareness",
    text: "Mengikuti perkembangan market, narasi crypto, dan peluang digital asset dengan pendekatan yang lebih terstruktur.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    text: "Mengedepankan disiplin, strategi, dan pengelolaan risiko agar keputusan tidak hanya didorong oleh hype market.",
  },
];

const journeyItems = [
  {
    step: "01",
    title: "Build Personal Brand",
    text: "Membangun identitas sebagai creator yang fokus pada edukasi digital, crypto, dan long-term asset mindset.",
  },
  {
    step: "02",
    title: "Create Educational Content",
    text: "Mengembangkan konten yang bisa membantu audience memahami peluang, risiko, dan narasi di dunia aset digital.",
  },
  {
    step: "03",
    title: "Develop Asset Dashboard",
    text: "Membuat dashboard portfolio untuk menampilkan asset allocation, profit/loss, dan harga crypto real-time.",
  },
  {
    step: "04",
    title: "Grow Digital Network",
    text: "Membuka peluang kolaborasi, networking, dan kerja sama dengan brand atau individu yang punya visi digital growth.",
  },
];

const philosophyItems = [
  {
    icon: Target,
    title: "Long-Term Thinking",
    text: "Fokus pada pertumbuhan jangka panjang, bukan hanya pergerakan market harian.",
  },
  {
    icon: BarChart3,
    title: "Data-Aware Decision",
    text: "Menggunakan data, chart, dan market context sebagai bahan pertimbangan sebelum mengambil keputusan.",
  },
  {
    icon: Compass,
    title: "Clear Direction",
    text: "Membangun portfolio dan konten dengan arah yang konsisten agar personal brand lebih kuat.",
  },
];

const coreValues = [
  "Consistency over hype",
  "Learn before investing",
  "Risk first, profit second",
  "Build trust with value",
  "Content with clear purpose",
  "Long-term digital growth",
];

export default function AboutPage() {
  const youtube = socials.find((social) => social.label === "YouTube");

  return (
    <section className="mx-auto w-[min(1180px,92%)] py-24">
      {/* Header */}
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
          About Me
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          Creator dengan mindset investor.
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Saya Akhmad Rozan, seorang Content Creator & Digital Asset Enthusiast
          yang membangun personal brand di antara dunia konten, crypto,
          digital asset, dan long-term growth.
        </p>
      </Reveal>

      {/* Mission */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {missionCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Reveal key={card.title} delay={index * 0.1}>
              <article className="glass h-full rounded-[28px] p-8 transition hover:-translate-y-2 hover:border-yellow-300/30">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-yellow-300 text-black">
                  <Icon size={25} />
                </div>

                <h2 className="mt-6 text-2xl font-black">{card.title}</h2>

                <p className="mt-4 leading-8 text-zinc-400">{card.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Main Story */}
      <div className="mt-20 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="glass relative h-full overflow-hidden rounded-[32px] p-8">
            <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="absolute bottom-[-100px] left-[-100px] h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <p className="relative text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              My Mission
            </p>

            <h2 className="relative mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Building digital influence with value, clarity, and consistency.
            </h2>

            <p className="relative mt-6 leading-8 text-zinc-400">
              Misi utama saya adalah membangun personal brand yang tidak hanya
              terlihat menarik secara visual, tetapi juga punya nilai edukasi.
              Fokusnya adalah membantu audience memahami dunia digital asset
              dengan cara yang lebih rapi, realistis, dan mudah dipahami.
            </p>

            <p className="relative mt-5 leading-8 text-zinc-400">
              Sebagai creator, saya ingin membuat konten yang punya arah.
              Sebagai investor, saya ingin membangun mindset yang lebih sabar,
              strategis, dan berbasis risk management.
            </p>

            <div className="relative mt-8 flex flex-wrap gap-4">
              {youtube && (
                <a
                  href={youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
                >
                  <PlayCircle size={17} />
                  Watch YouTube
                </a>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Contact Me
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5">
          {journeyItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="glass flex gap-5 rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-yellow-300/30">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-yellow-300 text-sm font-black text-black">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-xl font-black">{item.title}</h3>

                  <p className="mt-2 leading-7 text-zinc-400">{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Investment Philosophy */}
      <div className="mt-20">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Investment Philosophy
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
            Bukan hanya mencari profit, tapi membangun cara berpikir.
          </h2>

          <p className="mt-5 leading-8 text-zinc-400">
            Dalam dunia crypto dan digital asset, saya percaya bahwa mindset
            lebih penting daripada sekadar ikut tren. Portfolio yang kuat perlu
            dibangun dengan pemahaman, kesabaran, dan strategi yang jelas.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {philosophyItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.1}>
                <article className="glass h-full rounded-[28px] p-7 transition hover:-translate-y-2 hover:border-yellow-300/30">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl bg-white/5 text-yellow-300">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-xl font-black">{item.title}</h3>

                  <p className="mt-4 leading-7 text-zinc-400">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Core Values */}
      <Reveal>
        <div className="glass mt-20 grid gap-8 rounded-[32px] p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Core Values
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Prinsip yang membentuk arah konten dan keputusan.
            </h2>

            <p className="mt-5 leading-8 text-zinc-400">
              Nilai ini menjadi fondasi dalam membangun konten, portfolio, dan
              personal brand jangka panjang.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {coreValues.map((value) => (
              <div
                key={value}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.7)]" />

                <p className="text-sm font-bold text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Closing CTA */}
      <Reveal>
        <div className="mt-20 rounded-[32px] border border-yellow-300/20 bg-yellow-300 p-8 text-black md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr] lg:items-center">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-yellow-300">
                  <Rocket size={24} />
                </div>

                <p className="text-sm font-black uppercase tracking-[0.2em]">
                  Digital Growth
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-[-0.03em] md:text-5xl">
                Ready to build content, audience, and digital asset journey.
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-black/70">
                Saya terbuka untuk networking, kolaborasi, dan diskusi seputar
                content creation, crypto, personal brand, dan digital asset.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition hover:-translate-y-1"
              >
                View Portfolio
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white/30 px-6 py-4 font-black text-black transition hover:-translate-y-1"
              >
                Contact Me
                <Users size={18} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}