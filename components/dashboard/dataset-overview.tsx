"use client";

import { motion } from "framer-motion";
import {
  Rows3,
  Columns3,
  HardDrive,
  Copy,
  AlertTriangle,
  Database,
} from "lucide-react";
import { staggerContainer, cardVariants } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassmorphismCard } from "@/components/shared/glassmorphism-card";
import { formatPercentage } from "@/lib/utils";
import type { DatasetOverview as DatasetOverviewType } from "@/lib/types";

interface DatasetOverviewProps {
  overview: DatasetOverviewType;
}

export function DatasetOverview({ overview }: DatasetOverviewProps) {
  const cards = [
    {
      label: "Rows",
      value: overview.n_rows.toLocaleString(),
      icon: Rows3,
      color: "text-primary",
    },
    {
      label: "Columns",
      value: overview.n_columns.toString(),
      icon: Columns3,
      color: "text-secondary",
    },
    {
      label: "Memory",
      value: overview.memory_usage_display,
      icon: HardDrive,
      color: "text-accent",
    },
    {
      label: "Duplicates",
      value: `${overview.n_duplicates.toLocaleString()} (${formatPercentage(overview.duplicate_percentage)})`,
      icon: Copy,
      color: overview.n_duplicates > 0 ? "text-yellow-400" : "text-primary",
    },
    {
      label: "Missing Cells",
      value: `${overview.total_missing_cells.toLocaleString()} (${formatPercentage(overview.missing_percentage)})`,
      icon: AlertTriangle,
      color: overview.total_missing_cells > 0 ? "text-orange-400" : "text-primary",
    },
    {
      label: "Data Types",
      value: Object.entries(overview.dtypes_summary)
        .map(([k, v]) => `${v} ${k}`)
        .join(", "),
      icon: Database,
      color: "text-secondary",
    },
  ];

  return (
    <section id="section-overview">
      <SectionHeader
        badge="Overview"
        title="Dataset Summary"
        subtitle="Key statistics about your dataset at a glance"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <GlassmorphismCard key={card.label}>
              <motion.div variants={cardVariants} className="flex items-start gap-3">
                <div className="rounded-lg bg-white/5 p-2">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {card.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
              </motion.div>
            </GlassmorphismCard>
          );
        })}
      </motion.div>
    </section>
  );
}
