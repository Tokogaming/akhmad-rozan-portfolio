"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  BadgeDollarSign,
  Bitcoin,
  CandlestickChart,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";

/*
  Kalau kamu sudah punya foto tanpa background:
  1. Buat folder: public/images
  2. Masukkan foto dengan nama: profile.png
  3. Ubah useProfileImage dari false menjadi true
*/

const useProfileImage = false;
const profileImagePath = "/images/profile.png";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      {/* Floating Badge Top */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-10 z-20 hidden rounded-3xl border border-white/10 bg-[#090b13]/90 p-4 shadow-2xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow-300 text-black">
            <Video size={22} />
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-400">Creator Focus</p>
            <h4 className="text-sm font-black text-white">Crypto Content</h4>
          </div>
        </div>
      </motion.div>

      {/* Floating Badge Bottom */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 bottom-14 z-20 hidden rounded-3xl border border-white/10 bg-[#090b13]/90 p-4 shadow-2xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-black">
            <TrendingUp size={22} />
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-400">Asset Mindset</p>
            <h4 className="text-sm font-black text-white">Long-Term Growth</h4>
          </div>
        </div>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="glass relative overflow-hidden rounded-[40px] p-8"
      >
        <div className="absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-90px] h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

        {/* Visual Area */}
        <div className="relative mx-auto grid h-64 w-64 place-items-center rounded-full bg-gradient-to-br from-yellow-300 via-violet-500 to-emerald-400 p-[6px]">
          <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#080a12]">
            {useProfileImage ? (
              <Image
                src={profileImagePath}
                alt="Akhmad Rozan profile"
                width={260}
                height={260}
                priority
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="relative grid h-full w-full place-items-center">
                <div className="absolute inset-8 rounded-full border border-yellow-300/20" />
                <div className="absolute inset-14 rounded-full border border-violet-400/20" />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-6 rounded-full border border-dashed border-yellow-300/25"
                />

                <div className="relative text-center">
                  <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-[28px] bg-yellow-300 text-black shadow-[0_0_45px_rgba(247,201,72,0.35)]">
                    <Bitcoin size={42} />
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">
                    Creator
                  </p>

                  <h2 className="mt-1 text-4xl font-black text-yellow-300">
                    AR
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="relative mt-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
            Personal Brand Portfolio
          </div>

          <h3 className="text-3xl font-black">Akhmad Rozan</h3>

          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Content Creator & Digital Asset Enthusiast
          </p>
        </div>

        {/* Tags */}
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          {["YouTube", "Crypto", "Digital Asset", "Stocks"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Metrics */}
        <div className="relative mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <Video className="mx-auto text-red-400" />
            <p className="mt-2 text-xs font-bold text-zinc-400">Creator</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <CandlestickChart className="mx-auto text-emerald-400" />
            <p className="mt-2 text-xs font-bold text-zinc-400">Market</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <Sparkles className="mx-auto text-yellow-300" />
            <p className="mt-2 text-xs font-bold text-zinc-400">Brand</p>
          </div>
        </div>

        {/* Mini Dashboard */}
        <div className="relative mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-zinc-400">
                Portfolio Direction
              </p>

              <h4 className="mt-1 text-sm font-black text-white">
                Creator x Investor Growth
              </h4>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow-300 text-black">
              <BadgeDollarSign size={22} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}