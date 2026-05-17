import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Rocket,
  Target,
  Video,
} from "lucide-react";

const projects = [
  {
    number: "01",
    title: "HERANOLOGI YouTube Channel",
    category: "Content Platform",
    status: "Active",
    description:
      "Channel YouTube yang diarahkan untuk membangun edukasi, insight, dan personal brand seputar digital economy, crypto, dan market awareness.",
    icon: Video,
    href: "https://www.youtube.com/@heranologi",
    cta: "Visit Channel",
    external: true,
    points: [
      "Crypto education content",
      "Digital asset discussion",
      "Market insight storytelling",
    ],
  },
  {
    number: "02",
    title: "Digital Asset Dashboard",
    category: "Portfolio System",
    status: "Live Build",
    description:
      "Dashboard portfolio pribadi untuk menampilkan asset allocation, portfolio value, profit/loss, dan harga crypto real-time dari API market.",
    icon: BarChart3,
    href: "/assets",
    cta: "View Dashboard",
    external: false,
    points: [
      "BTC, ETH, SOL, BNB live price",
      "USD & IDR portfolio view",
      "Allocation chart system",
    ],
  },
  {
    number: "03",
    title: "Crypto Education Content System",
    category: "Content Strategy",
    status: "In Progress",
    description:
      "Framework konten untuk membuat topik crypto dan digital asset lebih mudah dipahami oleh audience melalui struktur edukasi yang jelas.",
    icon: FileText,
    href: "/contact",
    cta: "Discuss Project",
    external: false,
    points: [
      "Beginner-friendly topics",
      "Short-form content planning",
      "Educational storytelling",
    ],
  },
  {
    number: "04",
    title: "Research Content Library",
    category: "Research Content",
    status: "Planned",
    description:
      "Sistem pengumpulan ide, insight market, dan referensi konten agar proses produksi konten lebih rapi, konsisten, dan terukur.",
    icon: Target,
    href: "/contact",
    cta: "Explore Idea",
    external: false,
    points: [
      "Market topic database",
      "Content angle mapping",
      "Long-term research archive",
    ],
  },
  {
    number: "05",
    title: "Personal Brand Strategy",
    category: "Brand System",
    status: "Ongoing",
    description:
      "Membangun identitas sebagai content creator dan digital asset enthusiast yang punya arah komunikasi, visual, dan positioning yang konsisten.",
    icon: CheckCircle2,
    href: "/about",
    cta: "View About",
    external: false,
    points: [
      "Creator x investor positioning",
      "Consistent brand direction",
      "Trust-focused communication",
    ],
  },
  {
    number: "06",
    title: "Long-Term Digital Growth",
    category: "Vision Project",
    status: "Ongoing",
    description:
      "Roadmap jangka panjang untuk membangun audience, trust, digital asset knowledge, dan peluang kolaborasi di ekosistem digital.",
    icon: Rocket,
    href: "/contact",
    cta: "Connect",
    external: false,
    points: [
      "Audience growth",
      "Digital economy positioning",
      "Collaboration opportunity",
    ],
  },
];

export default function PortfolioPage() {
  return (
    <section className="mx-auto w-[min(1180px,92%)] pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-300">
          Portfolio / Project
        </p>

        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-7xl">
          Digital projects built around content, crypto, and personal brand.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
          Kumpulan project dan arah pengembangan brand Akhmad Rozan sebagai
          content creator, crypto enthusiast, dan digital asset investor.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="https://www.youtube.com/@heranologi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow-300 px-7 py-4 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
          >
            <Video size={18} />
            Watch YouTube
          </Link>

          <Link
            href="/assets"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:border-yellow-300/30"
          >
            View Asset Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => {
          const Icon = project.icon;

          const CardContent = (
            <article className="project-card-mobile-safe group h-full rounded-[32px] border border-white/10 bg-[#10131d] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-yellow-300/30 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-black shadow-[0_16px_40px_rgba(250,204,21,0.18)] md:h-20 md:w-20">
                    <Icon size={30} strokeWidth={2.5} />
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                      Project {project.number}
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-400 md:text-lg">
                      {project.category}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-zinc-300 md:text-sm">
                  {project.status}
                </span>
              </div>

              <div className="mt-10">
                <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">
                  {project.title}
                </h2>

                <p className="mt-6 text-base leading-8 text-zinc-400 md:text-lg">
                  {project.description}
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                {project.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-zinc-300"
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full bg-yellow-300" />
                    <span className="text-sm font-semibold md:text-base">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-3 text-lg font-black text-yellow-300">
                  {project.cta}
                  <ArrowRight
                    size={22}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </article>
          );

          if (project.external) {
            return (
              <a
                key={project.number}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <Link key={project.number} href={project.href}>
              {CardContent}
            </Link>
          );
        })}
      </div>

      <div className="mt-16 rounded-[32px] border border-yellow-300/20 bg-yellow-300/10 p-7 text-center md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
          Collaboration
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
          Open for content, brand, and digital growth collaboration.
        </h2>

        <p className="mx-auto mt-5 max-w-3xl leading-8 text-zinc-400">
          Untuk kerja sama, networking, atau diskusi seputar content creation,
          crypto education, digital asset, dan personal brand growth, kamu bisa
          menghubungi saya melalui halaman contact.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow-300 px-7 py-4 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
        >
          Contact Me
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}