import {
  ArrowRight,
  Camera,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { socials } from "@/lib/data";

const iconMap = {
  WhatsApp: MessageCircle,
  Telegram: Send,
  Email: Mail,
  YouTube: Video,
  Instagram: Camera,
};

const contactHighlights = [
  {
    title: "Open for Collaboration",
    text: "Terbuka untuk kerja sama konten, networking, diskusi crypto, digital asset, dan personal brand.",
    icon: Users,
  },
  {
    title: "Business Inquiry",
    text: "Untuk kerja sama profesional, sponsorship, partnership, atau peluang kolaborasi digital.",
    icon: ShieldCheck,
  },
  {
    title: "Creator Networking",
    text: "Cocok untuk diskusi seputar YouTube, content strategy, digital growth, dan market education.",
    icon: Sparkles,
  },
];

export default function ContactPage() {
  const whatsapp = socials.find((social) => social.label === "WhatsApp");
  const email = socials.find((social) => social.label === "Email");

  return (
    <section className="mx-auto w-[min(1180px,92%)] py-24">
      {/* Header */}
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <Reveal>
          <div className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399]" />
            Open for Collaboration
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-[-0.05em] md:text-7xl">
            Let&apos;s connect and build something valuable.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            Untuk kerja sama, networking, diskusi content creation, crypto,
            digital asset, atau personal brand, kamu bisa menghubungi saya
            melalui channel resmi berikut.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            {whatsapp && (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-6 py-4 font-black text-black transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Chat WhatsApp
                <ArrowRight size={18} />
              </a>
            )}

            {email && (
              <a
                href={email.href}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Send Email
                <Mail size={18} />
              </a>
            )}
          </div>
        </Reveal>

        {/* Contact Summary Card */}
        <Reveal delay={0.15}>
          <div className="glass relative overflow-hidden rounded-[36px] p-8">
            <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="absolute bottom-[-100px] left-[-100px] h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                Contact Purpose
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em]">
                Creator x Investor Communication Hub
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                Halaman ini dibuat sebagai pusat kontak profesional untuk
                collaboration, business inquiry, networking, dan diskusi seputar
                digital asset.
              </p>
            </div>

            <div className="relative mt-8 grid gap-4">
              {[
                "Content collaboration",
                "Crypto & digital asset discussion",
                "Personal brand networking",
                "Business inquiry",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.7)]" />
                  <p className="text-sm font-bold text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Contact Channels */}
      <div className="mt-20">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Official Channels
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
            Choose the best way to reach me.
          </h2>

          <p className="mt-5 leading-8 text-zinc-400">
            Semua link di bawah sudah diarahkan ke kontak dan sosial media yang
            aktif. Pilih channel sesuai kebutuhan kamu.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {socials.map((social, index) => {
            const Icon = iconMap[social.label as keyof typeof iconMap];

            return (
              <Reveal key={social.label} delay={index * 0.07}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex h-full gap-5 rounded-[28px] p-6 transition hover:-translate-y-2 hover:border-yellow-300/40"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-yellow-300 text-black">
                    <Icon size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-400">
                      {social.label}
                    </p>

                    <h3 className="mt-2 text-xl font-black group-hover:text-yellow-300">
                      {social.value}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      Klik untuk membuka {social.label} secara langsung.
                    </p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Contact Highlights */}
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {contactHighlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={index * 0.1}>
              <article className="glass h-full rounded-[28px] p-7 transition hover:-translate-y-2 hover:border-yellow-300/30">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-yellow-300">
                  <Icon size={25} />
                </div>

                <h3 className="mt-6 text-xl font-black">{item.title}</h3>

                <p className="mt-4 leading-7 text-zinc-400">{item.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Final CTA */}
      <Reveal>
        <div className="mt-20 rounded-[32px] border border-yellow-300/20 bg-yellow-300 p-8 text-black md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">
                Ready to Connect
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
                Punya ide kolaborasi atau ingin diskusi digital asset?
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-black/70">
                Hubungi saya melalui WhatsApp atau email untuk pembahasan yang
                lebih jelas dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {whatsapp && (
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition hover:-translate-y-1"
                >
                  WhatsApp Me
                  <MessageCircle size={18} />
                </a>
              )}

              {email && (
                <a
                  href={email.href}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white/30 px-6 py-4 font-black text-black transition hover:-translate-y-1"
                >
                  Email Me
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}