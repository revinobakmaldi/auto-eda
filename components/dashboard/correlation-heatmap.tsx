"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassmorphismCard } from "@/components/shared/glassmorphism-card";
import { fadeInUp } from "@/lib/animations";
import type { CorrelationData } from "@/lib/types";

interface CorrelationHeatmapProps {
  correlations: CorrelationData;
}

function correlationColor(value: number | null): string {
  if (value === null || isNaN(value)) return "#1f2937";
  const clamped = Math.max(-1, Math.min(1, value));
  if (clamped >= 0) {
    const intensity = clamped;
    const r = Math.round(255 - intensity * (255 - 16));
    const g = Math.round(255 - intensity * (255 - 185));
    const b = Math.round(255 - intensity * (255 - 129));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const intensity = -clamped;
    const r = Math.round(255 - intensity * (255 - 59));
    const g = Math.round(255 - intensity * (255 - 130));
    const b = Math.round(255 - intensity * (255 - 246));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function CorrelationHeatmap({ correlations }: CorrelationHeatmapProps) {
  const { columns, matrix } = correlations;
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    row: string;
    col: string;
    val: number;
  } | null>(null);

  if (columns.length < 2) return null;

  const n = columns.length;

  return (
    <section id="section-correlations">
      <SectionHeader
        badge="Correlations"
        title="Correlation Matrix"
        subtitle="Pearson correlation between numeric variables"
      />
      <GlassmorphismCard hover={false}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <div className="inline-block min-w-full">
            {/* Column headers */}
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `auto repeat(${n}, minmax(48px, 1fr))`,
              }}
            >
              {/* Empty top-left corner */}
              <div />
              {columns.map((col) => (
                <div
                  key={`col-${col}`}
                  className="truncate px-1 pb-2 text-center font-mono text-xs text-gray-400"
                  title={col}
                >
                  {col}
                </div>
              ))}

              {/* Rows */}
              {matrix.map((row, i) => (
                <>
                  {/* Row label */}
                  <div
                    key={`row-label-${i}`}
                    className="flex items-center justify-end truncate pr-3 font-mono text-xs text-gray-400"
                    title={columns[i]}
                  >
                    {columns[i]}
                  </div>
                  {/* Cells */}
                  {row.map((val, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className="flex aspect-square cursor-pointer items-center justify-center rounded-md text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ backgroundColor: correlationColor(val) }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          row: columns[i],
                          col: columns[j],
                          val,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <span
                        className={
                          Math.abs(val) > 0.5 ? "text-white" : "text-gray-400"
                        }
                      >
                        {val != null ? val.toFixed(2) : ""}
                      </span>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>-1</span>
            <div className="flex h-3 w-40 overflow-hidden rounded-full">
              <div className="flex-1" style={{ background: "rgb(59, 130, 246)" }} />
              <div className="flex-1" style={{ background: "rgb(157, 193, 251)" }} />
              <div className="flex-1" style={{ background: "rgb(255, 255, 255)" }} />
              <div className="flex-1" style={{ background: "rgb(136, 220, 192)" }} />
              <div className="flex-1" style={{ background: "rgb(16, 185, 129)" }} />
            </div>
            <span>+1</span>
          </div>
        </motion.div>
      </GlassmorphismCard>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 text-xs text-gray-200 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 50,
            transform: "translateX(-50%)",
          }}
        >
          <span className="font-mono">{tooltip.row}</span> &times;{" "}
          <span className="font-mono">{tooltip.col}</span>:{" "}
          <span className="font-semibold text-primary">{tooltip.val?.toFixed(3)}</span>
        </div>
      )}
    </section>
  );
}
