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
  // Blue (negative) → White (zero) → Emerald (positive)
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
  const cellSize = Math.min(60, Math.max(30, 500 / n));
  const labelWidth = 100;
  const svgWidth = labelWidth + n * cellSize;
  const svgHeight = labelWidth + n * cellSize;

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
          <svg
            width={svgWidth}
            height={svgHeight}
            className="mx-auto"
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Column labels (top) */}
            {columns.map((col, i) => (
              <text
                key={`col-${i}`}
                x={labelWidth + i * cellSize + cellSize / 2}
                y={labelWidth - 8}
                textAnchor="end"
                fontSize={Math.min(11, cellSize * 0.35)}
                fill="#9ca3af"
                transform={`rotate(-45, ${labelWidth + i * cellSize + cellSize / 2}, ${labelWidth - 8})`}
              >
                {col.length > 12 ? col.slice(0, 10) + "…" : col}
              </text>
            ))}

            {/* Row labels (left) */}
            {columns.map((col, i) => (
              <text
                key={`row-${i}`}
                x={labelWidth - 8}
                y={labelWidth + i * cellSize + cellSize / 2 + 4}
                textAnchor="end"
                fontSize={Math.min(11, cellSize * 0.35)}
                fill="#9ca3af"
              >
                {col.length > 12 ? col.slice(0, 10) + "…" : col}
              </text>
            ))}

            {/* Cells */}
            {matrix.map((row, i) =>
              row.map((val, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={labelWidth + j * cellSize}
                  y={labelWidth + i * cellSize}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  rx={3}
                  fill={correlationColor(val)}
                  className="cursor-pointer transition-opacity hover:opacity-80"
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
                />
              ))
            )}

            {/* Cell values (show if cells are large enough) */}
            {cellSize >= 40 &&
              matrix.map((row, i) =>
                row.map((val, j) => (
                  <text
                    key={`val-${i}-${j}`}
                    x={labelWidth + j * cellSize + cellSize / 2 - 0.5}
                    y={labelWidth + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={Math.min(10, cellSize * 0.25)}
                    fill={Math.abs(val) > 0.5 ? "#fff" : "#9ca3af"}
                    pointerEvents="none"
                  >
                    {val != null ? val.toFixed(2) : ""}
                  </text>
                ))
              )}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
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
