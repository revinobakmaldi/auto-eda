"use client";

import { motion } from "framer-motion";
import { staggerContainer, cardVariants } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassmorphismCard } from "@/components/shared/glassmorphism-card";
import { formatPercentage } from "@/lib/utils";
import type { MissingValueInfo } from "@/lib/types";

interface MissingValuesProps {
  missingValues: MissingValueInfo[];
}

function getBarColor(pct: number): string {
  if (pct < 5) return "bg-emerald-500";
  if (pct < 20) return "bg-yellow-500";
  if (pct < 50) return "bg-orange-500";
  return "bg-red-500";
}

export function MissingValues({ missingValues }: MissingValuesProps) {
  if (missingValues.length === 0) return null;

  return (
    <section id="section-missing">
      <SectionHeader
        badge="Missing Values"
        title="Data Completeness"
        subtitle="Columns with missing or null values"
      />
      <GlassmorphismCard hover={false}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {missingValues.map((mv) => (
            <motion.div
              key={mv.column}
              variants={cardVariants}
              className="flex items-center gap-3"
            >
              <span className="w-32 truncate font-mono text-sm text-zinc-700 dark:text-zinc-300 sm:w-44">
                {mv.column}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${mv.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${getBarColor(mv.percentage)}`}
                />
              </div>
              <span className="w-20 text-right font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {mv.count.toLocaleString()} ({formatPercentage(mv.percentage)})
              </span>
            </motion.div>
          ))}
        </motion.div>
      </GlassmorphismCard>
    </section>
  );
}
