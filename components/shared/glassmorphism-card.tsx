"use client";

import { motion } from "framer-motion";
import { cardVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassmorphismCard({
  children,
  className,
  hover = true,
}: GlassmorphismCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 p-6 backdrop-blur-md",
        hover &&
          "transition-all duration-300 hover:border-primary/30 hover:bg-white dark:hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
