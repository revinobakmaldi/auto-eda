"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassmorphismCard } from "@/components/shared/glassmorphism-card";
import { fadeInUp } from "@/lib/animations";

interface DataSampleProps {
  sampleRows: Record<string, unknown>[];
  columns: string[];
}

function getTypeBadge(value: unknown): { label: string; className: string } {
  if (value === null || value === undefined || value === "") {
    return { label: "null", className: "bg-red-500/10 text-red-400" };
  }
  if (typeof value === "number") {
    return { label: "num", className: "bg-secondary/10 text-secondary" };
  }
  if (typeof value === "boolean") {
    return { label: "bool", className: "bg-purple-500/10 text-purple-400" };
  }
  return { label: "str", className: "bg-accent/10 text-accent" };
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "\u2014";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toLocaleString();
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return String(value);
}

export function DataSample({ sampleRows, columns }: DataSampleProps) {
  if (sampleRows.length === 0) return null;

  return (
    <section id="section-sample">
      <SectionHeader
        badge="Sample"
        title="Data Preview"
        subtitle={`First ${sampleRows.length} rows of the dataset`}
      />
      <GlassmorphismCard hover={false} className="overflow-hidden p-0">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-zinc-100 dark:border-zinc-800/30 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                    i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20"
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">
                    {i + 1}
                  </td>
                  {columns.map((col) => {
                    const value = row[col];
                    const badge = getTypeBadge(value);
                    return (
                      <td key={col} className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">
                            {formatCell(value)}
                          </span>
                          {(value === null || value === undefined) && (
                            <span
                              className={`rounded px-1 py-0.5 text-[10px] font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </GlassmorphismCard>
    </section>
  );
}
