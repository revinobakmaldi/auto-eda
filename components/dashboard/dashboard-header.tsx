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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {overview.n_rows.toLocaleString()} rows &times; {overview.n_columns} columns &bull; {overview.memory_usage_display}
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 transition-all hover:border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" />
        Upload New
      </button>
    </motion.div>
  );
}
