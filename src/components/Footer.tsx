import Link from "next/link";
import { Mail, MessageCircle, Send, Video } from "lucide-react";
import { navLinks, socials } from "@/lib/data";

const footerSocialIcons = {
  WhatsApp: MessageCircle,
  Telegram: Send,
  Email: Mail,
  YouTube: Video,
};

export default function Footer() {
  const mainSocials = socials.filter((social) =>
    ["WhatsApp", "Telegram", "Email", "YouTube"].includes(social.label)
  );

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto w-[min(1180px,92%)] py-10">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.7fr_0.8fr]">
          <div>
            <Link href="/" className="flex w-fit items-center gap-3 font-extrabold">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-black shadow-[0_0_35px_rgba(247,201,72,0.35)]">
                AR
              </span>
              <span>Akhmad Rozan</span>
            </Link>

            <p className="mt-5 max-w-md leading-7 text-zinc-400">
              Content Creator & Digital Asset Enthusiast building a personal
              brand around content, crypto, market awareness, and long-term
              digital growth.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              Navigation
            </h3>

            <div className="mt-5 grid gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold text-zinc-400 transition hover:text-yellow-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              Connect
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">
              {mainSocials.map((social) => {
                const Icon =
                  footerSocialIcons[
                    social.label as keyof typeof footerSocialIcons
                  ];

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition hover:-translate-y-1 hover:border-yellow-300/40 hover:text-yellow-300"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            <p className="mt-5 text-sm leading-6 text-zinc-500">
              Open for collaboration, networking, and digital asset discussion.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>© 2026 Akhmad Rozan. All rights reserved.</p>
          <p>Built for Content, Crypto & Digital Growth.</p>
        </div>
      </div>
    </footer>
  );
}