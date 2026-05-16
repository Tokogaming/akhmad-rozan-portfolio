import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Layers,
  PlayCircle,
  Rocket,
  Target,
  Video,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { socials } from "@/lib/data";

const showcaseProjects = [
  {
    number: "01",
    title: "HERANOLOGI YouTube Channel",
    category: "Content Platform",
    status: "Active",
    icon: Video,
    description:
      "Channel YouTube yang diarahkan untuk membangun edukasi, insight, dan personal brand seputar digital economy, crypto, dan market awareness.",
    highlights: [
      "Crypto education content",
      "Digital asset discussion",
      "Market insight storytelling",
    ],
    href: "https://www.youtube.com/@heranologi",
    cta: "Visit Channel",
  },
  {
    number: "02",
    title: "Digital Asset Dashboard",
    category: "Portfolio System",
    status: "Live Build",
    icon: BarChart3,
    description:
      "Dashboard portfolio pribadi untuk menampilkan asset allocation, portfolio value, profit/loss, dan harga crypto real-time dari API market.",
    highlights: [
      "BTC, ETH, SOL live price",
      "USD & IDR portfolio view",
      "Allocation chart system",
    ],
    href: "/assets",
    cta: "View Dashboard",
  },
  {
    number: "03",
    title: "Crypto Education Content System",
    category: "Content Strategy",
    status: "In Progress",
    icon: FileText,
    description:
      "Framework konten untuk membuat topik crypto dan digital asset lebih mudah dipahami oleh audience melalui struktur edukasi yang jelas.",
    highlights: [
      "Beginner-friendly topics",
      "Market narrative breakdown",
      "Long-term content positioning",
    ],
    href: "/contact",
    cta: "Discuss Strategy",
  },
  {
    number: "04",
    title: "Market Insight Series",
    category: "Research Content",
    status: "Planned",
    icon: Target,
    description:
      "Seri konten untuk membaca pergerakan market, narasi crypto, risk management, dan peluang aset digital secara lebih terstruktur.",
    highlights: [
      "Market trend observation",
      "Risk mindset education",
      "Weekly insight format",
    ],
    href: "/contact",
    cta: "Collaborate",
  },
  {
    number: "05",
    title: "Personal Brand Strategy",
    category: "Creator Identity",
    status: "Active",
    icon: Layers,
    description:
      "Membangun identitas sebagai content creator dan digital asset enthusiast yang punya arah komunikasi, visual, dan positioning yang konsisten.",
    highlights: [
      "Creator x investor positioning",
      "Premium crypto visual identity",
      "Professional portfolio website",
    ],
    href: "/about",
    cta: "Learn More",
  },
  {
    number: "06",
    title: "Long-Term Digital Growth",
    category: "Vision Project",
    status: "Ongoing",
    icon: Rocket,
    description:
      "Roadmap jangka panjang untuk membangun audience, trust, digital asset knowledge, dan peluang kolaborasi di ekosistem digital.",
    highlights: [
      "Audience growth",
      "Collaboration readiness",
      "Digital economy mindset",
    ],
    href: "/contact",
    cta: "Connect",
  },
];

export default function PortfolioPage() {
  const youtube = socials.find((social) => social.label === "YouTube");

  return (
    <section className="mx-auto w-[min(1180px,92%)] py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
          Portfolio / Project
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          Digital projects built around content, crypto, and personal brand.
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Kumpulan project dan arah pengembangan brand Akhmad Rozan sebagai
          content creator, crypto enthusiast, dan digital asset investor.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {youtube && (
            <a
              href={youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-6 py-4 font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
            >
              <PlayCircle size={18} />
              Watch YouTube
            </a>
          )}

          <Link
            href="/assets"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
          >
            View Asset Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {showcaseProjects.map((project, index) => {
          const Icon = project.icon;

          return (
            <Reveal key={project.title} delay={index * 0.07}>
              <article className="glass group relative h-full overflow-hidden rounded-[32px] p-8 transition hover:-translate-y-2 hover:border-yellow-300/30">
                <div className="absolute right-[-90px] top-[-90px] h-60 w-60 rounded-full bg-yellow-300/10 blur-3xl transition group-hover:bg-yellow-300/20" />
                <div className="absolute bottom-[-100px] left-[-100px] h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative flex flex-wrap items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-yellow-300 text-black">
                      <Icon size={25} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                        Project {project.number}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-400">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-zinc-300">
                    {project.status}
                  </span>
                </div>

                <h2 className="relative mt-8 text-2xl font-black leading-tight md:text-3xl">
                  {project.title}
                </h2>

                <p className="relative mt-4 leading-8 text-zinc-400">
                  {project.description}
                </p>

                <div className="relative mt-7 grid gap-3">
                  {project.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.7)]" />
                      <p className="text-sm font-semibold text-zinc-300">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8">
                  <Link
                    href={project.href}
                    target={project.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      project.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 font-black text-yellow-300 transition group-hover:gap-3"
                  >
                    {project.cta}
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="glass mt-16 grid gap-8 rounded-[32px] p-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Project Direction
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Portfolio ini dirancang untuk menunjukkan arah, bukan hanya daftar karya.
            </h2>

            <p className="mt-5 leading-8 text-zinc-400">
              Setiap project di halaman ini mendukung satu positioning utama:
              membangun personal brand yang kuat di antara content creation,
              crypto education, dan digital asset strategy.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Creator identity yang jelas",
              "Asset dashboard yang dinamis",
              "Konten edukasi yang bisa dikembangkan",
              "Siap untuk kolaborasi dan networking",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}