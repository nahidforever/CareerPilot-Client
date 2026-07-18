"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, BriefcaseBusiness, PieChartIcon } from "lucide-react";

export interface MonthlyJobData {
  month: string;
  jobs: number;
}

export interface JobStatusData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  monthlyData: MonthlyJobData[];
  statusData: JobStatusData[];
  totalJobs: number;
}

const pieColors = ["#34d399", "#f87171"];

const tooltipContentStyle = {
  backgroundColor: "#0b1422",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.30)",
};

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
        <BriefcaseBusiness className="h-6 w-6" />
      </span>

      <p className="mt-4 text-sm font-medium text-slate-300">
        No chart data available
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-600">
        Publish your first job to generate dashboard analytics.
      </p>
    </div>
  );
}

export default function DashboardCharts({
  monthlyData,
  statusData,
  totalJobs,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      {/* Monthly publication chart */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-blue-300">
              <BarChart3 className="h-4 w-4" />

              <p className="text-xs font-semibold uppercase tracking-[0.13em]">
                Publication activity
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
              Jobs published by month
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your job publication activity during the last six months.
            </p>
          </div>

          <span className="rounded-xl border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-xs font-medium text-blue-300">
            Last 6 months
          </span>
        </div>

        <div className="h-[310px] p-4 sm:p-6">
          {totalJobs > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  dy={10}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(59,130,246,0.06)",
                  }}
                  contentStyle={tooltipContentStyle}
                  labelStyle={{
                    color: "#cbd5e1",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "#93c5fd",
                  }}
                />

                <Bar
                  dataKey="jobs"
                  name="Published jobs"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={52}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </section>

      {/* Job status chart */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a2a] shadow-xl shadow-black/10">
        <div className="border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2 text-violet-300">
            <PieChartIcon className="h-4 w-4" />

            <p className="text-xs font-semibold uppercase tracking-[0.13em]">
              Job status
            </p>
          </div>

          <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
            Open and expired jobs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current status of your published opportunities.
          </p>
        </div>

        <div className="h-[310px] p-4 sm:p-6">
          {totalJobs > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={4}
                  stroke="transparent"
                >
                  {statusData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={{
                    color: "#cbd5e1",
                  }}
                  itemStyle={{
                    color: "#e2e8f0",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </section>
    </div>
  );
}
