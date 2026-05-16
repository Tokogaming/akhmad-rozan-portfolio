"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { assetData } from "@/lib/data";

export default function AssetCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass rounded-[28px] p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Donut Chart
            </p>
            <h3 className="mt-2 text-2xl font-black">Asset Distribution</h3>
          </div>
          <p className="text-sm font-semibold text-zinc-400">Total 100%</p>
        </div>

        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetData}
                dataKey="allocation"
                nameKey="symbol"
                innerRadius={85}
                outerRadius={125}
                paddingAngle={4}
              >
                {assetData.map((asset) => (
                  <Cell key={asset.symbol} fill={asset.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${value}%`, "Allocation"]}
                contentStyle={{
                  background: "#0b0f1a",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {assetData.map((asset) => (
            <div
              key={asset.symbol}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <p className="text-xs font-black">{asset.symbol}</p>
              </div>
              <p className="mt-2 text-sm font-bold text-zinc-400">
                {asset.allocation}%
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-[28px] p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Bar Chart
            </p>
            <h3 className="mt-2 text-2xl font-black">Allocation Breakdown</h3>
          </div>
          <p className="text-sm font-semibold text-zinc-400">Manual Data</p>
        </div>

        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

              <XAxis
                dataKey="symbol"
                stroke="#a1a1aa"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#a1a1aa"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                formatter={(value) => [`${value}%`, "Allocation"]}
                contentStyle={{
                  background: "#0b0f1a",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />

              <Bar dataKey="allocation" radius={[14, 14, 0, 0]}>
                {assetData.map((asset) => (
                  <Cell key={asset.symbol} fill={asset.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}