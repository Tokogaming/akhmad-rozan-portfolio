import {
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import type { IconType } from "react-icons";

type ContactChannel = {
  label: string;
  value: string;
  description: string;
  href: string;
  icon: IconType;
  iconColor: string;
  iconBg: string;
  borderGlow: string;
};

const contactChannels: ContactChannel[] = [
  {
    label: "WhatsApp",
    value: "+62 851-4350-9045",
    description: "Klik untuk membuka WhatsApp secara langsung.",
    href: "https://wa.me/6285143509045",
    icon: FaWhatsapp,
    iconColor: "text-[#25D366]",
    iconBg: "bg-[#25D366]/12",
    borderGlow: "hover:border-[#25D366]/40 hover:shadow-[#25D366]/10",
  },
  {
    label: "Telegram",
    value: "@Rozan39",
    description: "Klik untuk membuka Telegram secara langsung.",
    href: "https://t.me/Rozan39",
    icon: FaTelegramPlane,
    iconColor: "text-[#229ED9]",
    iconBg: "bg-[#229ED9]/12",
    borderGlow: "hover:border-[#229ED9]/40 hover:shadow-[#229ED9]/10",
  },
  {
    label: "Email",
    value: "akhmadrozan8@gmail.com",
    description: "Klik untuk membuka Email secara langsung.",
    href: "mailto:akhmadrozan8@gmail.com",
    icon: SiGmail,
    iconColor: "text-[#EA4335]",
    iconBg: "bg-[#EA4335]/12",
    borderGlow: "hover:border-[#EA4335]/40 hover:shadow-[#EA4335]/10",
  },
  {
    label: "YouTube",
    value: "@heranologi",
    description: "Klik untuk membuka YouTube secara langsung.",
    href: "https://www.youtube.com/@heranologi",
    icon: FaYoutube,
    iconColor: "text-[#FF0000]",
    iconBg: "bg-[#FF0000]/12",
    borderGlow: "hover:border-[#FF0000]/40 hover:shadow-[#FF0000]/10",
  },
  {
    label: "Instagram",
    value: "@jjannz36",
    description: "Klik untuk membuka Instagram secara langsung.",
    href: "https://www.instagram.com/jjannz36",
    icon: FaInstagram,
    iconColor: "text-[#E4405F]",
    iconBg: "bg-[#E4405F]/12",
    borderGlow: "hover:border-[#E4405F]/40 hover:shadow-[#E4405F]/10",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060b] text-white">
      <div className="pointer-events-none absolute left-[-16rem] top-32 h-[34rem] w-[34rem] rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-18rem] top-40 h-[38rem] w-[38rem] rounded-full bg-yellow-400/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-16rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-zinc-500/10 blur-[120px]" />

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-24 md:px-10 md:pt-32">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.42em] text-yellow-300">
            Official Channels
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl">
            Choose the best way to reach me.
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-9 text-zinc-400">
            Semua link di bawah sudah diarahkan ke kontak dan sosial media yang
            aktif. Pilih channel sesuai kebutuhan kamu.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  channel.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] ${channel.borderGlow}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-yellow-300/[0.04] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start gap-5">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${channel.iconBg} shadow-lg`}
                  >
                    <Icon className={`text-3xl ${channel.iconColor}`} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-400">
                      {channel.label}
                    </p>

                    <p className="mt-3 break-words text-2xl font-black leading-tight tracking-[-0.03em] text-white">
                      {channel.value}
                    </p>

                    <p className="mt-5 max-w-sm text-base leading-8 text-zinc-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-yellow-300/20 bg-yellow-300/[0.07] p-7">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-yellow-300">
              Fast Response
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
              WhatsApp & Telegram
            </h2>
            <p className="mt-4 leading-8 text-zinc-400">
              Cocok untuk komunikasi cepat, diskusi project, atau kebutuhan
              kolaborasi langsung.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-yellow-300">
              Business
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
              Email Contact
            </h2>
            <p className="mt-4 leading-8 text-zinc-400">
              Cocok untuk penawaran kerja sama, proposal, undangan, atau
              komunikasi yang lebih formal.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-yellow-300">
              Social Media
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
              YouTube & Instagram
            </h2>
            <p className="mt-4 leading-8 text-zinc-400">
              Cocok untuk melihat konten, personal brand, update visual, dan
              aktivitas publik.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}