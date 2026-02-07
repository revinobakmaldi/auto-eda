"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Hash, Type } from "lucide-react";
import { GlassmorphismCard } from "@/components/shared/glassmorphism-card";
import { cardVariants } from "@/lib/animations";
import { formatNumber, formatPercentage } from "@/lib/utils";
import type { VariableInfo } from "@/lib/types";

interface VariableCardProps {
  variable: VariableInfo;
}

export function VariableCard({ variable }: VariableCardProps) {
  const isNumeric = !!variable.numeric;

  return (
    <GlassmorphismCard>
      <motion.div variants={cardVariants}>
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`rounded-md p-1.5 ${isNumeric ? "bg-secondary/10" : "bg-accent/10"}`}>
            {isNumeric ? (
              <Hash className="h-4 w-4 text-secondary" />
            ) : (
              <Type className="h-4 w-4 text-accent" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-mono text-sm font-semibold text-foreground">
              {variable.name}
            </h3>
            <p className="text-xs text-gray-400">
              {variable.dtype} &bull; {variable.n_unique} unique
              {variable.n_missing > 0 && (
                <span className="text-orange-400">
                  {" "}&bull; {formatPercentage(variable.missing_percentage)} missing
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Numeric Stats */}
        {variable.numeric && variable.numeric.mean !== null && (
          <div>
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Mean", value: formatNumber(variable.numeric.mean) },
                { label: "Median", value: formatNumber(variable.numeric.median) },
                { label: "Std Dev", value: formatNumber(variable.numeric.std) },
                { label: "Min", value: formatNumber(variable.numeric.min) },
                { label: "Max", value: formatNumber(variable.numeric.max) },
                { label: "Skewness", value: formatNumber(variable.numeric.skewness) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/5 px-2 py-1.5">
                  <p className="text-gray-400">{stat.label}</p>
                  <p className="font-mono font-medium text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {variable.numeric.histogram.length > 0 && (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={variable.numeric.histogram}
                    margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
                  >
                    <XAxis dataKey="label" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#ededed",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Categorical Stats */}
        {variable.categorical && (
          <div>
            <p className="mb-2 text-xs text-gray-400">
              Top: <span className="font-mono text-foreground">{variable.categorical.top_value}</span>{" "}
              ({variable.categorical.top_frequency}×)
            </p>

            {variable.categorical.value_counts.length > 0 && (
              <div className="space-y-1.5">
                {variable.categorical.value_counts.slice(0, 6).map((vc) => (
                  <div key={vc.value} className="flex items-center gap-2 text-xs">
                    <span className="w-20 truncate font-mono text-gray-300">{vc.value}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${vc.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right tabular-nums text-gray-400">
                      {formatPercentage(vc.percentage)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </GlassmorphismCard>
  );
}
