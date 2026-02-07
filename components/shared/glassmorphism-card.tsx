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
        "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
        hover &&
          "transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
