"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, RotateCcw } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import type { DatasetOverview } from "@/lib/types";

interface DashboardHeaderProps {
  fileName: string;
  overview: DatasetOverview;
  onReset: () => void;
}

export function DashboardHeader({ fileName, overview, onReset }: DashboardHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{fileName}</h1>
          <p className="text-sm text-gray-400">
            {overview.n_rows.toLocaleString()} rows &times; {overview.n_columns} columns &bull; {overview.memory_usage_display}
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:border-primary/30 hover:bg-white/[0.08] hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" />
        Upload New
      </button>
    </motion.div>
  );
}
