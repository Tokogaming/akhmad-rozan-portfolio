"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks, site } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070d]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 w-[min(1180px,92%)] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-black shadow-[0_0_35px_rgba(247,201,72,0.35)]">
            AR
          </span>
          <span>{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold transition ${
                  active
                    ? "text-yellow-300"
                    : "text-zinc-400 hover:text-yellow-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mb-4 grid w-[min(1180px,92%)] gap-2 rounded-3xl border border-white/10 bg-[#090b13] p-4 md:hidden">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-white/5 hover:text-yellow-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}